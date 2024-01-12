
import {Avatar, Flex, Heading} from "@chakra-ui/react";
import React from "react";
import {chosenChatId} from "../../pages/ChatSidebar";
import {chosenUser} from "../../pages/ChatSidebar";


export default function Topbar() {
    return (
        <Flex
            borderTopRightRadius="10px"
            bg="#4EA4B1"
            h="81px"
            w="100%"
            align="center"
            p={5}>
            <Avatar src="" marginEnd={3}/>
            <Heading as="h2">{chosenUser}</Heading>
        </Flex>
    )
}
