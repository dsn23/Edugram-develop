import React, {useEffect, useState} from "react";
import AdminContainer from "../components/admin/container/adminContainer";
import TicketTable from "../components/admin/container/ticketTable";
import * as io from "socket.io-client";
import DashboardTable from "../components/admin/container/dashboardTable";
import {Card, CardBody} from "@chakra-ui/react";


const socket = io.connect("ws://localhost:3001", {transports: ['websocket', 'polling', 'flashsocket']});

const Tickets = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        socket.on('data', (result: any) => {
            // console.log('Getting Data', result)
            setData(result);
        });
    }, []);

    socket.on('update-tickets', (newData: any) => {
        setData(newData);
    });

    return (


        <AdminContainer>
            <Card
                mt={5}
                minH="100%"
                w='100%%'
                bg="#FFFFFF"
                borderRadius='10'
                variant={'elevated'}>
                <CardBody>
                    {/*<Text as='b'>Recent Tickets</Text>*/}
                    <TicketTable data={data}/>
                </CardBody>
            </Card>

        </AdminContainer>
    )
}



export default Tickets
