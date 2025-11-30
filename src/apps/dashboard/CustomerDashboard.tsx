import {
  Container,
  VStack,
  Box,
  Heading,
  Text,
  Button,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { RequestACarService } from "../car-service/RequestACarService";
import { useUserProfile } from "~/hooks/use-user-profile";
import { useUser } from "~/hooks/use-user";
import { FaUser, FaArrowRight } from "react-icons/fa";

export const CustomerDashboard = () => {
  const { userProfile, isLoading } = useUserProfile();
  const { user } = useUser();
  const navigate = useNavigate();

  // Check if user profile is complete
  const isProfileComplete = () => {
    if (!userProfile) return false;

    const hasRequiredFields =
      userProfile.firstName &&
      userProfile.lastName &&
      userProfile.phoneNumber &&
      userProfile.dateOfBirth &&
      userProfile.gender;

    const hasAddress =
      userProfile.address &&
      (userProfile.address.city ||
        userProfile.address.state ||
        userProfile.address.country);

    return !!(hasRequiredFields && hasAddress);
  };

  const handleGoToProfileSettings = () => {
    if (user?.id) {
      navigate(`/${user.role}/${user.id}/profile-settings`);
    }
  };

  if (isLoading) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <VStack align="start" spacing={8} w="full" mt={10}>
          <Text>Loading...</Text>
        </VStack>
      </Container>
    );
  }

  if (!isProfileComplete()) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <VStack align="start" spacing={8} w="full" mt={10}>
          <Box
            w="full"
            maxW="720px"
            bg="white"
            borderRadius="2xl"
            boxShadow="lg"
            p={{ base: 6, sm: 8, md: 10 }}
          >
            <VStack spacing={6} align="start">
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg="brand.50"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaUser} color="brand.500" boxSize={6} />
                </Box>
                <Heading size="lg" color="gray.800">
                  Complete Your Profile
                </Heading>
              </HStack>

              <Text fontSize="md" color="gray.600" lineHeight="tall">
                To start booking services, please complete your profile by providing:
              </Text>

              <Box
                bg="blue.50"
                borderLeft="4px solid"
                borderColor="blue.500"
                p={4}
                borderRadius="md"
                w="full"
              >
                <VStack align="start" spacing={2} pl={2}>
                  <Text fontSize="sm" color="blue.900" fontWeight="medium">
                    Required Information:
                  </Text>
                  <VStack align="start" spacing={1} pl={4}>
                    <Text fontSize="sm" color="blue.800">
                      • First Name and Last Name
                    </Text>
                    <Text fontSize="sm" color="blue.800">
                      • Phone Number
                    </Text>
                    <Text fontSize="sm" color="blue.800">
                      • Date of Birth
                    </Text>
                    <Text fontSize="sm" color="blue.800">
                      • Gender
                    </Text>
                    <Text fontSize="sm" color="blue.800">
                      • Address (City, State, or Country)
                    </Text>
                  </VStack>
                </VStack>
              </Box>

              <Button
                colorScheme="brand"
                size="lg"
                rightIcon={<Icon as={FaArrowRight} />}
                onClick={handleGoToProfileSettings}
                w={{ base: "full", sm: "auto" }}
              >
                Complete Profile
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        <RequestACarService />
      </VStack>
    </Container>
  );
};





