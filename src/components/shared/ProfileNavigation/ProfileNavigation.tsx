import {Box, CardProps, HStack} from "@chakra-ui/react";
import {ProfileLinkNavigation} from "../ProfileLinkNavigation";

/**
 Reusable component for Profile, dashboard, messages and invoices pages
 @author @Danny Nansink, 500821004
 **/
interface propsForNav {
    role: string,
}

const ProfileNavigation = ({role}: propsForNav) => {
    return (
        <Box bg='white' w='100%' p={4} color='black'>
            <HStack justifyContent={'center'}>
                <ProfileLinkNavigation path={'dashboard'}/>
                <ProfileLinkNavigation path={'profile'}/>
                {role === 'tutor' ? <ProfileLinkNavigation path={'courses'}/> : ''}
                <ProfileLinkNavigation path={'chats'}/>
                <ProfileLinkNavigation path={'invoices'}/>
            </HStack>
        </Box>

    )


}

export default ProfileNavigation
