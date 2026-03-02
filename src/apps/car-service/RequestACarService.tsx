import {
    Text,
    VStack,
    Box,
    Flex,
    useDisclosure,
    useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ProviderServiceType } from "@suleigolden/sulber-api-client";
import { LocationMap } from "~/components/location-map/LocationMap";
import { useCurrentLocation } from "~/hooks/use-current-location";
import { ConfirmServiceRequest, type ConfirmServiceRequestData } from "./ConfirmServiceRequest";
import { ProviderResultsView } from "./ProviderResultsView";
import { RequestServiceCard } from "./RequestServiceCard";

type ServiceRequestType = "one-time" | "monthly";

export const RequestACarService = () => {
    const { currentLocation, isLoadingLocation, locationError } = useCurrentLocation();
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

    // Initialize service location with current location address when available
    useEffect(() => {
        if (currentLocation && !serviceLocation) {
            setServiceLocation(currentLocation.address);
            setServiceLocationData({
                lat: currentLocation.lat,
                lng: currentLocation.lng,
                address: currentLocation.address,
                city: currentLocation.city,
                state: currentLocation.state,
                country: currentLocation.country,
                postalCode: currentLocation.postalCode,
                street: currentLocation.street,
            });
        }
    }, [currentLocation, serviceLocation]);

    // Convert current location to LocationMap address format
    const mapAddress = currentLocation
        ? {
            street: currentLocation.street || "",
            city: currentLocation.city || "",
            state: currentLocation.state || "",
            country: currentLocation.country || "",
            postal_code: currentLocation.postalCode || "",
        }
        : {
            street: "",
            city: "",
            state: "",
            country: "",
            postal_code: "",
        };

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
    const mapBg = useColorModeValue("gray.100", "gray.800");
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
                    bg={mapBg}
                    position="relative"
                    border="2px solid"
                    borderColor={mapBorder}
                >
                    {isLoadingLocation ? (
                        <Box
                            w="full"
                            h="full"
                            bg={loadingStateBg}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <VStack spacing={2} px={4}>
                                <Text color={loadingTextColor} fontSize={{ base: "md", sm: "lg" }} textAlign="center">
                                    Getting your current location...
                                </Text>
                                <Text color={loadingSubtextColor} fontSize={{ base: "xs", sm: "sm" }} textAlign="center">
                                    Please allow location access
                                </Text>
                            </VStack>
                        </Box>
                    ) : locationError ? (
                        <Box
                            w="full"
                            h="full"
                            bg={loadingStateBg}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <VStack spacing={2} px={4}>
                                <Text color="red.500" fontSize={{ base: "md", sm: "lg" }} fontWeight="medium" textAlign="center">
                                    {locationError}
                                </Text>
                                <Text color={loadingTextColor} fontSize={{ base: "xs", sm: "sm" }} textAlign="center">
                                    You can still search for a location manually
                                </Text>
                            </VStack>
                        </Box>
                    ) : currentLocation ? (
                        <Box w="full" h="full">
                            <LocationMap address={
                                {
                                    street: "7 Stroud Crescent",
                                    city: "London",
                                    state: "ON",
                                    country: "Canada",
                                    postal_code: "N6E 1Z5",
                                }
                            } />
                        </Box>
                    ) : (
                        <Box
                            w="full"
                            h="full"
                            bg={loadingStateBg}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text color={loadingTextColor} fontSize={{ base: "md", sm: "lg" }} textAlign="center">
                                No location available
                            </Text>
                        </Box>
                    )}
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
