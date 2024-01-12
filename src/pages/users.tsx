import React from "react";
import AdminContainer from "../components/admin/container/adminContainer";

const Users = () => {
    return (
        <AdminContainer>
            <h1>Users Page</h1>
        </AdminContainer>
    )
}
export default Users

export async function getServerSideProps ({ params }: any) {
    const subject = params.subject
    const res = await fetch(`http://localhost:8000/users/search/` + subject)
    const tutors = await res.json()

    return {
        props: {
            tutors,
            subject
        },
    };
}
