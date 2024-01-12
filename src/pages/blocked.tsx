import Star from '../../public/images/blocked.svg'
import {Box} from "@chakra-ui/react";
const Blocked = () => {
    return (
        <Box mx="25%" my="auto">
            <Star size={{ width: '24px', height: '24px' }} viewBox="0 0 1500 1000" />
        </Box>
    )
}

export default Blocked
