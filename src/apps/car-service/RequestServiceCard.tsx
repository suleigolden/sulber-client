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
    Icon,
    Radio,
    RadioGroup,
    Stack,
    Alert,
    AlertIcon,
    AlertDescription,
    useColorModeValue,
    Link,
} from "@chakra-ui/react";
import { FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import { LocationSearchInput } from "../provider-onboard/components/LocationSearchInput";
import { ProviderServiceType, ProviderServiceTypesList } from "@suleigolden/sulber-api-client";
import { MdLocationOn } from "react-icons/md";
import { useCurrentLocation } from "~/hooks/use-current-location";

type ServiceRequestType = "one-time" | "monthly";

type LocationData = {
    lat: number;
    lng: number;
    address: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    street?: string;
} | null;

type RequestServiceCardProps = {
    serviceLocation: string;
    onServiceLocationChange: (location: string) => void;
    onServiceLocationDataChange: (locationData: LocationData) => void;
    serviceDate: string;
    onServiceDateChange: (date: string) => void;
    serviceTime: string;
    onServiceTimeChange: (time: string) => void;
    serviceType: ProviderServiceType | "";
    onServiceTypeChange: (type: ProviderServiceType) => void;
    serviceRequestType: ServiceRequestType;
    onServiceRequestTypeChange: (type: ServiceRequestType) => void;
    onSearch: () => void;
    isSearchDisabled: boolean;
};

export const RequestServiceCard = ({
    serviceLocation,
    onServiceLocationChange,
    onServiceLocationDataChange,
    serviceDate,
    onServiceDateChange,
    serviceTime,
    onServiceTimeChange,
    serviceType,
    onServiceTypeChange,
    serviceRequestType,
    onServiceRequestTypeChange,
    onSearch,
    isSearchDisabled,
}: RequestServiceCardProps) => {
    const { currentLocation } = useCurrentLocation();
    const textColor = useColorModeValue("black", "white");
    const linkColor = useColorModeValue("blue.500", "blue.300");
    // Format location display
    const locationDisplay = currentLocation
        ? `${currentLocation.city || ""}, ${currentLocation.state || ""}, ${currentLocation.country || ""}`
            .replace(/^,\s*|,\s*$/g, "")
            .replace(/,\s*,/g, ",")
        : "Select location";

    return (
        <VStack
            spacing={{ base: 4, sm: 5, md: 6 }}
            align="stretch"
            borderRadius="lg"
            p={{ base: 4, sm: 5, md: 6 }}
        >
            {/* Location Header */}
            <HStack spacing={2} fontSize={{ base: "sm", md: "md" }}>
                <Icon as={MdLocationOn} color="gray.500" />
                <Text color="gray.600">{locationDisplay}</Text>
                <Link
                    color={linkColor}
                    textDecoration="underline"
                    _hover={{ textDecoration: "none" }}
                    fontSize={{ base: "xs", md: "sm" }}
                >
                    Change city
                </Link>
            </HStack>
            <VStack align="start" spacing={2}>
                <Text
                    fontSize={{ base: "2xl", md: "2xl", lg: "3xl" }}
                    fontWeight="bold"
                    color={textColor}
                    lineHeight="1.1"
                >
                    Get Your Car, Driveway and Window Cleaned
                </Text>
                <Text
                    fontSize={{ base: "2xl", md: "2xl", lg: "3xl" }}
                    fontWeight="bold"
                    color={textColor}
                    lineHeight="1.1"
                >
                    with Sulber
                </Text>
            </VStack>

            {/* Service Location */}
            <Box>
                <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium" mb={2} color={textColor}>
                    Service location
                </Text>
                <LocationSearchInput
                    onLocationSelect={(location) => {
                        onServiceLocationChange(location?.address || "");
                        onServiceLocationDataChange(location);
                    }}
                    initialValue={serviceLocation}
                />
            </Box>

            {/* Service Date and Time */}
            <Box>
                <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium" mb={2} color={textColor}>
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
                            onChange={(e) => onServiceDateChange(e.target.value)}
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
                            onChange={(e) => onServiceTimeChange(e.target.value)}
                            borderColor="gray.300"
                            size={{ base: "md", sm: "md" }}
                            _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px brand.500" }}
                        />
                    </InputGroup>
                </HStack>
            </Box>

            {/* Service Type */}
            <Box>
                <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium" mb={2} color={textColor}>
                    Service type
                </Text>
                <Select
                    placeholder="Select service type"
                    value={serviceType}
                    onChange={(e) => onServiceTypeChange(e.target.value as ProviderServiceType)}
                    borderColor="gray.300"
                    _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px brand.500" }}
                >
                    {ProviderServiceTypesList.services.map((service) => (
                        <option key={service.type} value={service.type}>
                            {service.title}
                        </option>
                    ))}
                </Select>
            </Box>

            {/* Service Request Type */}
            <Box>
                <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium" mb={2} color={textColor}>
                    Service Request Type
                </Text>
                <RadioGroup
                    value={serviceRequestType}
                    onChange={(value) => onServiceRequestTypeChange(value as ServiceRequestType)}
                >
                    <Stack
                        direction={{ base: "column", sm: "row" }}
                        spacing={{ base: 3, sm: 4 }}
                        align={{ base: "start", sm: "center" }}
                    >
                        <Radio
                            value="one-time"
                            colorScheme="brand"
                            size={{ base: "sm", sm: "md" }}
                            whiteSpace={{ base: "normal", sm: "nowrap" }}
                        >
                            One time service
                        </Radio>
                        <Radio
                            value="monthly"
                            colorScheme="brand"
                            size={{ base: "sm", sm: "md" }}
                            whiteSpace={{ base: "normal", sm: "nowrap" }}
                        >
                            Monthly service (4 times a month)
                        </Radio>
                    </Stack>
                </RadioGroup>

                {/* Monthly Subscription Info */}
                {serviceRequestType === "monthly" && (
                    <Alert
                        status="info"
                        variant="subtle"
                        borderRadius="md"
                        mt={3}
                        fontSize={{ base: "xs", sm: "sm" }}
                        flexDirection={{ base: "column", sm: "row" }}
                    >
                        <AlertIcon as={FaInfoCircle} boxSize={{ base: "16px", sm: "20px" }} />
                        <AlertDescription
                            fontSize={{ base: "xs", sm: "sm" }}
                            lineHeight={{ base: "1.4", sm: "1.5" }}
                        >
                            This is a monthly subscription. You will only be charged based on how many times the service is completed over 4 visits per month.
                        </AlertDescription>
                    </Alert>
                )}
            </Box>

            {/* Search Button */}
            <Button
                colorScheme="brand"
                size={{ base: "md", sm: "lg" }}
                w="full"
                onClick={onSearch}
                isDisabled={isSearchDisabled}
                mt={4}
            >
                Search
            </Button>
        </VStack>
    );
};

