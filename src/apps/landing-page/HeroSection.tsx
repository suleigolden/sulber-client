import {
    Box,
    Flex,
    Image,
    Container,
    Text,
    Select,
    Button,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ProviderServiceType,
    ProviderServiceTypesList,
} from "@suleigolden/sulber-api-client";
import { FiArrowRight, FiCalendar, FiCheck, FiShield } from "react-icons/fi";
import { LocationSearchInput } from "../provider-onboard/components/LocationSearchInput";
import heroIllustration from "~/assets/hero-illustration.png";


export const HeroSection = () => {
    const navigate = useNavigate();
    const [serviceLocation, setServiceLocation] = useState<string>("");
    const [serviceType, setServiceType] = useState<ProviderServiceType | "">("");

    const bgBase = useColorModeValue("white", "#0b1437");
    const headlineDark = useColorModeValue("gray.800", "white");
    const bodyColor = useColorModeValue("gray.700", "gray.300");
    const inputBg = useColorModeValue("gray.50", "whiteAlpha.200");
    const inputBorder = useColorModeValue("gray.200", "whiteAlpha.300");
    const searchRowBg = useColorModeValue("#FFFFFF", "#0b1437");
    const searchRowBorder = useColorModeValue("#E0E0E0", "whiteAlpha.300");
    const benefitIconColor = useColorModeValue("gray.500", "gray.400");

    const handleSearch = () => {
        navigate("/car-service", {
            state: { address: serviceLocation || undefined, serviceType: serviceType || undefined },
        });
    };

    const isSearchDisabled = !serviceLocation || !serviceType;

    return (
        <Box
            id="hero"
            w="full"
            // minH={{ base: "auto", lg: "calc(100vh - 80px)" }}
            bg={bgBase}
            backgroundImage="radial-gradient(80% 60% at 50% 40%, rgba(81, 86, 236, 0.12) 0%, rgba(123, 73, 223, 0.06) 40%, transparent 70%)"
            py={{ base: 10, md: 16 }}
        >
            <Container maxW="1600px" px={{ base: 4, md: 8 }}>
                <Flex
                    direction={{ base: "column", lg: "row" }}
                    gap={{ base: 10, lg: 1 }}
                    align={{ base: "start", lg: "center" }}
                >
                    {/* Left Section - Content */}
                    <Box flex={{ base: "1 1 100%", lg: "3 1 0%" }} w="full" minW={0}>
                        {/* Availability indicator */}
                        <Flex align="center" gap={2} mb={5}>
                            <Box
                                w="2"
                                h="2"
                                borderRadius="full"
                                bg="brand.500"
                                flexShrink={0}
                            />
                            <Text
                                fontSize="sm"
                                color={'brand.500'}
                                fontWeight="medium"
                            >
                                Now available in your area
                            </Text>
                        </Flex>

                        {/* Headline */}
                        <Text
                            as="h1"
                            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                            fontWeight="bold"
                            lineHeight="1.15"
                            color={headlineDark}
                            mb={4}
                        >
                            Exterior Services,{" "}
                            <Box as="span" color="brand.500">
                                Delivered to Your
                            </Box>
                            <br />
                            <Box as="span" color="brand.500" fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}>
                                Driveway
                            </Box>
                        </Text>

                        {/* Description */}
                        <Text
                            color={bodyColor}
                            fontSize={{ base: "md", md: "lg" }}
                            lineHeight="tall"
                            mb={8}
                            maxW="520px"
                        >
                            Book trusted, vetted providers for  
                            <Text as="span" color="brand.500" fontWeight="bold"> car washing</Text>,
                             <Text as="span" color="brand.500" fontWeight="bold"> window cleaning</Text>,
                             <Text as="span" color="brand.500" fontWeight="bold"> snow shoveling</Text>, and more right at your
                            doorstep.
                        </Text>

                        {/* Search row */}
                        <Flex
                            direction={{ base: "column", md: "row" }}
                            gap={3}
                            mb={8}
                            bg={searchRowBg}
                            p={2}
                            border="1px solid"
                            borderColor={searchRowBorder}
                            borderRadius="10px"
                            maxW="710px"
                        >
                            <Box flex={{ base: "1 1 100%", md: "0 0 300px" }}>
                                <LocationSearchInput
                                    onLocationSelect={(location) => {
                                        setServiceLocation(location?.address || "");
                                    }}
                                    initialValue={serviceLocation}
                                />
                            </Box>
                            <Select
                                placeholder="Service type"
                                value={serviceType}
                                onChange={(e) =>
                                    setServiceType(
                                        e.target.value as ProviderServiceType
                                    )
                                }
                                bg={inputBg}
                                borderColor={inputBorder}
                                borderRadius="lg"
                                h="12"
                                flex={{ base: "1 1 100%", md: "0 0 200px" }}
                            >
                                {ProviderServiceTypesList.services.map(
                                    (service) => (
                                        <option
                                            key={service.type}
                                            value={service.type}
                                        >
                                            {service.title}
                                        </option>
                                    )
                                )}
                            </Select>
                            <Button
                                onClick={handleSearch}
                                isDisabled={isSearchDisabled}
                                bg="brand.500"
                                color="white"
                                borderRadius="lg"
                                h="12"
                                px={6}
                                fontWeight="semibold"
                                _hover={{ bg: "brand.600" }}
                                _active={{ bg: "brand.700" }}
                                rightIcon={<FiArrowRight />}
                                flex={{ base: "1 1 100%", md: "0 0 auto" }}
                            >
                                Find Services
                            </Button>
                        </Flex>

                        {/* Benefit highlights */}
                        <Flex
                            flexWrap="wrap"
                            gap={{ base: 4, md: 6 }}
                            align="center"
                        >
                            <Flex align="center" gap={2}>
                                <Box color={benefitIconColor}>
                                    <FiCalendar size={18} />
                                </Box>
                                <Text
                                    fontSize="sm"
                                    color={bodyColor}
                                    fontWeight="medium"
                                >
                                    Same-day booking
                                </Text>
                            </Flex>
                            <Flex align="center" gap={2}>
                                <Box color={benefitIconColor}>
                                    <FiCheck size={18} />
                                </Box>
                                <Text
                                    fontSize="sm"
                                    color={bodyColor}
                                    fontWeight="medium"
                                >
                                    Free cancellation
                                </Text>
                            </Flex>
                            <Flex align="center" gap={2}>
                                <Box color={benefitIconColor}>
                                    <FiShield size={18} />
                                </Box>
                                <Text
                                    fontSize="sm"
                                    color={bodyColor}
                                    fontWeight="medium"
                                >
                                    Insured providers
                                </Text>
                            </Flex>
                        </Flex>
                        {/* Hero Section Text */}
                        <VStack align="start" spacing={2} mt={8}>
                            <Text
                                fontSize={{ base: "xl", md: "xl", lg: "2xl" }}
                                fontWeight="bold"
                                color={headlineDark}
                                lineHeight="1.1"
                            >
                                Get your car washed or cleaned right in your driveway.
                            </Text>
                        <Text
                            color={bodyColor}
                            fontSize={{ base: "sm", md: "md" }}
                            lineHeight="tall"
                            mb={8}
                            maxW="520px"
                        >
                            Earn money on your own schedule by offering car wash, backyard, and front yard cleaning
                            services in your neighborhood.
                        </Text>
                        </VStack>
                    </Box>

                    {/* Right Section - Illustration */}
                    <Box
                        flex={{ base: "1 1 100%", lg: "2 1 0%" }}
                        w="full"
                        position="relative"
                        borderRadius="2xl"
                        overflow="hidden"
                        display={{ base: "none", lg: "block" }}
                        minH={{ lg: "480px" }}
                    >
                        {/* <Image
                            src="/images/busy_suburban_service_day.png"
                            alt="Exterior services at your driveway — car wash, home and yard"
                            w="full"
                            h="full"
                            objectFit="cover"
                            objectPosition="center"
                        /> */}
                         <Image
                            src={heroIllustration}
                            alt="Exterior services at your driveway — car wash, home and yard"
                            w="full"
                            h="full"
                            objectFit="cover"
                            objectPosition="center"
                        />
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};
