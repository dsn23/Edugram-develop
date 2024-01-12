/**
 * @author Daniel Kumankumah, 500811456
 * This page provides a list of tutors in a grid of cards
 * List of tutors are filter based on subject and can be sorted
 * Every tutor has an image, name, rating and short bio
 */
import {
    Box,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    HStack,
    SimpleGrid,
    Stack,
    Image,
    Text,
    Grid,
    useRadio,
    useRadioGroup, GridItem
} from "@chakra-ui/react";
import { TutorModel } from "../../models/TutorModel";
import Router, { useRouter } from "next/router";
import {GetServerSideProps} from "next";

interface PageProps {
    tutors: TutorModel[]
    subject: string
}

export default function Overview ({ tutors, subject }: PageProps) {
    const router = useRouter();

    const redirectToTutorPage = (id: string) => {
        router.push({pathname: `http://localhost:3000/tutor/`+id , query: { subject } })
    }

    const options = ['Price', 'Response time', 'Name']

    const handleChange = (value: String) => {
        switch (value) {
            case options[0]:
                sortFee();
                break;
            case options[1]:
                tutors.reverse()
                break;
            case options[2]:
                sortName()
                break;
        }
    }

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'filter',
        onChange: handleChange,
    })

    const group = getRootProps()
    return (
        <Box>
            <Box
                justifyContent = "center"
                px={20}
                paddingTop={10}>

                <Grid  templateColumns={'15% 70% 15%'}>
                    <GridItem
                        mx="6%">
                        <HStack {...group}
                                py = "15px">
                            <Box
                                bg= "#107385"
                                borderRadius='20'
                                py = "5px"
                                px = "18px">
                                <Text color="#F5F5F5">Close to you</Text>
                            </Box>
                            {options.map((value) => {
                                const radio = getRadioProps({ value })
                                return (
                                    <RadioCard key={value} {...radio}>
                                        {value}
                                    </RadioCard>
                                )
                            })}

                        </HStack>
                        <Text as = "h1"
                              data-cy="tutorheader"> {tutors.length} Tutors found for {subject}</Text>
                    </GridItem>
                    <GridItem  order={-3} >
                    </GridItem>

                </Grid>

            </Box>

            <Flex
                justifyContent = "center"
                bg="#E5E5E5"
                px={20}
                paddingTop={5}
                paddingBottom={5}
            >
                <SimpleGrid columns={[1, null, 3]}  spacingX="20px" spacingY="10px" textAlign="center" >
                    {tutors?.map(tutor => {
                            return (
                                <Card
                                    maxW='sm'
                                    maxH= "md"
                                    key={tutor._id}
                                    cursor='pointer'
                                    bg="#FFFFFF"
                                    borderRadius='20'
                                    data-cy="card"
                                    onClick={() => redirectToTutorPage(tutor._id)}>
                                    <Box
                                        height= "40%">
                                        <Image
                                            objectFit='cover'
                                            borderRadius={20}
                                            width = "100%"
                                            height = "100%"
                                            src={'/img_avatar.png'}
                                            alt={`student foto of ${tutor.firstName} + ${tutor.lastName} `}
                                        />
                                        <Box justifyContent="end"
                                             bg="#4EA4B1" position="absolute"
                                             borderTopLeftRadius="0"
                                             borderBottomRightRadius="0"
                                             borderTopRightRadius ="20"
                                             borderBottomLeftRadius ="20"
                                             marginTop = "-44px"
                                             py = "10px"
                                             px = "15px"
                                        >
                                            <Text color="#F5F5F5">{tutor.firstName}</Text>
                                        </Box>
                                    </Box>

                                    <CardHeader>
                                        <HStack justifyContent="center">
                                            <Image src="/Vector.png"
                                                 alt={`star rating`}/>
                                            <Text>Reviews</Text>
                                        </HStack>
                                    </CardHeader>
                                    <CardBody>
                                        <Stack>
                                            <Text>{tutor.firstName}</Text>
                                            <Text>{tutor.profile?.bio}</Text>
                                        </Stack>
                                    </CardBody>
                                    <CardFooter paddingBottom = "20px">
                                        <HStack>
                                            <Box
                                                bg= "#107385"
                                                borderRadius='20'
                                                py = "5px"
                                                px = "18px">
                                                <Text color="#F5F5F5">${getFee(tutor)}/u</Text>
                                            </Box>
                                            <Box
                                                bg= "#107385"
                                                borderRadius='20'
                                                py = "5px"
                                                px = "18px">
                                                <Text color="#F5F5F5">1st lesson free</Text>
                                            </Box>
                                        </HStack>
                                    </CardFooter>
                                </Card>
                            )
                        }
                    )}
                </SimpleGrid>
            </Flex>
        </Box>
    )

    function sortFee() {
        tutors = tutors.sort((n1, n2) => {
            if (getFee(n1) > getFee(n2)) {
                return 1;
            }

            if (getFee(n1) < getFee(n2)) {
                return -1;
            }

            return 0;
        });
    }

    function sortName() {
        tutors = tutors.sort((n1, n2) =>
            n1.firstName.localeCompare(n2.firstName));
    }

    function getFee(tutor: TutorModel) : number {
        let fee = 0;
        tutor.course?.forEach((value) => {
            if(subject == value.subject){
                fee = value.fee
            }
        })
        return fee;
    }
}

export function RadioCard(props: any) {
    const { getInputProps, getCheckboxProps } = useRadio(props)

    const input = getInputProps()
    const checkbox = getCheckboxProps()

    return (
        <Box as='label'>
            <input {...input} />
            <Box
                {...checkbox}
                cursor='pointer'
                borderRadius='20'
                py = "5px"
                px = "18px"
                boxShadow='md'
                _checked={{
                    bg: '#107385',
                    color: 'white',
                    borderColor: '#107385',
                }}
                _focus={{
                    boxShadow: 'outline',
                }}
            >
                {props.children}
            </Box>
        </Box>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const subject = context.params?.subject

    const res = await fetch('http://localhost:8000/tutor/search/' + subject)
    const tutors = await res.json()

    return {
        props: {
            tutors,
            subject
        },
    };
}
