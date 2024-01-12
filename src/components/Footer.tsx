import React, {ReactNode} from "react";
import {Box, Container, IconButton, Input, SimpleGrid, Stack, Text, useColorModeValue} from "@chakra-ui/react";
import {EdugramLogo} from "./edugramLogo";
import {BiMailSend} from "react-icons/bi";
import Link from "next/link";


interface LinkItemProps {
    title: string;
    path: string;
}

const LinkItems: Array<LinkItemProps> = [
    {title: 'About Us', path: '/about'},
    {title: 'Contact Us', path: '/contact'},
    {title: 'Pricing', path: '/pricing'},
    {title: 'Testimonials', path: '/testimonials'},
    {title: 'Blogs', path: '/blogs'},
];
const CustomFooter = () => {

    const ListHeader = ({children}: { children: ReactNode }) => {
        return (
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
                {children}
            </Text>
        );
    };

    return (
        <>
            <Box
                bg={useColorModeValue('lightgray', 'gray.900')}
                // bg={useColorModeValue('gray.50', 'gray.900')}
                color={useColorModeValue('gray.700', 'gray.200')}>
                <Container as={Stack} maxW={'6xl'} py={10}>
                    <SimpleGrid
                        templateColumns={{sm: '1fr 1fr', md: '2fr 1fr 1fr 2fr'}}
                        spacing={8}>
                        <Stack spacing={6}>
                            <Box>
                                {/*<Logo color={useColorModeValue('gray.700', 'white')} />*/}
                                <EdugramLogo boxSize={20}/>
                            </Box>
                            <Text fontSize={'sm'}>
                                © 2022 Edugram. All rights reserved
                            </Text>
                            {/*<Stack direction={'row'} spacing={6}>*/}
                            {/*    <SocialButton label={'Twitter'} href={'#'}>*/}
                            {/*        <FaTwitter />*/}
                            {/*    </SocialButton>*/}
                            {/*    <SocialButton label={'YouTube'} href={'#'}>*/}
                            {/*        <FaYoutube />*/}
                            {/*    </SocialButton>*/}
                            {/*    <SocialButton label={'Instagram'} href={'#'}>*/}
                            {/*        <FaInstagram />*/}
                            {/*    </SocialButton>*/}
                            {/*</Stack>*/}
                        </Stack>
                        <Stack align={'flex-start'}>
                            <ListHeader>Company</ListHeader>
                            {LinkItems.map(l => {
                                return (
                                    <Link key={l.path} href={l.path} legacyBehavior>
                                        <a>{l.title}</a>
                                    </Link>
                                )
                            })}
                        </Stack>
                        <Stack align={'flex-start'}>
                            <ListHeader>Support</ListHeader>
                            <Link href={''}>Help Center</Link>
                            <Link href={''}>Terms of Service</Link>
                            <Link href={''}>Legal</Link>
                            <Link href={''}>Privacy Policy</Link>
                            <Link href={''}>Satus</Link>
                        </Stack>
                        <Stack align={'flex-start'}>
                            <ListHeader>Stay up to date</ListHeader>
                            <Stack direction={'row'}>
                                <Input
                                    placeholder={'Your email address'}
                                    bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
                                    border={0}
                                    _focus={{
                                        bg: 'whiteAlpha.300',
                                    }}
                                />
                                <IconButton
                                    bg={useColorModeValue('#4EA4B1', 'green.800')}
                                    color={useColorModeValue('white', 'gray.800')}
                                    _hover={{
                                        bg: '#107385',
                                    }}
                                    aria-label="Subscribe"
                                    icon={<BiMailSend/>}
                                />
                            </Stack>
                        </Stack>
                    </SimpleGrid>
                </Container>
            </Box>
        </>
    )
}
export default CustomFooter
