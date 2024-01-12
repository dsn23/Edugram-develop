import {Box, Drawer, DrawerContent, useColorModeValue, useDisclosure} from "@chakra-ui/react";
import React, {ReactNode} from "react";
import Navbar from "../navbar/navbar";
import SideBar from "../navbar/sidebar";


const AdminContainer = ({children}: { children: ReactNode }) => {

    const {isOpen, onOpen, onClose} = useDisclosure();

    return (
        <Box minH="100vh" bg={useColorModeValue('red.100', 'green.900')}>
            <SideBar
                onClose={() => onClose}
                display={{base: 'none', md: 'block'}}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    {/*<SidebarContent onClose={onClose}/>*/}
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            {/*<MobileNav onOpen={onOpen}/>*/}
            <Navbar/>
            <Box ml={{base: 0, md: 60}} p="5">
                {children}
                {/*Hier komen de childs*/}
            </Box>
        </Box>
    )
}

export default AdminContainer
