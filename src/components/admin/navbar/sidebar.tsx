import {BoxProps, CloseButton, Flex, List, ListItem, useColorModeValue} from "@chakra-ui/react";
import React, {useState} from "react";

import NavItem from "./navItem";
import {FiMenu,} from 'react-icons/fi'
import {BiCategory} from 'react-icons/bi'
import {HiOutlineTicket, HiOutlineUsers} from 'react-icons/hi'
import {FaBlog} from 'react-icons/fa'
import {MdOutlineAdminPanelSettings} from 'react-icons/md'
import {IconType} from "react-icons";
import {EdugramLogo} from "../../edugramLogo";


interface LinkItemProps {
    title: string;
    icon: IconType;
    path: string;
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}


const LinkItems: Array<LinkItemProps> = [
    {title: 'Dashboard', icon: FiMenu, path: '/dashboard'},
    {title: 'Tickets', icon: HiOutlineTicket, path: '/tickets'},
    {title: 'Users', icon: HiOutlineUsers, path: '/users'},
    {title: 'Categories', icon: BiCategory, path: '/categories'},
    {title: 'Admin', icon: MdOutlineAdminPanelSettings, path: '/admin'},
    {title: 'Blogs', icon: FaBlog, path: '/blogSetup'},
];

const SideBar = ({onClose, ...rest}: SidebarProps) => {

    const [navSize, changeNavSize] = useState("large")


    return (
        <Flex
            transition="3s ease"
            boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
            w={{base: 'full', md: 60}}
            bg={useColorModeValue('white', 'gray.900')}

            pos="fixed"
            h="full"
            flexDir="column"
            justifyContent="space-between"
            {...rest} >
            <Flex
                p="5%"
                flexDir="column"
                w="100%"
                alignItems={navSize == "small" ? "center" : "flex-start"}
                as="nav"
            >

                <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                    <EdugramLogo boxSize={20}/>
                    <CloseButton display={{base: 'flex', md: 'none'}}
                        // onClick={onClose}
                    />
                </Flex>
                <List w="full" my={8}>
                    {LinkItems.map((link, index) => (

                        <ListItem key={index}>
                            <NavItem icon={link.icon} title={link.title} path={link.path}>
                                {link.title}
                            </NavItem>
                        </ListItem>
                    ))}
                </List>
            </Flex>
        </Flex>
    );
}

export default SideBar;
