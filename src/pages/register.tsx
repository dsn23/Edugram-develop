/**
 * @author Bugra Karaaslan, 500830631, This is the register page.
 */
import { Flex, Text, Image, Box } from "@chakra-ui/react";
import registerPageTutor from "../../public/data/registerPageTutor.json";

// component imports
import { RegisterFormTutor } from "../components/RegisterFormtutor";

interface PageProps {
  title?: String;
  description?: String;

  errors?: Array<{msg: string}>
}

export default function Register({ title, description, errors }: PageProps) {
  return (
    <Flex
      minH="100vh"
      backgroundImage="url('/images/bg-edugram.png')"
      backgroundRepeat="no-repeat"
      backgroundSize="center"
    >
      <Flex flexDir="column">
        <Box maxW="200px" ml={8} mt="5.5rem">
          <Image src="/images/edugram-logo.png" alt="logo of Edugram" />
        </Box>
        <Flex
          justifyContent="flex-start"
          alignItems={{ sm: "center", lg: "flex-start" }}
          ml={{ md: 0, lg: 8 }}
          mt="150px"
          flexDir={{ sm: "column", md: "column", lg: "row" }}
        >
          <Flex
            flexDir="column"
            maxW={{ sm: "90%", md: "50%" }}
            m={{ sm: "30px", lg: "0px" }}
            mr={{ lg: "10px", xl: "100px" }}
          >
            <Flex>{!!title && <Text as="h1">{title}</Text>}</Flex>
            <Flex mt="3rem">
              {!!description && (
                <Text mt={2} maxW="50%">
                  {description}
                </Text>
              )}
            </Flex>
          </Flex>
          <RegisterFormTutor/>
        </Flex>
      </Flex>
    </Flex>
  );
}

export const getStaticProps = async () => {
  return {
    props: {
      title: registerPageTutor.title,
      description: registerPageTutor.description,
    },
  };
};
