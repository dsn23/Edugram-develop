/**
 * @author Bugra Karaaslan, 500830631, This is a search field component.
 */
import {
  InputGroup,
  Input,
  InputProps,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import * as Icon from "react-icons/ai";
import { IconContext } from "react-icons";
import {useRouter} from "next/router";

interface ComponentProps extends InputProps {
  id?: string;
  data: string;
}

export function SearchField({ data, id, ...props }: ComponentProps) {
    const router = useRouter();
    function handleClick () {
        router.push({
            pathname: `/search/${(data.charAt(0).toUpperCase()+data.slice(1)).toString()}`
        })
    }

    return (
    <InputGroup maxW={{sm: "260px", md:"290px"}}>
      <Input
        aria-label=""
        bg="EduWhite"
        id={id}
        active='none'
        focis='none'
        borderRadius={20}
        {...props}
        fontSize="xs"
        h="45px"
        placeholder={"what do you want to learn?"}
        label={"SearchField, what do you want to learn"}
      ></Input>
      <InputRightElement>
        <IconButton
            onClick={handleClick}
          aria-label="Search database"
          bg="yellow"
          mr={2}
          mt={1}
          size='sm'
          borderRadius={30}
          _hover={{ bg: 'lightBlue',}}
            id="iconButton"
          icon={<IconContext.Provider value={{ style: { color: '#FFF' }, className: "global-class-name", }} >
            <Icon.AiOutlineSearch/>
          </IconContext.Provider>}
        />
      </InputRightElement>
    </InputGroup>
  );
}
