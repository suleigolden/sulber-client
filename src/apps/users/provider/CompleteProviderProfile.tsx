import { Container, VStack, Text, Spinner } from "@chakra-ui/react";
import { useCheckProviderVerification } from "~/hooks/use-check-provider-verification";

export const CompleteProviderProfile = () => {
    const { isLoading: isCheckingVerification } = useCheckProviderVerification();
    if (isCheckingVerification) {
        return <Spinner size="lg" color="brand.500" />;
    }
    return (
        <Container maxW="1500px" px={[4, 8]} py={8}>
            <VStack align="start" spacing={8} w="full" mt={10}>
                <Text>Complete Provider Profile</Text>
            </VStack>
        </Container>
    );
};