import {
    Box,
    Text,
    Flex,
    VStack,
    Button,
    Icon,
    Container,
    useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ProviderServiceType } from "@suleigolden/sulber-api-client";
import { RequestServiceCard } from "../car-service/RequestServiceCard";

type ServiceRequestType = "one-time" | "monthly";

export const HeroSection = () => {
    const navigate = useNavigate();
    const [serviceLocation, setServiceLocation] = useState<string>("");
    const [serviceLocationData, setServiceLocationData] = useState<{
        lat: number;
        lng: number;
        address: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
        street?: string;
    } | null>(null);
    const [serviceDate, setServiceDate] = useState<string>("");
    const [serviceTime, setServiceTime] = useState<string>("");
    const [serviceType, setServiceType] = useState<ProviderServiceType | "">("");
    const [serviceRequestType, setServiceRequestType] = useState<ServiceRequestType>("one-time");

    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("black", "white");

    const handleSearch = () => {
        // Navigate to car service page with the form data
        navigate("/car-service");
    };

    const isSearchDisabled = !serviceLocation || !serviceDate || !serviceTime || !serviceType;

    return (
        <Box w="full" bg={bgColor} py={{ base: 8, md: 12 }}>
            <Container maxW="container.xl">
                <Flex
                    direction={{ base: "column", lg: "row" }}
                    gap={{ base: 8, lg: 12 }}
                    align={{ base: "start", lg: "center" }}
                >
                    {/* Left Section - Service Request Card */}
                    <Box flex={1} w="full" maxW={{ base: "100%", lg: "500px" }}>
                        <RequestServiceCard
                            serviceLocation={serviceLocation}
                            onServiceLocationChange={setServiceLocation}
                            onServiceLocationDataChange={setServiceLocationData}
                            serviceDate={serviceDate}
                            onServiceDateChange={setServiceDate}
                            serviceTime={serviceTime}
                            onServiceTimeChange={setServiceTime}
                            serviceType={serviceType}
                            onServiceTypeChange={setServiceType}
                            serviceRequestType={serviceRequestType}
                            onServiceRequestTypeChange={setServiceRequestType}
                            onSearch={handleSearch}
                            isSearchDisabled={isSearchDisabled}
                        />
                    </Box>

                    {/* Right Section - Illustration */}
                    <Box
                        flex={1}
                        w="full"
                        position="relative"
                        minH={{ base: "300px", lg: "500px" }}
                        borderRadius="xl"
                        overflow="hidden"
                        bgGradient="linear(to-br, blue.50, purple.50)"
                        display={{ base: "none", lg: "block" }}
                    >
                        {/* Placeholder Illustration - You can replace this with an actual illustration */}
                        <Box
                            w="full"
                            h="full"
                            position="relative"
                            bgGradient="linear(to-br, blue.100, purple.100)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            {/* Simple illustration placeholder */}
                            <VStack spacing={4} color="gray.600">
                                <Icon as={MdLocationOn} boxSize={32} opacity={0.3} />
                                <Text fontSize="xl" fontWeight="medium" opacity={0.5}>
                                    Service Illustration
                                </Text>
                            </VStack>

                            {/* CTA Overlay */}
                            <Box
                                position="absolute"
                                bottom={0}
                                left={0}
                                right={0}
                                bg="whiteAlpha.900"
                                backdropFilter="blur(10px)"
                                p={4}
                                borderTopRadius="xl"
                            >
                                <Flex justify="space-between" align="center">
                                    <Text fontSize="md" fontWeight="medium" color={textColor}>
                                        Reserve a service
                                    </Text>
                                    <Button
                                        colorScheme="brand"
                                        size="sm"
                                        borderRadius="full"
                                        onClick={() => navigate("/car-service")}
                                    >
                                        Schedule
                                    </Button>
                                </Flex>
                            </Box>
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};