import { useState } from "react";
import {
    Text,
    VStack,
    Box,
    Flex,
    Image,
    useDisclosure,
    useColorModeValue,
} from "@chakra-ui/react";
import { ProviderServiceType } from "@suleigolden/sulber-api-client";
import { ConfirmServiceRequest, type ConfirmServiceRequestData } from "./ConfirmServiceRequest";
import { ProviderResultsView } from "./ProviderResultsView";
import { RequestServiceCard } from "./RequestServiceCard";
import heroIllustration from "~/assets/hero-illustration.png";


type ServiceRequestType = "one-time" | "monthly";

export const RequestACarService = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [providerResultsData, setProviderResultsData] = useState<ConfirmServiceRequestData | null>(null);
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

    const handleSearch = () => {
        onOpen();
    };

    const handleFindProviders = (data: ConfirmServiceRequestData) => {
        setProviderResultsData(data);
        onClose();
    };

    const handleBackFromProviderResults = () => {
        setProviderResultsData(null);
    };

    const isSearchDisabled = !serviceLocation || !serviceDate || !serviceTime || !serviceType;

    const pageBg = useColorModeValue("gray.50", "#0b1437");
    const leftPanelBg = useColorModeValue("white", "#0b1437");
    const mapBorder = useColorModeValue("white", "whiteAlpha.300");
    const loadingStateBg = useColorModeValue("gray.200", "whiteAlpha.200");
    const loadingTextColor = useColorModeValue("gray.500", "gray.400");
    const loadingSubtextColor = useColorModeValue("gray.400", "gray.500");

    if (providerResultsData) {
        return (
            <Box w="full" minH="100vh" bg={pageBg}>
                <ProviderResultsView data={providerResultsData} onBack={handleBackFromProviderResults} />
            </Box>
        );
    }

    return (
        <Box w="full" minH="100vh" bg={pageBg}>
            <Flex
                direction={{ base: "column", md: "row" }}
                h={{ base: "auto", md: "100vh" }}
                overflow="hidden"
            >
                {/* Left Panel - Reserve a Service */}
                <Box
                    w={{ base: "100%", md: "400px", lg: "450px" }}
                    bg={leftPanelBg}
                    p={{ base: 4, sm: 5, md: 6 }}
                    overflowY="auto"
                    maxH={{ base: "60vh", md: "100vh" }}
                >
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

                {/* Right Section - Map */}
                <Box
                    flex={1}
                    w={{ base: "100%", md: "auto" }}
                    h={{ base: "40vh", md: "100vh" }}
                    minH={{ base: "300px", md: "auto" }}
                    bg={leftPanelBg}
                    position="relative"
                    border="2px solid"
                    borderColor={mapBorder}
                >
                    <Box w="full" h="full" position="relative">
                            <Image
                                src={heroIllustration}
                                alt="Exterior services at your driveway — car wash, home and yard"
                                w="full"
                                h="full"
                                objectFit="cover"
                                objectPosition="center"
                            />
                            <Box
                                position="absolute"
                                bottom={{ base: 4, md: 8 }}
                                left={{ base: 4, md: 8 }}
                                right={{ base: 4, md: 8 }}
                                maxW={{ base: "100%", md: "480px" }}
                                bg="blackAlpha.600"
                                borderRadius="lg"
                                p={{ base: 4, md: 5 }}
                            >
                                <VStack align="flex-start" spacing={2}>
                                    <Text
                                        color="white"
                                        fontSize={{ base: "md", md: "lg", lg: "2xl" }}
                                        fontWeight="semibold"
                                    >
                                        Get your car washed or cleaned right in your driveway.
                                    </Text>
                                    <Text
                                        color="whiteAlpha.900"
                                        fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                        lineHeight="tall"
                                    >
                                        Earn money on your own schedule by offering car wash, backyard, and front yard
                                        cleaning services.
                                    </Text>
                                </VStack>
                            </Box>
                        </Box>
                </Box>
            </Flex>

            {/* Confirm Service Request Modal */}
            <ConfirmServiceRequest
                isOpen={isOpen}
                onClose={onClose}
                serviceLocation={serviceLocation}
                serviceLocationData={serviceLocationData}
                serviceDate={serviceDate}
                serviceTime={serviceTime}
                serviceType={serviceType}
                serviceRequestType={serviceRequestType}
                onFindProviders={handleFindProviders}
            />
        </Box>
    );
};
