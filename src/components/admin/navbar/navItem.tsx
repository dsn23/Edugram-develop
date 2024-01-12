import React, {ReactText} from 'react'
// import {Link as MyLink} from "next/link";
import {Flex, FlexProps, Icon, Link} from '@chakra-ui/react'
import {IconType} from "react-icons";
import NextLink from 'next/link'
import {useRouter} from "next/router";

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactText;
    // isActive: any;
    path: string;
}


const NavItem = ({icon, children, path, ...rest}: NavItemProps) => {

    const router = useRouter()
    const style = {
        color: router.asPath === path ? "#4EA4B1" : "#8B8B8B",
    }

    const handleClick = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        router.push(path).then(r => r.valueOf())
    }

    return (
        <NextLink href={path} legacyBehavior passHref>

            <Link
                  _focus={{boxShadow: 'none'}}
                  style={style}
                  _hover={{
                      bg: 'red.400',
                      color: 'red',
                  }}               // _activeLink={{
                  onClick={handleClick}

            >
                <Flex
                    align="center"
                    p="4"
                    mx="4"
                    borderRadius="lg"
                    role="group"
                    cursor="pointer"

                    {...rest}>
                    {icon && (
                        <Icon
                            mr="4"
                            fontSize="24"
                            as={icon}
                        />
                    )}
                    {children}
                </Flex>
            </Link>
        </NextLink>
    )
}
export default NavItem;
