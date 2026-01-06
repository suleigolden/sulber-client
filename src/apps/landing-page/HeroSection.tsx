import {
    Box,
    Flex,
    Image,
    Container,
    useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
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
                        borderRadius="xl"
                        overflow="hidden"
                        display={{ base: "none", lg: "block" }}
                    >
                        {/* Placeholder Illustration - You can replace this with an actual illustration */}
                        <Image src="/images/busy_suburban_service_day.png"
                            alt="Busy suburban service day"
                            w="full"
                            h="full"
                            objectFit="cover"
                            objectPosition="center" />
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};