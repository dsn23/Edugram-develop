/**
 * @author Bugra Karaaslan, 500830631, This is a password inputField component.
 */
import {
  Input,
  InputProps,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import * as icon from "react-icons/bi";

interface ComponentProps extends InputProps {
  id?: string;
  mt?: string | number;
  label: string
}

export function PasswordInput({placeholder, label, id, mt, ...props}: ComponentProps) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup maxW="265px" minH="50px" mt={mt}>
      <Input
        aria-label={label}
        bg="EduWhite"
        id={id}
        pr="3rem"
        {...props}
        fontSize="xs"
        maxW="265px"
        type={show ? "text" : "password"}
        placeholder="Password"
      />
      <InputRightElement width="2.5rem" h="2rem" mt={1} mr={2}>
        <Button h="1.75rem" size="sm" fontSize="sm" onClick={handleClick}>
          {show ? <icon.BiShow/> : <icon.BiHide/>}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
