import {
  Container,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { RequestACarService } from "../car-service/RequestACarService";
import { IsProfileComplete } from "../users/customer/IsProfileComplete";
import { useIsCustomerProfileComplete } from "~/hooks/use-is-customer-profile-complete";

export const CustomerDashboard = () => {
  const { isProfileComplete, isLoading } = useIsCustomerProfileComplete();
  const loadingColor = useColorModeValue("gray.600", "gray.400");


  if (isLoading) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <VStack align="start" spacing={8} w="full" mt={10}>
          <Text color={loadingColor}>Loading...</Text>
        </VStack>
      </Container>
    );
  }

  if (!isProfileComplete()) {
    return <IsProfileComplete />;
  }

  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        <RequestACarService />
      </VStack>
    </Container>
  );
};





