/**
 * @author Bugra Karaaslan, 500830631, This is the Hero component.
 */
import {
  Flex,
  Text,
  Image,
  Grid,
  GridItem,
  AspectRatio,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

// component imports
import { LoginModal } from "../components/shared/LoginModal/LoginModal";
import { LoginButton } from "../components/shared/loginButton";
import { SearchField } from "../components/shared/SearchField";
import { ActionButton } from "../components/shared/Button";

interface ComponentProps {
  title: string;
  description: string;
}

const Hero = ({ title, description }: ComponentProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [searchData, setSearchData] = useState("");
  const router = useRouter();

  const handleChangeEvent = (event: any) => {
    setSearchData(event.target.value);
  };

  const handleKeyDown = (event: any) => {
    const data = searchData.toLowerCase()

    if (event.key === "Enter") {
      router.push({
        pathname: `/search/${(data.charAt(0).toUpperCase()+data.slice(1)).toString()}`,
      });
    }
  };

  const redirectToRegisterPage = () => {
    router.push('/register')
  }

  function clearCredentials() {
    setEmail("");
    setPassword("");
    setError("");
  }

  return (
    <>
      <Flex
        minH="100vh"
        backgroundImage="url('/images/bg-homepage.png')"
        backgroundRepeat="no-repeat"
        backgroundSize="center"
        flexDir="column"
        pb={{base: "50px", lg: "50px"}}
      >
        <Grid h="100vh" templateRows="10% 10% 80%">
          <GridItem>
            <Grid templateColumns="50% 50%">
              <GridItem display="flex" justifyContent="flex-start">
                <Image
                  mt={3}
                  ml={{ sm: "50px", md: "20px" }}
                  maxH="100px"
                  maxW={{ sm: "120px", md: "150px" }}
                  src="/images/edugram-logo.png"
                  alt="logo of Edugram"
                />
              </GridItem>

              <GridItem display="flex" justifyContent="flex-end">
                <LoginButton
                  label="login"
                  data-cy="loginButton"
                  bg="blue"
                  maxW={"150"}
                  borderRadius={10}
                  alignSelf="end"
                  onClick={onOpen}
                  mt={2}
                  mr={2}
                >
                  Login
                </LoginButton>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem
            w="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            
          >
            <SearchField
              onChange={handleChangeEvent}
              onKeyDown={handleKeyDown}
              data={searchData}
              id="searchField"
            />
          </GridItem>
          <GridItem>
            <Grid
              h="100%"
              display={{ base: "flex", lg: "grid" }}
              templateRows={{ base: "50% 50%", lg: "100%" }}
              flexDir={{ base: "column" }}
              templateColumns={{ base: "100%", lg: "50% 50%" }}
            >
              <GridItem>
                <Flex mt={{base: 0, lg: 4}} flexDir="column" maxW="2xl" p={6}>
                  <Flex>{!!title && <Text as="h1" fontSize={{base: "rg", lg: "lg"}}>{title}</Text>}</Flex>
                  <Flex>
                    {!!description && <Text m="5px 0px" fontSize={{base: "2xs", lg: "xs"}}>{description}</Text>}
                  </Flex>
                  <Flex>{!!description && <Text fontSize={{base: "2xs", lg: "xs"}}>{description}</Text>}</Flex>
                </Flex>
                <ActionButton ml={6} label="Get started" onClick={redirectToRegisterPage}>
                  Get started
                </ActionButton>
                <ActionButton ml={6} label="How it works">
                  How it works
                </ActionButton>
              </GridItem>

              <GridItem p={{ base: 3, lg: 10 }}>
                <AspectRatio
                  margin='auto'
                  maxW={{ base: 300, smx: 450 ,lg: 750 }}
                  ratio={16 / 9}
                  overflow="hidden"
                  borderRadius={20}
                >
                  <iframe title="video" src="/images/edugramPromoVid.mp4" />
                </AspectRatio>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </Flex>
      <LoginModal
        isOpen={isOpen}
        onClose={onClose}
        closeOnEsc={true}
        closeOnOverlayClick={true}
        onclosecomplete={clearCredentials}
      />
    </>
  );
};

export default Hero;
