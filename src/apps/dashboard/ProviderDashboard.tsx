import {
  Container,
  VStack,
} from "@chakra-ui/react";
import { ProviderManageRequests } from "../manage-requests/provider/ProviderManageRequests";
import { useCheckProviderVerification } from "~/hooks/use-check-provider-verification";

export const ProviderDashboard = () => {
  const {isLoading } = useCheckProviderVerification();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        <ProviderManageRequests />
      </VStack>
    </Container>
  );
};
