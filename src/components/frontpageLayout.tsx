
import {FAQSection} from "./FAQSection";
import {Feature} from "./Feature";
import React from "react";
import {Box, Container, SimpleGrid, VStack, Text} from "@chakra-ui/react";
// import { HeroSection } from "./components/HeroSection";
// import { Layout } from "./components/Layout";
// import { PricingSection } from "./components/PricingSection";
// import { Helmet } from "react-helmet";
import Hero from "./Hero";

const faqs: any[] = [
    {
        q: "Is Edugram free to use?",
        a: "You can signup for free. For students, you have to put in credits in order to book a teacher",
    },
    {
        q: "Can I only teach 1 subject?",
        a: "Edugram wants you to expand your knowledge with everybody, therefor you can teach as much as you want!",
    },
    {
        q: "Do you support international payments?",
        a: "Yes - payments can be made from and to any country.",
    },
    {
        q: "Who can I connect to for support?",
        a: "Email me at info@edugram.com",
    },
];

export interface HighlightType {
    icon: string;
    title: string;
    description: string;
}

const highlights: HighlightType[] = [
    {
        icon: "🌍",
        title: "Worldwide",
        description:
            "We are everywhere! Yes, everywhere. Wherever you need help, there is alway someone to assist you!",
    },
    {
        icon: "💸",
        title: "Get Paid",
        description:
            "We want you to do well by teaching and contributing to society. Therefor with our business model, you will be able to make a fortune!",
    },
    // {
    //     icon: "😃",
    //     title: "Rapid experimenting",
    //     description:
    //         "You don't have to wait hours to update your hard-coded landing pages. Figure out what resonates with your customers the most and update the copy in seconds",
    // },
    // {
    //     icon: "🔌",
    //     title: "Rapid experimenting",
    //     description:
    //         "You don't have to wait hours to update your hard-coded landing pages. Figure out what resonates with your customers the most and update the copy in seconds",
    // },
];

interface FeatureType {
    title: string;
    description: string;
    image: string;
}

const features: FeatureType[] = [
    {
        title: "Detailed Analytics",
        description:
            "No more spending hours writing formulas in Excel to figure out how much you're making. We surface important metrics to keep your business going strong.",
        image:
            "https://launchman-space.nyc3.digitaloceanspaces.com/chakra-ui-landing-page-feature-1.png",
    },
    {
        title: "Track your clients",
        description:
            "Know when and how your projects are going so you can stay on top of delivery dates.",
        image:
            "https://launchman-space.nyc3.digitaloceanspaces.com/chakra-ui-landing-page-feature-2.png",
    },
    {
        title: "Manage projects",
        description:
            "You don't have to hunt your email inbox to find that one conversation. Every task, project, and client information is just a click away.",
        image:
            "https://launchman-space.nyc3.digitaloceanspaces.com/chakra-ui-landing-page-feature-3.png",
    },
];

const Layout = () => {
    return (
        <>
            <Box bg="gray.50" pt={{base: '50px', lg: "0px"}}>
                <VStack
                    backgroundColor="white"
                    w="full"
                    id="features"
                    spacing={16}
                    py={[16, 0]}
                >
                    {features.map(
                        ({title, description, image}: FeatureType, i: number) => {
                            return (
                                <Feature
                                    key={`feature_${i}`}
                                    title={title}
                                    description={description}
                                    image={image}
                                    reverse={i % 2 === 1}
                                />
                            );
                        }
                    )}
                </VStack>

                <Container maxW="container.md" centerContent py={[8, 28]}>
                    <SimpleGrid spacingX={10} spacingY={20} minChildWidth="300px">
                        {highlights.map(({title, description, icon}, i: number) => (
                            <Box p={4} rounded="md" key={`highlight_${i}`}>
                                <Text fontSize="4xl">{icon}</Text>

                                <Text fontSize="xl" fontWeight={700}>{title}</Text>

                                <Text color="gray.500" mt={4}>
                                    {description}
                                </Text>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Container>
                <Container py={28} maxW="container.md">
                    <Box w="full">
                        <VStack spacing={10} w="full">
                            <Text fontWeight={500} fontSize="2xl" align="center">
                                Frequently asked questions
                            </Text>
                            <FAQSection items={faqs}/>
                        </VStack>
                    </Box>
                </Container>
            </Box>

        </>
    );
};

export default Layout
