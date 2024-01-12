import type {AppProps} from "next/app";
import {ChakraProvider} from "@chakra-ui/react";
import {theme} from "../theme";
import {Navbar} from "../components/shared/Navbar";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {isAuthenticated} from "./api/api.storage";
import Home from "./index";
import Footer from "../components/Footer"

export default function App({Component: Page, pageProps}: AppProps) {
    const [authenticated, setAuthenticated] = useState(false)
    const router = useRouter();

    useEffect(() => {
        isAuthenticated() ? setAuthenticated(true) : setAuthenticated(false)
    }, [])

    return (
            <ChakraProvider theme={theme}>
                {router.asPath === "/register" || router.asPath === "/" ? null : (<Navbar/>)}
                <Page {...pageProps} />
                <Footer/>
            </ChakraProvider>
    );
}
