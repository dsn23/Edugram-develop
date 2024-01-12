import {Avatar, Checkbox, Table, Tbody, Td, Th, Thead, Tr, Stack} from '@chakra-ui/react'
import {useState} from "react";
// import {Stack} from "@chakra-ui/layout";

export default function TicketTable({data}) {
    const [checkedItems, setCheckedItems] = useState([false, false])

    const allChecked = checkedItems.every(Boolean)
    const isIndeterminate = checkedItems.some(Boolean) && !allChecked

    const sortedData = data
        // .slice(0, 5)
        .sort((a: any, b: any) => {
            new Date(a.dateCreated) - new Date(b.dateCreated)
        });
    // .sort((a:any, b:any) =>{ new Date(a.dateCreated) - new Date(b.dateCreated)});

    const dateFormatOptions = {
        month: "long",
        day: "numeric",
        year: "numeric"
    };
    //
    // console.log("Data of table:", data)
    return (
        <Stack>
            <Table size='md' w='100%'>
                <Thead w="100vh">
                    <Tr>
                        <Th>
                            <Checkbox
                                // isChecked={allChecked}
                                colorScheme='facebook'
                                iconColor='blue.400'
                                iconSize='10rem'></Checkbox>
                        </Th>
                        <Th>Created By</Th>
                        <Th>Subject</Th>
                        <Th>Assigned</Th>
                        <Th>Status</Th>
                        <Th>Date Created</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {sortedData.map((item: any) => (
                        <Tr key={item.id}>
                            <Td>
                                <Checkbox
                                    // isChecked={allChecked}
                                    colorScheme="facebook"
                                    iconColor="blue.400"
                                    iconSize="10rem"
                                />
                            </Td>
                            <Td><Avatar/>{item.createdBy}</Td>
                            <Td>{item.subject}</Td>
                            <Td>{item.assignedBy}</Td>
                            <Td>{item.status}</Td>
                            <Td>   {new Intl.DateTimeFormat("en-US", dateFormatOptions).format(
                                new Date(item.dateCreated)
                            )}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Stack>
    );
}
