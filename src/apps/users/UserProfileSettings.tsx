import { Container, VStack } from "@chakra-ui/react";
import { useUser } from "~/hooks/use-user";
import { CustomerProfileSettings } from "./customer";
import { ProviderProfileSettings } from "./provider";

export const UserProfileSettings = () => {
  const { user } = useUser();
  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        {user?.role === "customer" ? (
          <CustomerProfileSettings />
        ) :
          user?.role === "provider" ? (
            <ProviderProfileSettings />
          ) : null}
      </VStack>
    </Container>
  );
};
