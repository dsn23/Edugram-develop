
import ChatSidebar, {chosenChatId} from "./ChatSidebar";
import Topbar from "../components/chatComponents/Topbar";
import Bottombar from "../components/chatComponents/Bottombar";
import {Text, Flex} from "@chakra-ui/react";
import Head from "next/head";
import React, {useEffect, useRef, useState} from "react";
import * as io from "socket.io-client";
import {ChatModel} from "../models/ChatModel";
import {GetServerSideProps} from "next";
import {TutorModel} from "../models/TutorModel";
import {decodeJWT} from "./api/api.storage";
import ProfileNavigation from "../components/shared/ProfileNavigation/ProfileNavigation";
import {UserModel} from "../models/UserModel";

const socket = io.connect("ws://localhost:3001", { transports: ['websocket', 'polling', 'flashsocket'] });

interface PageProps {
    accessToken: string,
    tutorData: UserModel,
}

 const getMessages = (chat: ChatModel, {tutorData}: PageProps) =>
    chat?.messages.map(msg => {
        console.log(chat)
        const sender = msg.sender === tutorData._id;
        const today = new Date();
        const date = new Date(msg.dateTime);
        let stringDate = "";
        if (date.toDateString() === today.toDateString()) {
            const formattedTime = date.toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric', hour12: false });
            stringDate += formattedTime;
        } else {
            const formattedDate = date.toLocaleDateString("en-US", { day: 'numeric', month: 'numeric', year: 'numeric' });
            const formattedTime = date.toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric', hour12: false });
            stringDate = formattedDate + " " + formattedTime;
        }
        return (
            <Flex style={{ display: 'flex', flexDirection: 'column' }} key = {Math.random()} alignSelf={sender ? "flex-end" : "flex-start"} bg={sender ? "#FFCA48" : "#FFFFFF"} w="fit-content" minWidth="100px" borderRadius="lg" p={2} m={2}>
                <Text style={{fontSize: 18}}>{msg.message}</Text>
                <Text style={{ alignSelf: 'flex-end', fontSize: 11}}>{stringDate}</Text>
            </Flex>
        )
    })

export default function ChatApp({tutorData, accessToken}: PageProps) {
    const [chat, setChat] = useState();

    socket.on("update-chat", (chat) => {
        console.log("Chat updated")
        setChat(chat);
    });

    useEffect(() => {
        if (decodeJWT(accessToken).role === "student") {
            console.log("Role is student")
            socket.emit('join-chat', chosenChatId);
        } else if (decodeJWT(accessToken).role === "tutor") {
            console.log("Role is tutor")
            socket.emit('join-chat', chosenChatId);
        }
    }, [chosenChatId]);
    return (
        <Flex direction="column">
            <ProfileNavigation role={tutorData.role}/>
            <Flex
                bg = "#FFCA48"
                h="87vh"
                overflowX="hidden"
                p={7}>
                <Head>
                    <title>Chat app</title>
                </Head>
                <ChatSidebar tutorData={tutorData} accessToken={accessToken}/>

                <Flex
                    flex={1}
                    direction="column">
                    <Topbar/>

                    <Flex bg="#F5F5F5" flex={1} direction="column" pt={4} overflowX="scroll" overflowY="scroll"
                          sx={{'::-webkit-scrollbar': {display: 'none'}}}>
                        {getMessages(chat!, {tutorData, accessToken})}
                    </Flex>
                    <Bottombar accessToken={accessToken} tutorData={tutorData}/>
                </Flex>
            </Flex>
        </Flex>

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
    // console.log(tutorData)

    return {
        props: {tutorData, accessToken},
    };
}
