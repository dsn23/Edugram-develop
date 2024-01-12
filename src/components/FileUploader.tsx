import React from 'react';
import {Button, Input} from "@chakra-ui/react";
import { Icon } from '@chakra-ui/react'
import { FiDownload } from 'react-icons/fi'
const FileUploader = props  => {

    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        props.handleFile(fileUploaded);
        console.log(fileUploaded)
    };
    return (
        <>
            <Button onClick={handleClick}  size='xs' type="file" variant="link">
               Upload a new Image   <Icon as={FiDownload} />
            </Button>
            <Input  type="file"
                   style={{display:'none'}}
                   ref={hiddenFileInput}
                   onChange={handleChange}
                   accept=".jpg, .jpeg, .png" />
        </>
    );
};
export default FileUploader;
