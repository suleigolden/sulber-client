import { Box } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
// import { useJob } from "~/hooks/use-job";

export const WaitingToConnectWithProvider = () => {
  return (
    <Box w="full" h="full" display="flex" justifyContent="center" alignItems="center">
      <Heading size="lg" fontWeight="bold">Waiting to connect with provider</Heading>
    </Box>
  );
};
