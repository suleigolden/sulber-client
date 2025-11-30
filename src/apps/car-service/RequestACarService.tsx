import {
    Text,
    VStack,
    HStack,
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    Button,
    Select,
    Flex,
    Icon,
    Heading,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { LocationSearchInput } from "../provider-onboard/components/LocationSearchInput";
import { ProviderServiceType, ProviderServiceTypes } from "@suleigolden/sulber-api-client";
import { LocationMap } from "~/components/location-map/LocationMap";
import { useCurrentLocation } from "~/hooks/use-current-location";


export const RequestACarService = () => {
    const { currentLocation, isLoadingLocation, locationError } = useCurrentLocation();
    const [serviceLocation, setServiceLocation] = useState<string>("");
    const [serviceDate, setServiceDate] = useState<string>("");
    const [serviceTime, setServiceTime] = useState<string>("");
    const [serviceType, setServiceType] = useState<ProviderServiceType | "">("");

    // Initialize service location with current location address when available
    useEffect(() => {
        if (currentLocation && !serviceLocation) {
            setServiceLocation(currentLocation.address);
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
        // TODO: Implement search functionality
        console.log({ serviceLocation, serviceDate, serviceTime, serviceType });
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
                    <VStack
                        spacing={{ base: 4, sm: 5, md: 6 }}
                        align="stretch"
                        boxShadow="lg"
                        borderRadius="lg"
                        p={{ base: 4, sm: 5, md: 6 }}
                    >
                        <Heading size={{ base: "sm", sm: "md" }} fontWeight="bold" mb={2}>
                            Request a service
                        </Heading>

                        {/* Service Location */}
                        <Box>
                            <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium" mb={2} color="gray.700">
                                Service location
                            </Text>
                            <LocationSearchInput
                                onLocationSelect={(location) => {
                                    setServiceLocation(location?.address || "");
                                }}
                                initialValue={serviceLocation}
                            />
                        </Box>
                        {/* Service Date and Time */}
                        <Box>
                            <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium" mb={2} color="gray.700">
                                Service date and time
                            </Text>
                            <HStack spacing={2} flexWrap={{ base: "wrap", sm: "nowrap" }}>
                                <InputGroup flex={{ base: "1 1 100%", sm: "1 1 auto" }}>
                                    <InputLeftElement pointerEvents="none">
                                        <Icon as={FaCalendarAlt} color="gray.400" />
                                    </InputLeftElement>
                                    <Input
                                        type="date"
                                        placeholder="Select date"
                                        value={serviceDate}
                                        onChange={(e) => setServiceDate(e.target.value)}
                                        borderColor="gray.300"
                                        size={{ base: "md", sm: "md" }}
                                        _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px brand.500" }}
                                    />
                                </InputGroup>
                                <InputGroup flex={{ base: "1 1 100%", sm: "1 1 auto" }}>
                                    <Input
                                        type="time"
                                        placeholder="Select time"
                                        value={serviceTime}
                                        onChange={(e) => setServiceTime(e.target.value)}
                                        borderColor="gray.300"
                                        size={{ base: "md", sm: "md" }}
                                        _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px brand.500" }}
                                    />
                                </InputGroup>
                            </HStack>
                        </Box>

                        {/* Service Type */}
                        <Box>
                            <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium" mb={2} color="gray.700">
                                Service type
                            </Text>
                            <Select
                                placeholder="Select service type"
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value as ProviderServiceType)}
                                borderColor="gray.300"
                                _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px brand.500" }}
                            >
                                {ProviderServiceTypes.map((service: ProviderServiceType) => (
                                    <option key={service} value={service}>
                                        {service.charAt(0).toUpperCase() + service.slice(1).replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </Select>
                        </Box>

                        {/* Search Button */}
                        <Button
                            colorScheme="brand"
                            size={{ base: "md", sm: "lg" }}
                            w="full"
                            onClick={handleSearch}
                            isDisabled={isSearchDisabled}
                            mt={4}
                        >
                            Search
                        </Button>
                    </VStack>
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
        </Box>
    );
};
