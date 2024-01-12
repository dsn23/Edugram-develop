import {Box} from "@chakra-ui/react";
import ProfileNavigation from "../components/shared/ProfileNavigation/ProfileNavigation";

const Invoices = () => {
    return (
        <Box>
            {/*Tutor by default please change to right role if needed*/}
            <ProfileNavigation role={'tutor'}/>
            Invoices page
        </Box>
    )
}

export default Invoices
