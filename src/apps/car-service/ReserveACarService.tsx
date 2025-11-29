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
import { ProviderServiceType } from "@suleigolden/sulber-api-client";
import { LocationMap } from "~/components/location-map/LocationMap";
import { useCurrentLocation } from "~/hooks/use-current-location";

const SERVICE_TYPES: { label: string; value: ProviderServiceType }[] = [
  { label: "Driveway Car Wash", value: "DRIVEWAY_CAR_WASH" },
  { label: "Snow Shoveling", value: "SNOW_SHOVELING" },
  { label: "Parking Lot Cleaning", value: "PARKING_LOT_CLEANING" },
];

export const ReserveACarService = () => {
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
    <Box w="full" h="100vh" bg="gray.50">

      <Flex h="calc(100vh - 73px)" overflow="hidden">
        {/* Left Panel - Reserve a Service */}
        <Box
          w="400px"
          bg="white"
          borderRight="1px"
          borderColor="gray.200"
          p={6}
          overflowY="auto"
        >
          <VStack spacing={6} align="stretch">
            <Heading size="md" fontWeight="bold" mb={2}>
              Reserve a service
            </Heading>

            {/* Service Location */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
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
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                Service date and time
              </Text>
              <HStack spacing={2}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaCalendarAlt} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="date"
                    placeholder="Select date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    borderColor="gray.300"
                    _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px brand.500" }}
                  />
                </InputGroup>
                <InputGroup>
                  <Input
                    type="time"
                    placeholder="Select time"
                    value={serviceTime}
                    onChange={(e) => setServiceTime(e.target.value)}
                    borderColor="gray.300"
                    _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px brand.500" }}
                  />
                </InputGroup>
              </HStack>
            </Box>

            {/* Service Type */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                Service type
              </Text>
              <Select
                placeholder="Select service type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ProviderServiceType)}
                borderColor="gray.300"
                _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px brand.500" }}
              >
                {SERVICE_TYPES.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </Select>
            </Box>

            {/* Search Button */}
            <Button
              colorScheme="brand"
              size="lg"
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
        {/* <Box flex={1} bg="gray.100" position="relative">
          {isLoadingLocation ? (
            <Box
              w="full"
              h="full"
              bg="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <VStack spacing={2}>
                <Text color="gray.500" fontSize="lg">
                  Getting your current location...
                </Text>
                <Text color="gray.400" fontSize="sm">
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
              <VStack spacing={2}>
                <Text color="red.500" fontSize="lg" fontWeight="medium">
                  {locationError}
                </Text>
                <Text color="gray.500" fontSize="sm">
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
              <Text color="gray.500" fontSize="lg">
                No location available
              </Text>
            </Box>
          )}
        </Box> */}
      </Flex>
    </Box>
  );
};
