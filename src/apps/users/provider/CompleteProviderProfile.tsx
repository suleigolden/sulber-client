import {
  Container,
  VStack,
  Text,
  Spinner,
  Box,
  Heading,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useCheckProviderVerification } from "~/hooks/use-check-provider-verification";
import { useUser } from "~/hooks/use-user";
import { MdVerifiedUser, MdPerson, MdInfo } from "react-icons/md";

export const CompleteProviderProfile = () => {
  const { user } = useUser();
  const { isLoading, verificationStatus } = useCheckProviderVerification();
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.300");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text color={mutedColor}>Checking your verification status...</Text>
        </VStack>
      </Box>
    );
  }

  // Only show content when both identity and profile are incomplete (user stays on page)
  const showIncompleteMessage =
    verificationStatus?.status === "identity_and_profile_not_verified";

  if (!showIncompleteMessage) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
        <VStack spacing={4}>
          <Spinner size="lg" color="brand.500" />
          <Text color={mutedColor}>Taking you to the right place...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Container maxW="560px" px={[4, 6]} py={10}>
      <Box
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="lg"
        overflow="hidden"
      >
        <VStack align="stretch" spacing={0}>
          <Box bg="brand.500" color="white" px={8} py={6}>
            <VStack align="center" spacing={3}>
              <Box fontSize="4xl">
                <MdInfo />
              </Box>
              <Heading size="md" textAlign="center">
                Complete your provider setup
              </Heading>
              <Text fontSize="sm" textAlign="center" opacity={0.9}>
                To start offering services, we need to verify your identity and complete your profile.
              </Text>
            </VStack>
          </Box>
          <VStack align="stretch" spacing={6} p={8}>
            <VStack align="stretch" spacing={2}>
              <Box display="flex" alignItems="center" gap={3}>
                <Box color="orange.500" fontSize="xl">
                  <MdPerson />
                </Box>
                <Text fontWeight="600">Profile incomplete</Text>
              </Box>
              <Text fontSize="sm" color={mutedColor} pl={9}>
                Add your name, phone, photo, date of birth, gender, and address in profile settings.
              </Text>
            </VStack>
            <VStack align="stretch" spacing={2}>
              <Box display="flex" alignItems="center" gap={3}>
                <Box color="orange.500" fontSize="xl">
                  <MdVerifiedUser />
                </Box>
                <Text fontWeight="600">Identity not verified</Text>
              </Box>
              <Text fontSize="sm" color={mutedColor} pl={9}>
                Complete identity verification in our onboarding flow.
              </Text>
            </VStack>
            <VStack spacing={3} w="full" pt={2}>
              <Button
                colorScheme="brand"
                size="lg"
                w="full"
                onClick={() => user?.id && (window.location.href = `/provider/${user.id}/provider-onboarding?step=0`)}
              >
                Verify identity first
              </Button>
              <Button
                variant="outline"
                colorScheme="brand"
                size="lg"
                w="full"
                onClick={() => user?.id && (window.location.href = `/provider/${user.id}/provider-onboarding?step=0`)}
              >
                Complete my profile
              </Button>
            </VStack>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
};
