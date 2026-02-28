import {
  Container,
  VStack,
  Box,
  Heading,
  Text,
  Button,
  HStack,
  Icon,
  useColorModeValue,
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

  const cardBg = useColorModeValue("white", "#0b1437");
  const headingColor = useColorModeValue("gray.800", "white");
  const bodyColor = useColorModeValue("gray.600", "gray.300");
  const loadingColor = useColorModeValue("gray.600", "gray.400");
  const iconBoxBg = useColorModeValue("brand.50", "whiteAlpha.200");
  const infoBoxBg = useColorModeValue("blue.50", "whiteAlpha.200");
  const infoBoxBorder = useColorModeValue("blue.500", "blue.300");
  const infoTitleColor = useColorModeValue("blue.900", "blue.100");
  const infoItemColor = useColorModeValue("blue.800", "blue.200");

  // Check if user profile is complete
  const isProfileComplete = () => {
    if (!userProfile) return false;

    const hasRequiredFields =
      userProfile.first_name &&
      userProfile.last_name &&
      userProfile.phone_number &&
      userProfile.date_of_birth &&
      userProfile.gender &&
      userProfile.address &&
      (userProfile.address.city ||
        userProfile.address.state ||
        userProfile.address.country ||
        userProfile.address.postal_code);

    const hasAddress =
      userProfile.address &&
      (userProfile.address.city ||
        userProfile.address.state ||
        userProfile.address.country ||
        userProfile.address.postal_code);

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
          <Text color={loadingColor}>Loading...</Text>
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
            bg={cardBg}
            borderRadius="2xl"
            boxShadow="lg"
            p={{ base: 6, sm: 8, md: 10 }}
          >
            <VStack spacing={6} align="start">
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg={iconBoxBg}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaUser} color="brand.500" boxSize={6} />
                </Box>
                <Heading size="lg" color={headingColor}>
                  Complete Your Profile
                </Heading>
              </HStack>

              <Text fontSize="md" color={bodyColor} lineHeight="tall">
                To start booking services, please complete your profile by providing:
              </Text>

              <Box
                bg={infoBoxBg}
                borderLeft="4px solid"
                borderColor={infoBoxBorder}
                p={4}
                borderRadius="md"
                w="full"
              >
                <VStack align="start" spacing={2} pl={2}>
                  <Text fontSize="sm" color={infoTitleColor} fontWeight="medium">
                    Required Information:
                  </Text>
                  <VStack align="start" spacing={1} pl={4}>
                    <Text fontSize="sm" color={infoItemColor}>
                      • First Name and Last Name
                    </Text>
                    <Text fontSize="sm" color={infoItemColor}>
                      • Phone Number
                    </Text>
                    <Text fontSize="sm" color={infoItemColor}>
                      • Date of Birth
                    </Text>
                    <Text fontSize="sm" color={infoItemColor}>
                      • Gender
                    </Text>
                    <Text fontSize="sm" color={infoItemColor}>
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





