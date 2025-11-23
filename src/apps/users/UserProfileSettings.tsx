import { Container, VStack } from "@chakra-ui/react";
import { useUser } from "~/hooks/use-user";

export const UserProfileSettings = () => {
  const { user } = useUser();
  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        {/* {user?.role === "customer" ? (
          <CustomerProfileSettings />
        ) : (
          <ProviderProfileSettings />
        )} */}
      </VStack>
    </Container>
  );
};
