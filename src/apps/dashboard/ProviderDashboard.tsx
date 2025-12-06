import {
  Container,
  VStack,
} from "@chakra-ui/react";
import { ProviderManageRequests } from "../manage-requests/provider/ProviderManageRequests";

export const ProviderDashboard = () => {
  
  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        <ProviderManageRequests />
      </VStack>
    </Container>
  );
};
