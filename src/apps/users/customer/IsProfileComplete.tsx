import { Container, VStack, Box, HStack, Icon, Heading, Button, Text } from "@chakra-ui/react";
import { FaUser, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSystemColor } from "~/hooks/use-system-color";
import { useUser } from "~/hooks/use-user";


export const IsProfileComplete = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { modalBg,
        headingColor,
        bodyColor,
        brandColor,
        infoBoxBg,
        infoBoxBorder,
        mutedTextColor,
        borderColor } = useSystemColor();

    const handleGoToProfileSettings = () => {
        if (user?.id) {
            navigate(`/${user.role}/${user.id}/profile-settings`);
        }
    };



    return (
        <Container maxW="1500px" px={[4, 8]} py={8}>
            <VStack align="start" spacing={8} w="full" mt={10}>
                <Box
                    w="full"
                    maxW="720px"
                    bg={modalBg}
                    borderRadius="2xl"
                    boxShadow="lg"
                    p={{ base: 6, sm: 8, md: 10 }}
                >
                    <VStack spacing={6} align="start">
                        <HStack spacing={4}>
                            <Box
                                p={3}
                                bg={brandColor}
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Icon as={FaUser} color={brandColor} boxSize={6} />
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
                                <Text fontSize="sm" color={mutedTextColor} fontWeight="medium">
                                    Required Information:
                                </Text>
                                <VStack align="start" spacing={1} pl={4}>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        • First Name and Last Name
                                    </Text>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        • Phone Number
                                    </Text>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        • Date of Birth
                                    </Text>
                                    <Text fontSize="sm" color={mutedTextColor}>
                                        • Gender
                                    </Text>
                                    <Text fontSize="sm" color={mutedTextColor}>
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