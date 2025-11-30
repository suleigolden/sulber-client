import {
  Container,
  VStack,
} from "@chakra-ui/react";
import { RequestACarService } from "../car-service/RequestACarService";

export const ProviderDashboard = () => {
  
  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        <RequestACarService />
      </VStack>
    </Container>
  );
};
