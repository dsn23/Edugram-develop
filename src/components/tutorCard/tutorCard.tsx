/**
 * @author Bugra Karaaslan, 500830631, This is the tutorCard component.
 * On this page you can get detailed information about a tutor you are interested in.
 */
import {
    Tr,
    Td,
    Box,
    Flex,
    Text,
    Table,
    Tbody,
    TableContainer,
    useToast,
    useDisclosure,
    ModalOverlay,
    ModalBody,
    ModalHeader,
    ModalContent,
    ModalFooter,
    ModalCloseButton, Modal, Button, Textarea, Checkbox,
} from "@chakra-ui/react";
import * as icon from "react-icons/ai";
import {IconContext} from "react-icons";
import Image from "next/image";
import {TutorModel} from "../../models/TutorModel";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {colors} from "../../theme/colors";


// components
import {SubmitButton} from "../shared/Buttons";
import {wait} from "next/dist/build/output/log";
import {chosenChat, setId} from "../../pages/ChatSidebar";
import Bottombar from "../chatComponents/Bottombar";
import {UserModel} from "../../models/UserModel";
import {getMessages} from "../../pages/chats";

interface PageProps {
    accessToken: string,
    tutorData: TutorModel,
    value?: string
}

interface ComponentProps {
    student: UserModel
    tutor: TutorModel,
}

export function TutorCard({tutor, student}: ComponentProps) {
    const lessons = ["English", "Maths", "Programming", "French", "Photoshop"];
    const [isVerified, setVerified] = useState(false);
    const [textValue, setTextValue] = useState(
        '');
    const {isOpen, onOpen, onClose} = useDisclosure()
    const toast = useToast()
    const router = useRouter()
    const {query: {subject},} = router

    const checkIfTutorIsVerfied = () => {
        if (tutor.profile?.isVerified == true) {
            setVerified(true)
        }
    }

    useEffect(() => {
        checkIfTutorIsVerfied()
        const fetchData = async () => {
            // get the data from the api
            const data = await fetch('http://localhost:8000/cookie', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': 'http://localhost:8000/',
                },
                credentials: "include",
            }).then(async r => {
                    const student = await r.json()
                    setTextValue(`Dear ${tutor.firstName},\n
My name is ${student.firstName ? student.firstName : 'name unknown'} and I am looking for a tutor that gives ${subject}.
The lessons can be the best at your place (in ${tutor.address?.city ? tutor.address.city : "City unknown"}) or at my place (in ${student.address?.city ? student.address.city : 'Unknown City'}) 
I would like to start my lessons as soon as possible.
Ideally, would you be able to contact me so we can discuss all the details? \n
Thank you very much and have a nice day,
Sincerely, ${student.firstName ? student.firstName : 'firstname unknown'} ${student.lastName ? student.lastName : 'lastName unknown'}
`)
                }
            )
        }
        fetchData().catch(console.error)
    }, [])

    const bookLesson = () => {
        const redirectToChatPage = (chatName: string, chatId: string) => {
            console.log(chatId)
            router.push({
                pathname: `http://localhost:3000/chats`,
            }).then(() => {
                chosenChat(tutor.firstName, chatId)
            })
        }

        fetch('http://localhost:8000/student/booking', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': 'http://localhost:8000/',
            }, mode: "cors",
            credentials: "include",
            body: JSON.stringify({
                request: {
                    tutorId: tutor._id,
                    subject: subject,
                    message: textValue,
                    location: tutor.address?.city,
                    firstName: tutor.firstName,
                    lastName: tutor.lastName
                },
            }),
        }).then(r => r.json()).then((chatId) => {
            if (chatId) {
                console.log(chatId)
                toast({
                    title: 'Success',
                    description: 'Successfully sent request',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                redirectToChatPage(tutor.firstName, chatId.chatId)
                // setTimeout(() => ), 2000)
            }
        }).catch((error) => {
            // console.log(error)
            alert(error)
        })
    }

    // @ts-ignore
    return (
        <Flex
            bg="lightBlue"
            borderRadius={20}
            minW={{base: "350px", lg: "450px"}}
            justify="flex-start"
            flexDir="column"
            align="center"
            p="25px 0px"
            maxH={770}
        >
            <Box>
                <Image
                    src="/images/default-profile-image.png"
                    alt="Profile image"
                    width={220}
                    height={195}
                    quality={100}
                    style={{borderRadius: "30px", marginTop: "50px", width: "220px", height: "195px"}}
                />
                <IconContext.Provider
                    value={{
                        style: {
                            color: `${colors.blueGreen}`,
                            top: "-5%",
                            left: "80%",
                            zIndex: 2,
                            marginTop: "-20px",
                            position: "relative",
                            display: isVerified ? "block" : "none"
                        },
                    }}
                >
                    <icon.AiFillCheckCircle size={40}/>
                </IconContext.Provider>
            </Box>

            <Text as="h2" mt={2} fontWeight={600}>
                {tutor.firstName}
            </Text>

            <Flex flexDir="row" align="center">
                <IconContext.Provider value={{style: {color: "yellow"}}}>
                    <icon.AiFillStar/>
                    <Text ml={1} textDecoration="underline">
                        4 (2 reviews)
                    </Text>
                </IconContext.Provider>
            </Flex>

            <Flex mt={6} w={{base: 300, lg: 400}} h={{base: 250, lg: 150}} flexFlow="wrap">
                {lessons.map((lesson, index) => {
                    return (
                        <Flex
                            key={index}
                            maxW={140}
                            maxH="40px"
                            justify="center"
                            borderRadius={20}
                            color="white"
                            p={4}
                            alignItems="center"
                            bg="blueGreen"
                            m={2}
                        >
                            {lesson}
                        </Flex>
                    );
                })}
            </Flex>

            <TableContainer>
                <Table variant="unstyled">
                    <Tbody>
                        <Tr>
                            <Td>Hourly rate:</Td>
                            {
                                tutor.course?.map((course, index) => {
                                    if (course.subject == subject)
                                        return (
                                            <Td key={index} isNumeric>${course.fee}</Td>
                                        )
                                })
                            }
                        </Tr>
                        <Tr>
                            <Td>Response time:</Td>
                            <Td isNumeric>24h</Td>
                        </Tr>
                        <Tr>
                            <Td>Number of students:</Td>
                            <Td isNumeric>8</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>

            <SubmitButton mt={6} label="book a lesson" onClick={onOpen}>
                Book a lesson
            </SubmitButton>

            {/*MODAL CONTENT HERE*/}

            <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
                <ModalOverlay/>
                <ModalContent backgroundColor={'#4EA4B1'}>
                    <ModalHeader color={'white'}>Book a lesson</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Box>
                            <Text as={'h2'} color={'white'}> Set up an editable message to send
                                to {tutor.firstName} {tutor.lastName} (optional)</Text>
                            <Text as={'em'} fontSize={'sm'} color={'white'}> Leaving it blank will send the auto message
                                as seen below</Text>
                            <Textarea
                                borderColor={'white'}
                                _focus={{borderColor: 'white'}}
                                color={'white'}
                                fontSize={'md'}
                                height={'md'}
                                value={textValue}
                                onChange={(e) => {
                                    setTextValue(e.target.value)
                                }}
                            />
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button color={'white'} colorScheme={'red'} mr={3} onClick={onClose}>
                            cancel
                        </Button>
                        <Button variant='ghost' bg={"#FFCA48"} color={'white'} onClick={bookLesson}>Book lesson</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default TutorCard;
