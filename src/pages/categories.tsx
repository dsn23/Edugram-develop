import React, {useEffect, useState} from "react";
import AdminContainer from "../components/admin/container/adminContainer";
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer, Card, CardBody,
} from '@chakra-ui/react';


const Categories = () => {

    // Use the useState hook to create a state variable for the list of subjects.json
    // and a function for updating the list
    const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
    // Use the useState hook to create a state variable for the subject name
    // entered in the text field and a function for updating the subject name
    const [subjectName, setSubjectName] = useState('');


    // Fetch the initial list of subjects.json from the server
    // useEffect(() => {
    //     async function fetchSubjects() {
    //         const response = await fetch('/api/subjects.json');
    //         const data = await response.json();
    //         setSubjects(data);
    //     }
    //     fetchSubjects();
    // }, []);



    // Handle changes to the text field
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSubjectName(event.target.value);
    }

    // Handle form submission
    async function handleSubmit(event: React.FormEvent) {
        // Prevent the default form submission behavior
        // event.preventDefault();
        //
        // // Make a POST request to add the new subject
        // const response = await fetch('/api/subjects.json', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ name: subjectName }),
        // });
        // const data = await response.json();
        //
        // // Add the new subject to the list
        // setSubjects([...subjects.json, data]);
    }

    return (
        <AdminContainer>
            {/*<h1>Categories is here Page</h1>*/}

            <Card
                maxW='45%'
                maxH="md"
                w='40%'
                // cursor='pointer'
                bg="#FFFFFF"
                borderRadius='10'>
                <CardBody>
                    <Box p={5}>
                        <FormControl>
                            <FormLabel htmlFor="subject-name">Subject Name</FormLabel>
                            <Input
                                id="subject-name"
                                type="text"
                                value={subjectName}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <Button mt={4} type="submit">
                            Add Subject
                        </Button>
                        <Table mt={5}>
                            <Thead>
                                <Tr>
                                    <Td>ID</Td>
                                    <Td>Subject Name</Td>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {subjects.map((subject: any) => (
                                    <Tr key={subject.id}>
                                        <Td>{subject.id}</Td>
                                        <Td>{subject.name}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </CardBody>
            </Card>

        </AdminContainer>
    )
}

export default Categories
