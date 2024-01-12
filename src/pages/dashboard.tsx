import React, {useEffect, useState} from "react";
import ProfileNavigation from "../components/shared/ProfileNavigation/ProfileNavigation";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Collapse,
    Divider,
    Flex,
    FormControl,
    FormHelperText,
    Icon,
    Image,
    SimpleGrid,
    Text,
    Textarea,
    Tooltip,
    useDisclosure
} from "@chakra-ui/react";
import AdminContainer from "../components/admin/container/adminContainer";
import {getToken, isAdmin} from "./api/api.storage";
import Chart from "chart.js/auto";
import {Bar} from 'react-chartjs-2'
import {CategoryScale} from 'chart.js';
import {ArrowUpDownIcon, CheckCircleIcon, CheckIcon, CloseIcon, EditIcon, InfoOutlineIcon} from "@chakra-ui/icons";
import {TutorModel} from "../models/TutorModel";
import {GetServerSideProps} from "next";
import {SubmitButton} from "../components/shared/Buttons";
import {UserModel} from "../models/UserModel";

import DashboardTable from "../components/admin/container/dashboardTable";
import {Router, useRouter} from "next/router";
import * as io from "socket.io-client";
Chart.register(CategoryScale);

interface PageProps {
    accessToken: string,
    tutorData: TutorModel,
}
const socket = io.connect("ws://localhost:3001", {transports: ['websocket', 'polling', 'flashsocket']});
const Dashboard = ({tutorData, accessToken}: PageProps) => {
    const [isAuth, setIsAuth] = useState(false)
    const [tutor, setTutor] = useState(tutorData as UserModel)
    const {isOpen, onToggle} = useDisclosure()
    const baseUrl = "http://localhost:8001/tickets"
    const [map, setMap] = useState(new Map());
    const [isEditing, setIsEditing] = useState(false)
    const [textValue, setValue] = useState("")
    const [isInvalidArea, setIsInvalidArea] = useState(true);
    const router = useRouter()

    const [chartMap, setChartMap] = useState(new Map());
    const [dataa, setDataa] = useState([]);
    let [arrayChartData, setArrayChartData] = useState<[]>();
    const [selectedOption, setSelectedOption] = useState(null);

    const [imageUrl, setImageUrl] = useState(null);


    useEffect(() => {
        setIsAuth(isAdmin(accessToken))
        if (isAuth) {
            socket.on('data', (result: any) => {
                // console.log('Getting Data', result)
                getChartData(result);
                setDataa(result);
            });
        } else {
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
                }).catch((error) => {
                console.error(error);
            })
        }

        // }

    }, []);

    const getChartData = (fromSocket: any) => {
        let myMap = new Map();
        let array: any = [];
        let ticket: string;
        try {
            // console.log("The following data is: ", fromSocket)
            fromSocket.sort((a: any, b: any) => {
                const dateA = new Date(a.dateCreated);
                const dateB = new Date(b.dateCreated);
                if (dateA < dateB) {
                    return -1;
                }
                if (dateA > dateB) {
                    return 1;
                }
                console.log("Im here in sortFunction.")
                return 0;
            }).map((obj: any) => {


                ticket = new Date(obj.dateCreated).toLocaleDateString('en-us', {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                })
                myMap.set(ticket, myMap.get(ticket) + 1 || 1);
                setChartMap(myMap)
                array.push(obj)
                setArrayChartData(array)
                console.log("Im here in mapFunction.")
                //Add date to an Array of
                //Check if there are similar dates, sum to the date that is already in the Array


            })
        } catch (err) {
            throw new Error()
        }
    }

        const chartData = {
            labels: Array.from(chartMap.keys()),
            // labels : chart.map(obj=>()),
            datasets: [
                {
                    label: 'Dataset 2',
                    // data: [0, 10, 20, 30, 93, 60, 80, 110, 65],
                    data: Array.from(chartMap.values()),
                    // data: [0, 10, 20, 30, 93, 60, 80, 110, 65],
                    backgroundColor: '#4EA4B1',
                    borderRadius: 10,
                    barThickness: 30,
                    // borderWidth: 2,
                    borderSkipped: false, // To make all side rounded
                },
            ],
        };
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right' as const,
                    display: false
                },
                title: {
                    display: true,
                    text: 'Check out each column for more details',
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false, // <-- this removes y-axis line
                    }
                },
                y: {

                    // type: 'realtime',
                    display: false,
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false,
                        // drawBorder: false
                    }
                },
            }
        };

        const handleEdit = () => {
            setValue("")
            setIsEditing(!isEditing)
            setIsInvalidArea(true)
        }

        const handleChangeEvent = (event: any) => {
            setValue(event.target.value);
            setIsInvalidArea(!(event.target.value.length > 15))

        };

        const handleSubmit = () => {
            setIsEditing(!isEditing)
            tutor.profile.bio = textValue

            fetch('http://localhost:8000/tutor/' + tutor._id, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': 'http://localhost:8000',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify({profile: tutor.profile}),
            }).then(response => response.json()).then(result =>
                setTutor(result)
            )
        }

        function handleAccept(input: string, id: string): void {
            let requestId: any;
            let tutorEmail: any;
            let tutorName: any;
            let status: any;

            tutor.request?.map((request) => {
                if (request._id === id) {
                    request.status = input
                    requestId = request._id
                    tutorName = request.firstName
                    tutorEmail = request.email
                    status = request.status
                }
            })
            fetch('http://localhost:8000/tutor/' + tutor._id, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': 'http://localhost:8000',
                },
                mode: "cors",
                credentials: "include",
                body: JSON.stringify({request: tutor.request, data: {requestId, tutorName, tutorEmail, status}}),
            }).then(response => response.json()).then(result =>
                setTutor(result)
            )
        }

        function getAge(birthdate?: string): number {
            const currentDate = new Date()
            const formattedDateString = birthdate?.substr(6, 4) + '-' + birthdate?.substr(3, 2) + '-' + birthdate?.substr(0, 2)
            const date = new Date(formattedDateString)
            const difference = currentDate.getTime() - date.getTime()

            return Math.floor(difference / (1000 * 60 * 60 * 24 * 365))
        }

        function isVerified(): boolean {
            return tutor.verified as boolean
        }

        function isValidNumber(): boolean {
            return tutor.phoneNumber?.toLocaleString().length == 10;
        }

        if (isAuth) {
            return (
                <AdminContainer>
                    <Flex color='black' minWidth='max-content' gap='20'>
                        <Card
                            maxW='md'
                            maxH="md"
                            h=''
                            w='40%'
                            // cursor='pointer'
                            bg="#FFFFFF"
                            borderRadius='10'>
                            <CardBody>
                                <Text as='b'>Daily Tickets</Text>
                                <Bar
                                    data={chartData}
                                    options={options}
                                />
                            </CardBody>
                        </Card>

                        <Card
                            // maxW='md'
                            maxH="md"
                            w='45%'
                            // cursor='pointer'
                            bg="#FFFFFF"
                            borderRadius='10'>
                            <CardBody>
                                <Text as='b'>Tickets By Status</Text>
                                {/*<Bar*/}
                                {/*    data={chartData}*/}
                                {/*    options={options}*/}
                                {/*/>*/}
                            </CardBody>
                        </Card>
                        <Card
                            maxW='45%'
                            maxH="md"
                            w='40%'
                            // cursor='pointer'
                            bg="#FFFFFF"
                            borderRadius='10'>
                            <CardBody>
                                <Text as='b'>Activity</Text>
                            </CardBody>
                        </Card>
                    </Flex>


                    <Flex color='black' minWidth='max-content' gap='20'>
                        <Card
                            mt={5}
                            minH="100%"
                            w='66%'
                            bg="#FFFFFF"
                            borderRadius='10'
                            variant={'elevated'}>
                            <CardBody>
                                <Text as='b'>Recent Tickets</Text>
                                <DashboardTable data={dataa}/>
                            </CardBody>
                        </Card>

                        <Card
                            mt={5}
                            // minH="100%"
                            w='30%'
                            bg="#FFFFFF"
                            borderRadius='10'
                            variant={'elevated'}>
                            <CardBody>
                                <Text as='b'>Last Updates</Text>
                                <Box
                                    bg="#107385"
                                    borderRadius='20'
                                    py="5px"
                                    px="18px">
                                    <Text color="#F5F5F5">/u</Text>
                                </Box>
                                {/*<DashboardTable/>*/}
                            </CardBody>
                        </Card>
                    </Flex>
                </AdminContainer>
            )
        } else return (
            <Box>
                <ProfileNavigation role={tutor.role}/>
                <Box p={5} display={{lg: 'flex'}}>
                    <Box flex={1}>
                        <Card boxShadow={'xl'} borderRadius={20}>
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
                                    {tutor.firstName} {tutor.lastName} ({getAge(tutor.dateOfBirth)})
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
                            <CardBody>
                                <SimpleGrid columns={2} spacing={12}>
                                    <Text
                                        fontWeight='bold'
                                        fontSize={'large'}>
                                        Profile verified
                                    </Text>
                                    <Icon
                                        display={!isVerified() ? 'block' : 'none'}
                                        as={CloseIcon}
                                        boxSize={4}
                                        alignSelf={'center'}
                                        color='red.500'/>
                                    <Icon
                                        display={isVerified() ? 'block' : 'none'}
                                        as={CheckCircleIcon}
                                        boxSize={5}
                                        alignSelf={'center'}
                                        color='green.500'/>
                                </SimpleGrid>
                                <Text
                                    fontSize={'medium'}
                                    color={'green'}>
                                    E-mail
                                </Text>
                                <Text
                                    color={isValidNumber() ? 'green' : 'red'}
                                    fontSize={'medium'}>
                                    Mobile number
                                </Text>

                                <Box
                                    display={tutor.role === 'student' ? 'none' : 'block'}>
                                    <Divider
                                        mt={3}
                                        mb={3}
                                    />
                                    <SimpleGrid columns={2} spacing={12}>
                                        <Text
                                            fontSize={'large'}
                                            fontWeight='bold'>
                                            Reviews
                                        </Text>
                                        <Text
                                            fontSize={'large'}
                                            fontWeight='bold'>
                                            ({tutor.review?.length})
                                        </Text>
                                    </SimpleGrid>
                                </Box>

                            </CardBody>
                        </Card>
                    </Box>
                    <Box flex={3}>
                        <Box
                            flex={3}
                            pl={2}>
                            <Card
                                display={tutor.role === 'student' ? 'none' : 'block'}
                                mb={5}
                                borderRadius={20}
                                boxShadow={'xl'}
                            >
                                <CardHeader>
                                    <Flex
                                        flex='1'
                                        flexDirection="row"
                                        justifyContent={"space-between"}
                                        gap='4'
                                        flexWrap='wrap'>
                                        <Text
                                            as="h2"
                                            color='blueGreen'
                                            mt={3}
                                            fontWeight='bold'>
                                            About Me!
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
                                        {tutor.profile?.bio}
                                    </Text>
                                    <Box
                                        display={isEditing ? 'block' : 'none'}>
                                        <FormControl
                                            pt={2}>
                                            <Textarea
                                                isInvalid={isInvalidArea}
                                                fontSize={'sm'}
                                                value={textValue}
                                                onChange={handleChangeEvent}
                                            />
                                            <FormHelperText>Minimum character length is 20</FormHelperText>
                                        </FormControl>
                                        <Flex justifyContent={'end'}>
                                            <SubmitButton
                                                isDisabled={isInvalidArea}
                                                label={'save-description'}
                                                onClick={handleSubmit}>
                                                Save Changes
                                            </SubmitButton>
                                        </Flex>
                                    </Box>
                                </CardBody>
                            </Card>
                        </Box>
                        <Box
                            flex={3}
                            pl={2}>
                            <Card
                                mb={5}
                                borderRadius={20}
                                boxShadow={'xl'}
                            >
                                <CardHeader >
                                    <Text as="h2"
                                          color='blueGreen'
                                          mt={3}
                                          fontWeight='bold'>
                                        My lesson requests
                                    </Text>
                                    <Divider
                                        mt={3}
                                    />
                                </CardHeader>
                                <CardBody >
                                    <Box maxHeight="450px" overflowY="scroll">
                                    {tutor.request?.sort((a, b) => {
                                        return new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf();
                                    }).map((request) => {
                                        if (request.status === "pending") {
                                            return (
                                                <Card
                                                    key={request._id}
                                                    mt={4}
                                                    p={2}>
                                                    <CardBody>
                                                        <Flex key={request._id} alignItems="center">
                                                            <Flex flex='1' flexDirection="row"
                                                                  justifyContent={"space-between"} gap='4'
                                                                  alignItems='center' flexWrap='wrap'>
                                                                <Flex alignItems={"center"}>
                                                                    <Avatar
                                                                        name={request.firstName + " " + request.lastName}/>
                                                                    <Text
                                                                        ml={2}
                                                                        fontWeight={'bold'}
                                                                        fontSize={'large'}>{request.firstName + " " + request.lastName}</Text>
                                                                </Flex>
                                                                <Flex>
                                                                    <Box
                                                                        alignSelf={'baseline'}
                                                                    >
                                                                        <Text fontSize={''}>
                                                                            Subject: {request.subject} - {request.location}
                                                                        </Text>
                                                                        <Text fontSize={'xx-small'}>
                                                                            Created at: {new Date(request.created_at).toDateString() + ' at ' + new Date(request.created_at).toTimeString().split('G')[0]}
                                                                        </Text>
                                                                    </Box>

                                                                </Flex>
                                                                <Flex
                                                                    display={tutor.role === 'student' ? 'none' : 'block'}>
                                                                    <Button
                                                                        alignSelf={'baseline'}
                                                                        size='sm'
                                                                        colorScheme='teal' mr={2}
                                                                        onClick={() => handleAccept("accepted", request._id)}>
                                                                        Accept
                                                                    </Button>
                                                                    <Button
                                                                        alignSelf={'baseline'}
                                                                        size='sm'
                                                                        colorScheme='red' mr={2}
                                                                        onClick={() => handleAccept("rejected", request._id)}>
                                                                        Reject
                                                                    </Button>
                                                                </Flex>
                                                                <Flex
                                                                    display={tutor.role === 'tutor' ? 'none' : 'block'}>
                                                                    <Tooltip label='PENDING'>
                                                                        <Icon as={InfoOutlineIcon} boxSize={6} color='orange' />
                                                                    </Tooltip>
                                                                </Flex>
                                                            </Flex>
                                                        </Flex>

                                                    </CardBody>

                                                </Card>

                                            );
                                        }

                                    })}
                                    </Box>

                                </CardBody>
                            </Card>
                        </Box>
                        <Box
                            flex={3}
                            pl={2}>
                            <Card
                                mb={5}
                                borderRadius={20}
                                boxShadow={'xl'}>
                                <CardHeader
                                    cursor='pointer'
                                    onClick={onToggle}>
                                    <Flex flex='1' flexDirection="row" justifyContent={"space-between"} gap='4'
                                          alignItems='center' flexWrap='wrap'>
                                        <Text as="h2"
                                              color='blueGreen'
                                              mt={3}
                                              fontWeight='bold'>
                                            Accepted requests
                                        </Text>
                                        <Icon
                                            as={ArrowUpDownIcon}
                                            border='2px' borderColor='gray.200'
                                            p={1}
                                            boxSize={7}
                                            onClick={onToggle}/>
                                    </Flex>
                                    <Divider
                                        mt={3}
                                    />
                                </CardHeader>
                                <Collapse in={isOpen} animateOpacity>
                                    <CardBody>
                                        <Box maxHeight="450px" overflowY="scroll">
                                        {tutor.request?.map((request) => {
                                            if (request.status === "accepted") {
                                                return (
                                                    <Card
                                                        key={request._id}
                                                        pt={2}
                                                        mt={4}>
                                                        <CardBody>
                                                            <Flex key={request._id} alignItems="center">
                                                                <Flex flex='1' flexDirection="row"
                                                                      justifyContent={"space-between"} gap='4'
                                                                      alignItems='center' flexWrap='wrap'>

                                                                    <Flex alignItems={"center"}>
                                                                        <Avatar
                                                                            name={request.firstName + " " + request.lastName}/>
                                                                        <Text
                                                                            ml={2}
                                                                            fontWeight={'bold'}
                                                                            fontSize={'large'}>{request.firstName + " " + request.lastName}</Text>
                                                                    </Flex>
                                                                    <Flex>
                                                                        <Box
                                                                            alignSelf={'baseline'}>
                                                                            <Text>
                                                                                Subject: {request.subject} - {request.location}
                                                                            </Text>
                                                                        </Box>

                                                                    </Flex>
                                                                    <Icon
                                                                        as={CheckIcon}
                                                                        boxSize={6}
                                                                        color='green'/>
                                                                </Flex>
                                                            </Flex>
                                                        </CardBody>
                                                    </Card>
                                                );
                                            }
                                        })}
                                        </Box>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Box>
                    </Box>

                </Box>
            </Box>
        )
    }

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const accessToken = JSON.stringify(ctx.req.cookies.access_token)
    const response = await fetch('http://localhost:8000/tutor/details', {
        method: "GET",
        credentials: "include",
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            Cookie: accessToken
        }
    });

    const tutorData = await response.json()

    return {
        props: {tutorData, accessToken},
    };
}

export default Dashboard
