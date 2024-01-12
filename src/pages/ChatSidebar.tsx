import {Avatar, Button, Icon, Link, Flex, Text} from "@chakra-ui/react";
import {ArrowLeftIcon, DeleteIcon} from "@chakra-ui/icons"
// @ts-ignore
import {router} from "next/router";
import React, {useEffect, useRef, useState} from "react";
import * as io from "socket.io-client";
import {ChatModel} from "../models/ChatModel";
import {ChatUserModel} from "../models/ChatModel";

import {useLocation} from "react-router";
import {decodeJWT} from "./api/api.storage";
import {TutorModel} from "../models/TutorModel";
import {GetServerSideProps} from "next";

interface PageProps {
    accessToken: string,
    tutorData: TutorModel,
}

let chosenChatId = "";
let chosenUser = "";

let fullname = "";

export function setId(id: string) {
    chosenChatId = id;
}

export function chosenChat(chatName: string, chatId: string) {
    setId(chatId)
    chosenUser = chatName;
    router.push(`/chats`);
}

const socket = io.connect("ws://localhost:3001", { transports: ['websocket', 'polling', 'flashsocket'] });

export default function ChatSidebar({tutorData, accessToken}: PageProps) {
    const temp: ChatModel[] = [];
    const socketRef = useRef(socket);
    const [chatList, setChatlist] = useState<ChatModel[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<any>(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const user: ChatUserModel = {
            _id: decodeJWT(accessToken).id,
            firstName: decodeJWT(accessToken).firstName
        }
        fullname = decodeJWT(accessToken).firstName + " " + decodeJWT(accessToken).lastName;
        // console.log("Ingelogde user chat model: " + user.firstName + ": " + user._id);
        socket.emit('get-chats', user);
        socket.on("user-chats", (data) => {
            const tempArray: ChatModel[] = [];
            data.forEach(function (value: ChatModel) {
                if (value.tutor != null) {
                    // console.log("Chat: " + value)
                    tempArray.push(value)
                }
            });
            // console.log("This is tempArray: " + tempArray)
            setChatlist(tempArray);
        });
    },[chosenChatId]);

    const deleteChat = () => {
        const temp = chatList
        let idx = 0;
        chatList.map(chat => {
            if(chat._id == chosenChatId) {
                chat.messages.splice(0)
                setIndex(idx)
            } else idx++
        })
        temp.splice(index, 1)
        setChatlist(temp)
        socket.emit("delete-chat", chosenChatId)
        chosenChat("", "")
        window.location.reload()
    }

    return (
        <Flex
            borderLeftRadius="10px"
            w="300px"
            borderEnd="1px solid" borderColor="#4EA4B1"
            direction="column"
            bg="#4EA4B1"
        >
            <Flex
                h="81px" w="100%"
                align="center"
                justifyContent="space-between"
                borderBottom="1px solid" borderColor="#4EA4B1"
                p={3}
            >
                <Flex align="center">
                    <Avatar src="" margin={3}/>
                    <Text>{fullname}</Text>
                </Flex>
            </Flex>
            <Flex overflowX="hidden" overflowY="scroll" direction="column"
                  sx={{'::-webkit-scrollbar': {display: 'none'}}}>
                {chatList?.map(chat => {
                    if (decodeJWT(accessToken).role === "student") {
                        return (
                            <Flex key={chat._id} p={3} align="center"
                                  _hover={{bg: "gray.100", cursor: "pointer"}}
                                  justifyContent="space-between"
                                  sx={{
                                      bg: chat._id === selectedChatId ? 'white' : 'transparent',
                                      borderTop: "1px solid #F5F5F5"
                                  }}>
                                <Flex
                                    onClick={() => {
                                        setSelectedChatId(chat._id);
                                        chosenChat(chat.tutor.firstName, chat._id)}}>
                                    <Avatar src="" marginEnd={3}/>
                                    <Text alignSelf={'center'}>{chat.tutor.firstName}</Text>
                                </Flex>
                                {chat._id === selectedChatId &&(
                                    <Flex alignSelf="center">
                                        <Icon as={DeleteIcon}
                                              variant="outline"
                                              color="yellow"
                                              onClick={deleteChat}
                                        />
                                    </Flex>
                                )}
                            </Flex>
                        )
                    } else if (decodeJWT(accessToken).role === "tutor") {
                        return (
                            <Flex key={chat._id} p={3} align="center"
                                  _hover={{bg: "gray.100", cursor: "pointer"}}
                                  justifyContent="space-between"
                                  sx={{
                                      bg: chat._id === selectedChatId ? 'white' : 'transparent',
                                      borderTop: "1px solid #F5F5F5"
                                    }}>
                                <Flex
                                    onClick={() => {
                                        setSelectedChatId(chat._id);
                                        chosenChat(chat.student.firstName, chat._id)}}>
                                    <Avatar src="" marginEnd={3}/>
                                    <Text alignSelf={'center'}>{chat.student.firstName}</Text>
                                </Flex>
                                {chat._id === selectedChatId &&(
                                    <Flex alignSelf="center">
                                        <Icon as={DeleteIcon}
                                              variant="outline"
                                              color="yellow"
                                              onClick={deleteChat}
                                        />
                                    </Flex>
                                )}
                            </Flex>
                        )
                    }
                })}
            </Flex>

        </Flex>
    )
}

const getServerSideProps: GetServerSideProps = async (ctx) => {
    const accessToken = JSON.stringify(ctx.req.cookies.access_token)
    const response = await fetch(`http://localhost:8000/tutor/details`, {
        method: "GET",
        credentials: "include",
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            Cookie: accessToken
        }
    });

    const data = await response.json()
    // console.log(data)

    return {
        props: {data, accessToken},
    };
}

export {chosenChatId, chosenUser};
