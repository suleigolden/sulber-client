import { Container, Heading } from "@chakra-ui/react";
import { Box, VStack } from "@chakra-ui/react";

export const ProviderProfileSettings = () => {
  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        <Box>
          <Heading size="lg" mb={2}>Provider Profile Settings</Heading>
        </Box>
      </VStack>
    </Container>
  );
};