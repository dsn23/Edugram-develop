import {Box, BoxProps} from "@chakra-ui/react";
import {useRouter} from "next/router";
import Link from "next/link";
import {useEffect} from "react";

/**
 Reusable component for ProfileNavigation component used in Profile, dashboard, messages and invoices pages
 @author @Danny Nansink, 500821004
 **/

interface PropsForNav extends BoxProps {
    path: string
}

export const ProfileLinkNavigation = ({path}: PropsForNav) => {


    //Current routing path
    const {asPath} = useRouter()
    //Current routing path without slash -> /
    const pathWithoutSlash = asPath.split('/')[1]
    //A way to split /chat/Chats into just chats because of the way chat page is made
    const justChatOnly = path.split('/')[0]
    return(
        //Check if given path equals to current path without slash if yes make it the active route
        <Box color={ path === pathWithoutSlash ? 'white' : 'black'}
             bg={path === pathWithoutSlash ? '#107385' : 'F5F5F5'}
             border={'1px solid #107385'} borderRadius={'20px'} width={'100px'} textAlign={'center'}>
            {/*Gets the first letter from the path E.G dashboard and makes the first letter in uppercase*/}
            {/*This is purely so that it looks better AND it makes the component have even more reusable parts - UI choice*/}
            <Link href={path}> {path.indexOf('/Chats') >= 0 ? (justChatOnly.charAt(0).toUpperCase() + justChatOnly?.slice(1).toString()): (path?.charAt(0).toUpperCase()+ path?.slice(1)).toString()}
            </Link>
        </Box>
    )
}
