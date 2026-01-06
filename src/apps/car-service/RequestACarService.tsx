import {
    Text,
    VStack,
    Box,
    Flex,
    useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ProviderServiceType } from "@suleigolden/sulber-api-client";
import { LocationMap } from "~/components/location-map/LocationMap";
import { useCurrentLocation } from "~/hooks/use-current-location";
import { ConfirmServiceRequest } from "./ConfirmServiceRequest";
import { RequestServiceCard } from "./RequestServiceCard";

type ServiceRequestType = "one-time" | "monthly";

export const RequestACarService = () => {
    const { currentLocation, isLoadingLocation, locationError } = useCurrentLocation();
    const { isOpen, onOpen, onClose } = useDisclosure();
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
        // Open the confirmation modal
        onOpen();
    };

    const isSearchDisabled = !serviceLocation || !serviceDate || !serviceTime || !serviceType;

    return (
        <Box w="full" minH="100vh" bg="gray.50">
            <Flex
                direction={{ base: "column", md: "row" }}
                h={{ base: "auto", md: "100vh" }}
                overflow="hidden"
            >
                {/* Left Panel - Reserve a Service */}
                <Box
                    w={{ base: "100%", md: "400px", lg: "450px" }}
                    bg="white"
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
                    bg="gray.100"
                    position="relative"
                    border="2px solid white"
                >
                    {isLoadingLocation ? (
                        <Box
                            w="full"
                            h="full"
                            bg="gray.200"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <VStack spacing={2} px={4}>
                                <Text color="gray.500" fontSize={{ base: "md", sm: "lg" }} textAlign="center">
                                    Getting your current location...
                                </Text>
                                <Text color="gray.400" fontSize={{ base: "xs", sm: "sm" }} textAlign="center">
                                    Please allow location access
                                </Text>
                            </VStack>
                        </Box>
                    ) : locationError ? (
                        <Box
                            w="full"
                            h="full"
                            bg="gray.200"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <VStack spacing={2} px={4}>
                                <Text color="red.500" fontSize={{ base: "md", sm: "lg" }} fontWeight="medium" textAlign="center">
                                    {locationError}
                                </Text>
                                <Text color="gray.500" fontSize={{ base: "xs", sm: "sm" }} textAlign="center">
                                    You can still search for a location manually
                                </Text>
                            </VStack>
                        </Box>
                    ) : currentLocation ? (
                        <Box w="full" h="full">
                            <LocationMap address={mapAddress} />
                        </Box>
                    ) : (
                        <Box
                            w="full"
                            h="full"
                            bg="gray.200"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text color="gray.500" fontSize={{ base: "md", sm: "lg" }} textAlign="center">
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
                    />
        </Box>
    );
};
