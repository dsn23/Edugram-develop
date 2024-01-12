import {
    Text,
    Box,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Icon,
    Image,
    Divider,
    SimpleGrid,
    useRadio,
    useRadioGroup,
    VStack,
    HStack,
    Tag,
    TagLabel,
    FormControl,
    FormLabel,
    FormHelperText,
    Textarea,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Select,
    DrawerFooter,
    Button,
    Stack,
    useToast,
    useDisclosure,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper, InputLeftAddon, InputGroup
} from "@chakra-ui/react";
import ProfileNavigation from "../components/shared/ProfileNavigation/ProfileNavigation";
import {AddIcon, EditIcon} from "@chakra-ui/icons";
import React, {useEffect, useState} from "react";
import {TutorModel} from "../models/TutorModel";
import {Course} from "../models/CourseModel";
import {getToken} from "./api/api.storage";
import {useRouter} from "next/router";
import {GetServerSideProps} from "next";
import { SubmitButton } from "../components/shared/Buttons";
import {SubjectModel} from "../models/SubjectModel";

interface PageProps {
    accessToken: string,
    tutorData: TutorModel,
    subjects: SubjectModel[]
}

export default function Courses ({tutorData, accessToken, subjects}: PageProps) {
    const [tutor, setTutor] = useState(tutorData as TutorModel)
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [isEditingFee, setIsEditingFee] = useState(false)
    const [courseSelected, setCourseSelected] = useState(false)
    const [subject, setSubject] = useState({} as Course)
    const [value, setValue] = useState(subject.subject);
    const [selectedValue, setSelectedValue] = useState("");
    const [feeValue, setFeeValue] = useState(20)
    const [alterFeeValue, setAlterFeeValue] = useState(20)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isInvalidArea, setIsInvalidArea] = useState(true);
    const [isInvalidTextArea, setIsInvalidTextArea] = useState(true);

    const [isInvalidOption, setIsInvalidOption] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const toast = useToast()

    useEffect(() => {
        if(tutor.role !== "tutor") {
            router.back()
        }
        fetch("http://localhost:8000/tutor/get_image", {
            method: 'GET',
            credentials: "include",
        })
            .then(response => response.json())
            .then(data => {
                if (!data.image) {
                    throw  new Error('Image not found')
                }
                const imageSrc = `data:${data.image.contentType};base64,${Buffer.from(data.image.data).toString('base64')}`;

                setImageUrl(imageSrc);
            }).catch((error)=>{
            console.error(error);
        })
    }, []);

    const handleChangeEvent = (event:any) => {
        setValue(event.target.value);
        setIsInvalidTextArea(!(event.target.value.length > 15));
    };

    const options = tutor.course?.map(course => {
        return course.subject
    })

    const isInvalid = () => {
        return isInvalidOption || isInvalidArea;
    }

    const handleEdit = () => {
        setValue("")
        setIsEditing(!isEditing)
    }

    const handleEditFee = () => {
        setIsEditingFee(!isEditingFee)
    }

    const handleAddDescription = (event: any) => {
        const { value } = event.target;
        setValue(value);
        setIsInvalidArea(!(value.length > 15));
    };

    const handleClose = () => {
        setSelectedValue('');
        setIsInvalidOption(true);
        setIsInvalidArea(true);
        onClose()
    };

    const handleSubmit = () => {
        if(isEditing) {
            setIsEditing(!isEditing)
            if (typeof value === "string") {
                subject.courseDescription = value;
            }
            setSubject(subject)
            setValue("")
        }
        else if(isEditingFee) {

            setIsEditingFee(!isEditingFee)
            subject.fee=alterFeeValue
            setAlterFeeValue(20)

        }
        else {
            const newCourse = {subject: selectedValue, fee: feeValue, courseDescription: value!}
            tutor.course?.push(newCourse)
            toast({
                title: "Course Added",
                status: "success",
                isClosable: true})
        }

        fetch(`http://localhost:8000/tutor/` + tutor._id, {
            method: 'PATCH',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': `http://localhost:8000`,
                Cookie: accessToken
            },
            body: JSON.stringify({course: tutor.course }),
        }).then(response => response.json()).then(result => {
            setTutor(result)}

        )
        setIsInvalidArea(true);
        setIsInvalidOption(true);
        setSelectedValue("")
        setFeeValue(20)
        onClose()
    }

    const handleDelete = () => {
        const index = tutor.course!.indexOf(subject)
        tutor.course?.splice(index, 1)

        fetch(`http://localhost:8000/tutor/` + tutor._id, {
            method: 'PATCH',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': `http://localhost:8000`,
                Cookie: accessToken
            },
            body: JSON.stringify({course: tutor.course }),
        }).then(response => response.json()).then(result => {
            setTutor(result)
                toast({
                    title: "Course Deleted",
                    status: "warning",
                    isClosable: true})
            }
        )

        setCourseSelected(!courseSelected)
        setSubject({} as Course)

    }

    const handleClick = (value: String) => {
        tutor.course?.map((course, key)=>{
            if(course.subject === value) {
                setSubject(course)
            }
        })
        setCourseSelected(true)
    }

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'subject',
        // defaultValue: options.p,
        onChange: handleClick,
    })
    const group = getRootProps()

    // useEffect(() => {
    //     isAuthenticated() && isTutor(accessToken) ? getTutor(decodeJWT().id) : router.push('/')
    // }, [])

    return (
        <>
            <Box>
                <ProfileNavigation role={'tutor'}/>
                <Box p={5} display={{ lg: 'flex' }}>
                    <Box
                        flex={1}
                        mr={3}>
                        <Card
                            // border='2px'
                            cursor='pointer'
                            bg="blueGreen"
                            // bg="yellow"
                            onClick={onOpen}
                            mb={2}
                            borderRadius={10}>
                            <CardBody
                                pt={8}
                                pb={8}>
                                <Flex flexDirection="row" justifyContent={"space-between"} gap='4' alignItems='center' flexWrap='wrap'>
                                    <Box
                                        flex={2}>
                                        <Text
                                            color='white'
                                            fontWeight='bold'
                                            as = "h2">
                                            Add a new subject
                                        </Text>
                                    </Box>
                                    <Box
                                    >
                                        <Icon
                                            as={AddIcon}
                                            boxSize={6}
                                            color='white'
                                        />
                                    </Box>


                                </Flex>

                            </CardBody>
                        </Card>
                        <Box
                            height="400px" overflowY="scroll">
                            <VStack {...group}
                                    align="left">
                                {options?.map((value) => {
                                    const radio = getRadioProps({ value })
                                    return (
                                        <RadioCard key={value} {...radio}>
                                            {value}
                                        </RadioCard>
                                    )
                                })}
                            </VStack>
                        </Box>
                    </Box>
                    <Box flex={5}
                         mr={3}>
                        <Card
                            display={!courseSelected ? 'block' : 'none'}
                            mb={5}
                            borderRadius={20} >
                            <CardHeader>
                                <Flex
                                    flex='1'
                                    flexDirection="row"
                                    justifyContent={"space-between"}
                                    gap='4'
                                    flexWrap='wrap'>
                                    <Text
                                        color='blueGreen'
                                        mt={3}
                                        fontSize={'larger'}
                                        fontWeight='bold'>
                                        Instruction
                                    </Text>
                                </Flex>
                                <Divider
                                    mt={3}
                                />
                            </CardHeader>
                            <CardBody>
                                <Text
                                    fontSize={'sm'}>
                                    On the left you can add a new subject you would like to tutor.
                                    Choose a subject from the dropdown and add a short description to convince students
                                    to choose you.
                                </Text>
                                <Text
                                    fontSize={'sm'}
                                mt={2}>
                                    If wish to adjust the course description or your fee click on the subject and make your changes!
                                </Text>
                            </CardBody>
                        </Card>
                        <Card
                            mb={5}
                            borderRadius={20}
                            display={courseSelected ? 'block' : 'none'}>
                            <CardHeader>
                                <Flex
                                    flex='1'
                                    flexDirection="row"
                                    justifyContent={"space-between"}
                                    gap='4'
                                    flexWrap='wrap'>
                                    <Text
                                        color='blueGreen'
                                        mt={3}
                                        fontSize={'larger'}
                                        fontWeight='bold'>
                                        Add Short Description
                                    </Text>
                                    <Icon
                                        as={EditIcon}
                                        alignSelf="center"
                                        color='blueGreen'
                                        boxSize={6}
                                        cursor='pointer'
                                        onClick={handleEdit}/>
                                </Flex>
                                <Divider
                                    mt={3}
                                />
                            </CardHeader>
                            <CardBody>
                                <Text
                                    fontSize={'sm'}>
                                    {subject.courseDescription}
                                </Text>
                                <Box
                                    display={isEditing ? 'block' : 'none'}>
                                    <FormControl
                                        pt={2}>
                                        <Textarea
                                            isInvalid={isInvalidTextArea}
                                            fontSize={'sm'}
                                            value={value}
                                            onChange={handleChangeEvent}
                                        />
                                        <FormHelperText
                                            fontSize={15}>Keep it brief but catching for a higher clickrate.</FormHelperText>
                                        <FormHelperText
                                            fontSize={15}>Minimum character length is 20</FormHelperText>
                                    </FormControl>
                                    <Flex justifyContent={'end'}>
                                        <SubmitButton
                                            isDisabled={isInvalidTextArea}
                                            label={'save-description'}
                                            onClick={handleSubmit}>
                                            Save Changes
                                        </SubmitButton>
                                    </Flex>
                                </Box>
                            </CardBody>
                        </Card>
                        <Card
                            display={courseSelected ? 'block' : 'none'}
                            borderRadius={20} >
                            <CardHeader>
                                <Flex
                                    flex='1'
                                    flexDirection="row"
                                    justifyContent={"space-between"}
                                    gap='4'
                                    flexWrap='wrap'>
                                    <Text
                                        color='blueGreen'
                                        mt={3}
                                        fontSize={'larger'}
                                        fontWeight='bold'>
                                        Location
                                    </Text>
                                </Flex>
                                <Divider
                                    mt={3}
                                />
                            </CardHeader>
                            <CardBody>
                                <HStack spacing={4}>
                                    <Tag
                                        size={'md'}
                                        colorScheme='green'
                                        variant='solid'
                                        borderRadius='full'
                                    >
                                        <TagLabel>Webcam</TagLabel>
                                    </Tag>
                                </HStack>
                            </CardBody>
                        </Card>
                        <Flex
                            pt={'4'}
                            justifyContent={"space-between"}
                            textAlign={'center'}
                            display={courseSelected ? 'block' : 'none'}>
                            <Button
                                fontSize={'xs'}
                                cursor={'pointer'}
                                size={'md'}
                                colorScheme='red'
                                onClick={handleDelete}>Remove subject</Button>
                        </Flex>
                    </Box>
                    <Box flex={1.3}>
                        <Card borderRadius={20} >
                            <CardHeader>

                                {imageUrl ? (
                                    <Image src={imageUrl}
                                           borderRadius='full'
                                           boxSize='150px'
                                           height={{
                                               base: '50%', // 0-48em
                                               md: '30%', // 48em-80em,
                                               xl: '25%', // 80em+
                                           }} alt="Profile Image" margin="auto"/>
                                ) : (
                                    <Image src="images/placeholderImage.png"
                                           alt="Placeholder for image of Identity"
                                           fallbackSrc='https://via.placeholder.com/150'
                                           margin="auto"/>
                                )}
                                <Text
                                    mt={3}
                                    textAlign='center'
                                    fontSize={'larger'}
                                    fontWeight='bold'>
                                    {tutor.firstName} {tutor.lastName}
                                </Text>
                                <Text
                                    textAlign='center'
                                    fontSize={'large'}
                                    fontWeight='bold'
                                    color='grey'>
                                    {tutor.address?.city}
                                </Text>
                                <Divider
                                    mt={3}
                                />
                            </CardHeader>
                            <CardBody
                                display={courseSelected ? 'block' : 'none'}>
                                <SimpleGrid columns={2} spacing={12}>
                                    <Text
                                        fontSize={'medium'}
                                        fontWeight='bold'>
                                        Hourly Rate
                                    </Text>
                                    <Flex>
                                        <Text
                                            fontSize={'large'}
                                            fontWeight='bold'>
                                            €{subject.fee}
                                        </Text>
                                        <Icon
                                            as={EditIcon}
                                            ml={1}
                                            // alignSelf="center"
                                            color='blueGreen'
                                            boxSize={5}
                                            cursor='pointer'
                                            onClick={handleEditFee}/>
                                    </Flex>

                                </SimpleGrid>
                                <Box
                                    pt={2}
                                    display={isEditingFee ? 'block' : 'none'}>
                                    <InputGroup>
                                        <InputLeftAddon fontSize={'xs'}>€</InputLeftAddon>
                                        <NumberInput fontSize={'xs'} value={alterFeeValue} >
                                            <NumberInputField  fontSize={'xs'} onChange={(event) => {
                                                setAlterFeeValue(event.target.value as unknown as number);
                                            }}/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </InputGroup>
                                    <Flex
                                        pt={3}
                                        justifyContent={'end'}>
                                        <Button
                                            bg='yellow'
                                            size={'sm'}
                                            fontSize={'xs'}
                                            fontWeight={'md'}
                                            cursor={'pointer'}
                                            onClick={handleSubmit}
                                        >
                                            Save
                                        </Button>
                                    </Flex>

                                </Box>
                            </CardBody>
                        </Card>
                    </Box>
                </Box>
            </Box>
            <Drawer
                isOpen={isOpen}
                placement='left'
                size={'md'}
                onClose={handleClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader
                        borderBottomWidth='1px'
                        color='blueGreen'
                        fontSize={'md'}
                    >
                        Adding new course to your profile
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing='24px'>
                            <Box>
                                <FormLabel
                                    fontSize={'sm'}
                                    htmlFor='subject'
                                    color='blueGreen'>
                                    Select Subject</FormLabel>
                                <Select id='subject'
                                        placeholder='Select option'
                                        isInvalid={isInvalidOption}
                                        value={selectedValue}
                                        onChange={(e) => {
                                            setSelectedValue(e.target.value)
                                            if(e.target.value !== ""){
                                                setIsInvalidOption(false)
                                            } else setIsInvalidOption(true)
                                        }}
                                        fontSize={'sm'}
                                >

                                    {subjects.sort((a, b) => {
                                        if (a.name < b.name) {
                                            return -1;
                                        }
                                        if (a.name > b.name) {
                                            return 1;
                                        }
                                        return 0;
                                    }).map(s => {
                                        if(!options?.includes(s.name)){
                                            return(
                                                <option key={s.name} value={s.name}>{s.name}</option>
                                            )
                                        }
                                    })}
                                </Select>
                            </Box>
                            <Box>
                                <FormControl
                                    pt={2}>
                                    <FormLabel
                                        fontSize={'sm'}
                                        color='blueGreen'
                                        htmlFor='desc'>Description</FormLabel>
                                    <Textarea id='desc'
                                              isInvalid={isInvalidArea}
                                              fontSize={'sm'}
                                              onChange={handleAddDescription}
                                    />
                                    <FormHelperText
                                        fontSize={15}>Minimum character length is 20</FormHelperText>
                                </FormControl>
                            </Box>
                            <Box>
                                <FormLabel
                                    fontSize={'sm'}
                                    color='blueGreen'
                                    htmlFor='rate'>Hourly Rate</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon fontSize={'xs'}>€</InputLeftAddon>
                                    <NumberInput defaultValue={20} min={10} max={99} fontSize={'xs'}>
                                        <NumberInputField fontSize={'sm'} onChange={(event) => {
                                            if(event.target.value as unknown as number > 99) {
                                                setFeeValue(99)
                                            } else if(event.target.value as unknown as number < 10) {
                                                setFeeValue(10)
                                            } else setFeeValue(event.target.value as unknown as number);
                                        }}/>
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </InputGroup>
                            </Box>
                        </Stack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth='1px'>
                        <Button variant='outline' fontSize={'xs'} mr={3} onClick={handleClose}>
                            Cancel
                        </Button>
                        <SubmitButton
                            onClick={handleSubmit}
                            isDisabled={isInvalid()}
                            label={'add-course'}
                        >Add Course</SubmitButton>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const accessToken = JSON.stringify(ctx.req.cookies.access_token) ?? null
    const response = await fetch(`http://localhost:8000/tutor/details`, {
        method: "GET",
        credentials: "include",
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            Cookie: accessToken
        }
    });

    if (response.status !== 200) {
        ctx.res.writeHead(302, { Location: '/notFoundPage' });
        ctx.res.end();
        return { props: {} };
    }

    const tutorData = await response.json()
    if(tutorData.role === 'student') {
        ctx.res.writeHead(302, { Location: '/dashboard' });
        ctx.res.end();
        return { props: {tutorData} };
    }

    const res = await fetch(`http://localhost:8000/subject/`)
    const subjects = await res.json()

    return {
        props: {tutorData, accessToken, subjects},
    };
}

export function RadioCard(props: any) {
    const { getInputProps, getCheckboxProps } = useRadio(props)

    const input = getInputProps()
    const checkbox = getCheckboxProps()

    return (
        <Card
            as='label'
            {...checkbox}
            _hover={{
                bg: 'blue',
                color: 'white',
                borderColor: 'teal.600',
            }}
            _checked={{ bg: 'yellow',
                color: 'white',
            }}
            border='2px'
            cursor='pointer'
            borderColor="yellow"
            mb={2}
            borderRadius={10}>
            <CardBody
            >
                <input {...input} />
                <Text
                    fontWeight='bold'
                    as = "h2">
                    {props.children}
                </Text>
            </CardBody>
        </Card>
    )
}

