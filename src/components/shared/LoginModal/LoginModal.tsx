import React, {useState} from "react";
import {
    Alert, AlertDescription, AlertIcon,
    Button, Divider, Flex, Heading,
    InputGroup,
    InputRightElement, Link, Modal, ModalBody, ModalCloseButton,
    ModalContent,
    ModalFooter, ModalHeader,
    ModalOverlay, Stack, Text, UseModalProps
} from "@chakra-ui/react";
import {InputField} from "../InputField/InputField";
import {GoogleBtn} from "../GoogleBtn/index";
import {useRouter} from "next/router";

export interface ModalProps extends UseModalProps {
    isOpen: boolean,
    onClose: () => void;
    closeOnEsc: boolean,
    closeOnOverlayClick: boolean,
    onclosecomplete: () => void,
    children?: React.ReactNode,
}

export function LoginModal({
                               isOpen,
                               onClose,
                               closeOnEsc,
                               closeOnOverlayClick,
                               onclosecomplete,
                               children
                           }: ModalProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [show, setShow] = React.useState(false)
    const handleShowPassword = () => setShow(!show)

    const router = useRouter();

    function login(email: string, password: string) {
        if (error) {
            setError('')
        }
        !email || !password ?
            setError('Please fill in credentials!')
            : fetch(
                `http://localhost:8000/login`, {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': `http://localhost:8000`,
                    },
                    body: JSON.stringify({email: email, password: password})

                }
            ).then(r => r.json()).then((data) => {

                if (data && data.error) {
                    setError(data.error)
                }
                if (data.message) {
                    setSuccess(data.message)
                    window.location.href = '/dashboard'
                }

            }).catch((err) => {
                console.log(err)
            });
    }

    function clearCredentials() {
        setEmail('')
        setPassword('')
        setError('')
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnEsc={closeOnEsc} closeOnOverlayClick={closeOnOverlayClick}
               onCloseComplete={clearCredentials}>
            <ModalOverlay backdropFilter='blur(5px)' bg='blackAlpha.300'/>
            <ModalContent backgroundColor={'#4EA4B1'} alignItems={'center'} textAlign={'center'} borderRadius={20}
                          maxW={'400px'} height={'450px'}>
                <ModalCloseButton/>
                <ModalHeader>
                    <Heading textAlign={'center'} textColor={'white'}>Login</Heading>
                </ModalHeader>
                <ModalBody>
                    {error ?
                        <Alert status='error' marginBottom={'10px'}>
                            <AlertIcon/>
                            <AlertDescription data-cy="alert-description">{error}</AlertDescription>
                        </Alert> : success ? <Alert status='success' marginBottom={'10px'}>
                            <AlertIcon/>
                            <AlertDescription data-cy="success-description">{success}</AlertDescription>
                        </Alert> : ''}
                    <InputField label={'input-email'}
                                placeholder="johndoe@gmail.com"
                                type="email"
                                textColor={'black'}
                                variant="outline"
                                bg={'white'}
                                mb={2}
                                maxW={250}
                                focusBorderColor={'black'}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }} id={'Email'}>
                    </InputField>
                    <InputGroup size='md'>
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleShowPassword}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                        <InputField type={show ? 'text' : 'password'}
                                    placeholder="Password"
                                    textColor={'black'}
                                    variant="outline"
                                    bg={'white'}
                                    focusBorderColor={'black'}
                                    mb={1}
                                    maxW={250}
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }} id={'password'} label={'input-password'}>

                        </InputField>
                    </InputGroup>
                    <Link as={'u'} textAlign={'right'} ml={'60px'} fontWeight={'bold'} href={'reset-password'}>Wachtwoord
                        vergeten?</Link>
                </ModalBody>
                <ModalFooter height={'200px'} mb={'30px'}>
                    <Stack>
                        <Button bg={"#FFCA48"} borderRadius={30} w='250px' h={'50'}
                                type={'submit'}
                                onClick={() => login(email, password)}>
                            Login
                        </Button>
                        <Flex align="center">
                            <Divider/>
                            <Text padding="2" color={'white'} ml={'20px'} mr={'20px'}>Of</Text>
                            <Divider/>
                        </Flex>
                        <GoogleBtn bg={'white'} borderRadius={30} w='250px' h={'50'} label={'google-button-login'} onClick={() => router.push(`http://localhost:8000/auth/google`)}>Login
                            met Google</GoogleBtn>
                    </Stack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

