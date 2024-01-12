import { Flex, Box, Container } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface BaseLayoutProps {
  children?: ReactNode;
}
export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <Flex flexDirection="column" height="100vh" minW={320}>
      <Box as="main" flex="1 0 auto" display="block">
        <Container maxWidth='container.xl'  p={0}>{children}</Container>
      </Box>
    </Flex>
  );
}
