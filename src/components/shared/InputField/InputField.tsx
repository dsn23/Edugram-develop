/**
 * @author Bugra Karaaslan, 500830631, This is an inputfield component.
 */

import { Input, InputProps } from "@chakra-ui/react";

interface ComponentProps extends InputProps {
    placeholder: string;
    id?: string;
    label: string;
}

export function InputField({placeholder, label, id, ...props}: ComponentProps) {
  return (
    <Input bg='EduWhite' aria-label={label} id={id}   {...props} fontSize='xs' maxW='265px' placeholder={placeholder}/>
  );
}
