import React, {useEffect, useRef, useState} from "react";
import ProfileNavigation from "../components/shared/ProfileNavigation/ProfileNavigation";
import {
    Box,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    GridItem,
    HStack,
    Image,
    Input,
    Text,
    FormControl,
    FormHelperText, FormLabel, SimpleGrid, useToast, Grid, InputRightElement, Button, InputGroup,
} from "@chakra-ui/react";
import {SubmitButton} from "../components/shared/Buttons";
import {DashboardCard} from "../components/shared/DashboardCard";
import {InputField} from "../components/shared/InputField/InputField";
import {getToken, isAdmin, isTutor} from "./api/api.storage";
import {TutorModel} from "../models/TutorModel";
import {useRouter} from "next/router";
import {GetServerSideProps} from "next";
import {wait} from "next/dist/build/output/log";
import FileUploader from "../components/FileUploader";

interface PageProps {
    accessToken: string,
    data: TutorModel,
}

const INITIAL_STATE_PROFILE = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
};

const INITIAL_STATE_ADDRESS = {
    street: "",
    postalCode: "",
}

const INITIAL_STATE_PASSWORD = {
    oldPassword: "",
    newPassword: "",
}

export const Profile = ({data, accessToken}: PageProps) => {
    const [tutor, setTutor] = useState(data as TutorModel)
    const [user, setUser] = useState(INITIAL_STATE_PROFILE)
    const [address, setAddress] = useState(INITIAL_STATE_ADDRESS)
    const [password, setPassword] = useState(INITIAL_STATE_PASSWORD)
    const [imageUrl, setImageUrl] = useState(null);
    const router = useRouter()
    const toast = useToast()
    const [show, setShow] = React.useState(false)
    const handleShowPassword = () => setShow(!show)


    useEffect(() => {
        console.log(data)
        console.log(isTutor(accessToken))
        console.log(isAdmin(accessToken))
        fetch("http://localhost:8000/tutor/get_image", {
            method: 'GET',
            credentials: "include",
        })
            .then(response => response.json())
            .then(data => {
                if (!data.image) {
                    throw  new Error('Image not found')
                }
                const imageSrc = `data:${data.image.contentType};base64,${Buffer.from(data.image.data).toString('base64')}`;

                setImageUrl(imageSrc);
            }).catch((error)=>{
            console.error(error);
        })
    }, [])

    const handleFile = async (imageFile: File) => {
        let formdata = new FormData();
        formdata.append("image", imageFile);
        formdata.append("contentType", "image/jpg");

        const response = await fetch("http://localhost:8000/tutor/upload", {
            method: 'POST',
            body: formdata,
            credentials: "include",
        })

        try {
            const data = await response.json();
            await getProfileImage();
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    };

    const getProfileImage = async () => {
        try {
            const response = await fetch('http://localhost:8000/tutor/get_image', {
                method: 'GET',
                credentials: "include",
            })

            const data = await response.json();
            if (!data.image) {
              throw  new Error('Image not found')
            }
            const imageSrc = `data:${data.image.contentType};base64,${Buffer.from(data.image.data).toString('base64')}`;

            setImageUrl(imageSrc);
        } catch (error) {
            console.error(error);
        }
    };


    const handleInput = (e: any) => {
        setUser({...user, [e.target.name]: e.target.value});

    };

    const handleInputAddress = (e: any) => {
        setAddress({...address, [e.target.name]: e.target.value})
    };

    const handleInputPassword = (e: any) => {
        setPassword({...password, [e.target.name]: e.target.value})
        console.log(password)
    };

    const updatePassword = async () => {

        password.oldPassword === undefined || password.newPassword === undefined ?

            toast({
                description: 'Both old and new password should be filled',
                status: "warning",
                position: "top-right",
                duration: 5000,
                isClosable: true
            }) :
            await fetch(`http://localhost:8000/tutor/password/` + tutor._id, {
                method: 'PUT',
                body: JSON.stringify({password: password}),
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': `http://localhost:8000`,
                    Cookie: accessToken
                },
                credentials: "include",
                mode: 'cors',
            }).then((res) => {
                    if (!res.ok) {
                        toast({
                            description: 'Could not change password!',
                            status: "warning",
                            position: "top-right",
                            duration: 3000
                        })
                    } else {
                        toast({
                            description: 'Succesfuly changed password',
                            status: "success",
                            position: "top-right",
                            duration: 3000
                        })
                        wait(2000)
                        window.location.reload()
                    }
                }
            ).catch((err) => {

                toast({
                    description: err.response,
                    status: "success",
                    position: "top-right",
                    duration: 3000
                })

            })
    }

    const handleProfileChanges = () => {
        console.log('triggered')

        user.firstName === '' && user.lastName === '' && user.gender === '' && user.phoneNumber === '' && user.dateOfBirth === '' ?

            toast({
                description: 'Profile fields should be different',
                status: "warning",
                position: "top-right",
                duration: 5000,
                isClosable: true
            }) :

            fetch(`http://localhost:8000/tutor/` + tutor._id, {
                method: 'PUT',
                body: JSON.stringify({user: user}),
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': `http://localhost:8000`,
                    Cookie: accessToken
                },
                credentials: "include",
                mode: 'cors',
            }).then(() => {
                    toast({
                        description: 'Succesfuly changed profile',
                        status: "success",
                        position: "top-right",
                        duration: 3000
                    })
                }
            ).then(() => {
                wait(2000)
                window.location.reload()
            }).catch((err) => {
                console.log(err.response)
            })
    }

    const handleLivingPlaceChanges = () => {

        address.street === '' && address.postalCode === '' ?
            toast({
                description: 'Address fields should be different',
                status: "warning",
                position: "top-right",
                duration: 5000,
                isClosable: true
            }) :

            fetch(`http://localhost:8000/tutor/` + tutor._id, {
                method: 'PUT',
                body: JSON.stringify({user: address}),
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': `http://localhost:8000`,
                    Cookie: accessToken
                },
                credentials: "include",
                mode: 'cors',
            }).then(response => {
                toast({
                    description: 'Succesfuly changed address',
                    status: "success",
                    position: "top-right",
                    duration: 3000
                })

                console.log(response)
            }).then(() => {
                window.location.reload()
            }).catch(err => {
                console.log(err)
            })

    }

    const handleConfirmAction = () => {
        const confirmAction = confirm('Are you really really really sure about this? \n This action cannot be undone')
        confirmAction ? fetch(`http://localhost:8000/tutor/` + tutor._id, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': `http://localhost:8000`,
                Cookie: accessToken
            }
        }).then(response => response.json()).then(() =>
            alert('Thanks for using Edugram!')
        ).then(() => router.push('/register')).catch(err => {
            console.log(err)
        }) : alert("One user was saved today!")
    }

    return (
        <Box>
            <ProfileNavigation role={tutor.role}/>
            <Box display={{md: 'flex'}}>
                <Box w={{md: '600px'}} padding={'10px'}>
                    <Card boxShadow={'xl'} borderRadius={20} bg={'white'}>
                        <CardHeader>
                            {/*<Image margin={'auto'}*/}
                            {/*       src="images/placeholderImage.png"*/}
                            {/*       alt="Placeholder for image of Identity"*/}
                            {/*/>*/}
                            {imageUrl ? (
                                <Image src={imageUrl}
                                       borderRadius='full'
                                       boxSize='150px'
                                       height={{
                                    base: '100%', // 0-48em
                                    md: '30%', // 48em-80em,
                                    xl: '25%', // 80em+
                                }} alt="Profile Image" margin="auto"/>
                            ) : (
                                <Image src="images/placeholderImage.png" alt="Placeholder for image of Identity"
                                       margin="auto"/>
                            )}
                        </CardHeader>
                        <FileUploader handleFile={handleFile}/>
                        <CardBody>
                            <FormControl>
                                <FormLabel fontSize={'xs'}>Firstname</FormLabel>
                                <Input data-cy='firstName' mb={2} variant='filled' fontSize={'sm'} name="firstName"
                                       placeholder={tutor.firstName ? tutor.firstName : 'First name unknown'}
                                       value={user.firstName}
                                       onChange={(e) => {
                                           handleInput(e)
                                       }
                                       }/>
                                <FormLabel fontSize={'xs'}>Lastname</FormLabel>
                                <Input data-cy='lastName' mb={2} variant='filled' fontSize={'sm'} name="lastName"
                                       placeholder={tutor.lastName ? tutor.lastName : 'Last name unknown'}
                                       value={user.lastName}
                                       onChange={(e) => {
                                           handleInput(e)
                                       }
                                       }/>
                                <FormLabel fontSize={'xs'}>Birthdate</FormLabel>
                                <Input data-cy='birthDate' mb={2} variant='filled' fontSize={'sm'} type={'date'}
                                       name="dateOfBirth"
                                       placeholder={tutor.dateOfBirth ? tutor.dateOfBirth : 'Birthdate unknown'}
                                       value={user.dateOfBirth} onChange={(e) => {
                                    handleInput(e)
                                }
                                }/>
                                <FormHelperText fontSize={'xs'} textAlign={'center'} mb={2} marginTop={'-5px'}>Current
                                    birthdate
                                    is: {tutor.dateOfBirth ? tutor.dateOfBirth : 'Unknown'}</FormHelperText>
                                <FormLabel fontSize={'xs'}>Gender</FormLabel>
                                <Input mb={2} variant='filled' fontSize={'sm'} name="gender"
                                       placeholder={tutor.gender ? tutor.gender : 'Gender unknown'}
                                       value={user.gender}
                                       onChange={(e) => {
                                           handleInput(e)
                                       }
                                       }/>
                                <FormLabel fontSize={'xs'}>Email</FormLabel>
                                <Input data-cy='email' mb={2} variant='filled' fontSize={'sm'} isReadOnly={true}
                                       name="email"
                                       placeholder={tutor.email ? tutor.email : 'Email unknown'}
                                       value={tutor.email}/>
                                <FormLabel fontSize={'xs'}>Phonenumber</FormLabel>
                                <Input data-cy='phoneNumber' mb={2} variant='filled' fontSize={'sm'} type={'number'}
                                       name="phoneNumber"
                                       maxLength={10}
                                       placeholder={tutor.phoneNumber ? tutor.phoneNumber.toString() : 'Number unknown'}
                                       value={user.phoneNumber} onChange={(e) => {
                                    handleInput(e)
                                }
                                }/>
                            </FormControl>

                        </CardBody>
                        <CardFooter alignSelf={"center"}>
                            <SubmitButton label={'save-profile-changes'} onClick={handleProfileChanges}>Save
                                Changes</SubmitButton>
                        </CardFooter>
                    </Card>
                </Box>
                <Box maxW={'100%'} minW={'320px'} w={'100%'} ml={{md: '10px'}} padding={'10px'}>
                    <SimpleGrid minChildWidth='300px' spacing='40px' justifyItems={'center'}>
                        <Box height='300px' maxW={'320px'}>
                            <DashboardCard buttonWidth={'100px'} height={'280px'} label={'upload-identity'}
                                           buttonText={'Upload'} headerName={'Identity'}
                                           cardWidth={'320px'}
                                           optionalBodyOne={
                                               <Box bg={'#edf2f7'} height={'120px'} borderRadius={'20px'}
                                                    width={'200px'}>
                                                   <Image margin={'auto'}
                                                          maxH={'120px'}
                                                          src="images/img_identity.png"
                                                          alt="Placeholder for image of Identity"
                                                   />
                                               </Box>
                                           }
                            />
                        </Box>
                        <Box height='300px' maxW={'320px'}>
                            <DashboardCard buttonWidth={'150px'} height={'280px'} label={'upload-degree'}
                                           buttonText={'Upload'} headerName={'My Diploma'}
                                           cardWidth={'320px'} optionalBodyOne={
                                <Image
                                    maxH={'120px'}
                                    src="images/img_degree.png"
                                    alt="Placeholder for image of Degree"
                                />}/>
                        </Box>
                        <Box height='300px' maxW={'320px'}>

                            <DashboardCard buttonWidth={'200px'} height={'280px'} label={'delete-account'}
                                           buttonText={'Delete my account'} headerName={'Delete My Account'}
                                           onClick={handleConfirmAction}
                                           cardWidth={'320px'} optionalBodyOne={
                                <HStack bg={'#107385'} maxW={'70%'} textAlign={'center'} marginLeft={'40px'}
                                        marginTop={'20px'}
                                        borderRadius={'10px'}>
                                    <Text padding={'5px'} color={'#FFFFFF'}>Deleting cannot be undone!</Text>
                                </HStack>
                            }/>

                        </Box>
                        <Box height='300px' maxW={'320px'}>
                            <DashboardCard buttonWidth={'150px'}
                                           height={'280px'}
                                           paddingTop={'15px'}
                                           label={'save-changes-adress'}
                                           buttonText={'Save changes'}
                                           headerName={'Adress + icon'}
                                           cardWidth={'320px'}
                                           onClick={handleLivingPlaceChanges}
                                           optionalBodyOne={<>
                                               <FormLabel margin={'0px'}
                                                          fontSize={'xs'}>Streetname
                                                   + number</FormLabel>
                                               <InputField
                                                   placeholder={tutor.address ? tutor.address?.street?.toString() : 'Unknown'}
                                                   mb={1}
                                                   variant={'unstyled'}
                                                   border={'1px solid #e2e8f0'}
                                                   bg={'#e2e8f0'}
                                                   height={'var(--chakra-sizes-10)'}
                                                   name={'street'}
                                                   color={'black'}
                                                   outline={'2px solid transparent'}
                                                   fontSize={'xs'}
                                                   textIndent={'20px'}
                                                   borderRadius={'var(--chakra-radii-md)'}
                                                   label={'inputfield-address'}
                                                   value={address.street}
                                                   onChange={(e) => {
                                                       handleInputAddress(e)
                                                   }
                                                   }/>
                                           </>
                                           }
                                           optionalBodyTwo={
                                               <><FormLabel margin={'0px'}
                                                            fontSize={'xs'}>Postal
                                                   code</FormLabel><InputField
                                                   placeholder={tutor.address ? tutor.address.postalCode?.toString() : 'Unknown'}
                                                   variant={'unstyled'}
                                                   border={'1px solid #e2e8f0'}
                                                   bg={'#e2e8f0'}
                                                   height={'var(--chakra-sizes-10)'}
                                                   name={'postalCode'}
                                                   color={'black'}
                                                   outline={'2px solid transparent'}
                                                   fontSize={'xs'}
                                                   textIndent={'20px'}
                                                   borderRadius={'var(--chakra-radii-md)'}
                                                   label={'inputfield-address'}
                                                   value={address.postalCode}
                                                   onChange={(e) => {
                                                       handleInputAddress(e)
                                                   }}/></>}/></Box>
                        <Box height='300px' maxW={'320px'}>

                            <DashboardCard buttonWidth={'150px'} height={'280px'} onClick={updatePassword}
                                           label={'save-changes-password'} buttonText={'Save changes'}
                                           headerName={'Change Password'} cardWidth={'320px'}
                                           optionalBodyOne={<><FormLabel margin={'0px'}
                                                                         fontSize={'xs'}>Old
                                               Password</FormLabel><InputField placeholder={'Previous password'}
                                                                               type={show ? 'text' : 'password'}
                                                                               name={'oldPassword'}
                                                                               value={password.oldPassword}
                                                                               onChange={(e) => {
                                                                                   handleInputPassword(e)
                                                                               }} variant={'unstyled'}
                                                                               border={'1px solid #e2e8f0'}
                                                                               bg={'#e2e8f0'}
                                                                               height={'var(--chakra-sizes-10)'}
                                                                               color={'black'}
                                                                               outline={'2px solid transparent'}
                                                                               fontSize={'xs'}
                                                                               textIndent={'20px'}
                                                                               borderRadius={'var(--chakra-radii-md)'}
                                                                               label={'inputfield-previous-password'}/></>}
                                           optionalBodyTwo={<>
                                               <FormLabel margin={'0px'}
                                                          fontSize={'xs'}>New Password</FormLabel>
                                               <InputGroup size='md'>
                                                   <InputRightElement width='4.5rem'>
                                                       <Button h='1.75rem' size='sm' onClick={handleShowPassword}
                                                               fontSize={"xs"}>
                                                           {show ? 'Hide' : 'Show'}
                                                       </Button>
                                                   </InputRightElement>
                                                   <InputField placeholder={'New password'}
                                                               name={'newPassword'}
                                                               type={show ? 'text' : 'password'}

                                                               value={password.newPassword}
                                                               onChange={(e) => {
                                                                   handleInputPassword(e)
                                                               }}
                                                               variant={'unstyled'}
                                                               border={'1px solid #e2e8f0'}
                                                               bg={'#e2e8f0'}
                                                               height={'var(--chakra-sizes-10)'}
                                                               color={'black'}
                                                               outline={'2px solid transparent'}
                                                               fontSize={'xs'}
                                                               textIndent={'20px'}
                                                               borderRadius={'var(--chakra-radii-md)'}
                                                               label={'inputfield-new-password'}/></InputGroup></>}
                            />
                        </Box>
                    </SimpleGrid>
                </Box>
            </Box>
        </Box>


    )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
    console.log(data)

    return {
        props: {data, accessToken},
    };
}

export default Profile
