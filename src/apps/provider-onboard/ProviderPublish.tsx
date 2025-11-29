import { CloseIcon } from "@chakra-ui/icons";
import { VStack, Box, Heading, Text, IconButton } from "@chakra-ui/react";



export const ProviderPublish = () => {
  return (
    <VStack spacing={8} align="center" w="full">
      <Box w="full" maxW="720px" bg="white" borderRadius="2xl" boxShadow="lg" p={{ base: 6, md: 10 }}>
        <VStack spacing={6} align="start" w="full">
        <IconButton
          aria-label="Close"
          icon={<CloseIcon />}
          variant="ghost"
          position="absolute"
          top={4}
          right={4}
          size="sm"
          onClick={() => window.history.back()}
        />
        <Box>
          <Heading size="lg" mb={2} fontWeight="700">
            Publish your profile
          </Heading>
        </Box>
        </VStack>
      </Box>
    </VStack>
  );
};