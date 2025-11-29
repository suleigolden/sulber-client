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
import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { LocationSearchInput } from "../provider-onboard/components/LocationSearchInput";
import { ProviderServiceType } from "@suleigolden/sulber-api-client";
import { LocationMap } from "~/components/location-map/LocationMap";

const SERVICE_TYPES: { label: string; value: ProviderServiceType }[] = [
  { label: "Driveway Car Wash", value: "DRIVEWAY_CAR_WASH" },
  { label: "Snow Shoveling", value: "SNOW_SHOVELING" },
  { label: "Parking Lot Cleaning", value: "PARKING_LOT_CLEANING" },
];

export const ReserveACarService = () => {
  const [serviceLocation, setServiceLocation] = useState<string>("");
  const [serviceDate, setServiceDate] = useState<string>("");
  const [serviceTime, setServiceTime] = useState<string>("");
  const [serviceType, setServiceType] = useState<ProviderServiceType | "">("");

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
        <Box flex={1} bg="gray.100" position="relative">
          {/* Placeholder for map - Replace with actual map component */}
          <Box
            w="full"
            h="full"
            bg="gray.200"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
              
              <LocationMap
              address={
                 {
                  street: "",
                  city: "ON",
                  state: "ON",
                  country: "Canada",
                  postal_code: "M5A 0J5",
                }
              }
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};
