import { Container, VStack } from "@chakra-ui/react";
import { ReserveACarService } from "../car-service/ReserveACarService";
import { useUserProfile } from "~/hooks/use-user-profile";

export const CustomerDashboard = () => {
  const { userProfile } = useUserProfile();
  console.log("userProfile: ", userProfile);
  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        <ReserveACarService />
      </VStack>
    </Container>
  );
};
