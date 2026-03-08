import { Container, Heading, VStack } from "@chakra-ui/react";

export const SystemAdminDashboard = () => {
  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        <Heading>SystemAdminDashboard</Heading>
      </VStack>
    </Container>
  );
};