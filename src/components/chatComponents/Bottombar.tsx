import React, {useState} from "react";
import {Button, Flex, FormControl, Input} from "@chakra-ui/react";
import * as io from "socket.io-client";
import {chosenChatId} from "../../pages/ChatSidebar";
import {TutorModel} from "../../models/TutorModel";
import {decodeJWT} from "../../pages/api/api.storage";
const socket = io.connect("ws://localhost:3001", { transports: ['websocket', 'polling', 'flashsocket'] });

interface PageProps {
    accessToken: string,
    tutorData: TutorModel,
}

export default function Bottombar({tutorData, accessToken}: PageProps) {
    const [input, setInput] = useState("");
    // @ts-ignore
    // I don't know why typescript gives an error, it works just fine that's why I do @ts-ignore
    const sendMessage = async (e) => {
        if (input.length == 0) {
            console.log("Message too short");
            e.preventDefault();
        } else {
            console.log(input)
            e.preventDefault();
            socket.emit("send-message", input, decodeJWT(accessToken).id, chosenChatId)
            setInput("");
        }

    }
    return (
        <Flex
        bg={'white'}
        borderBottomRightRadius = "md">
            <FormControl onSubmit={sendMessage} p={3} as="form">
                <Flex
                    alignItems="center">
                    <Input bg="#F5F5F5" autoComplete="off" placeholder="Type a message..." onChange={e => setInput(e.target.value)} value={input} w="95%" mr={2}/>
                    <Button type="submit" bg="#4EA4B1" color="#FFFFFF" fontSize="16px">SEND</Button>
                </Flex>
            </FormControl>
        </Flex>

    )
}
