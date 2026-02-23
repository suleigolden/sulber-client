import {
    Box,
    Text,
    Heading,
    SimpleGrid,
    VStack,
    Flex,
    Icon,
    Container,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar, FaParking, FaWindowMaximize, FaSnowflake, FaHome } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { ServiceDetailsModal } from "./ServiceDetailsModal";
import { getServiceDetailByType } from "./service-details-data";

type ServiceCard = {
    serviceType: string;
    title: string;
    description: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
};

const services: ServiceCard[] = [
    {
        serviceType: "DRIVEWAY_CAR_WASH",
        title: "Car Washing",
        description: "Professional car washing at your home or location. Get your vehicle cleaned on-demand.",
        icon: FaCar,
        iconBg: "brand.50",
        iconColor: "brand.500",
    },
    {
        serviceType: "PARKING_LOT_CLEANING",
        title: "Parking Lot Cleaning",
        description: "On-site vehicle cleaning for residential or commercial parking lots. Convenient and efficient.",
        icon: FaParking,
        iconBg: "green.50",
        iconColor: "green.600",
    },
    {
        serviceType: "HOUSE_WINDOW_CLEANING",
        title: "Window Cleaning",
        description: "Residential window cleaning for exterior and interior surfaces. Crystal clear results.",
        icon: FaWindowMaximize,
        iconBg: "purple.50",
        iconColor: "purple.600",
    },
    {
        serviceType: "SNOW_SHOVELING",
        title: "Snow Shoveling",
        description: "Snow and ice removal during winter months for safe access and mobility.",
        icon: FaSnowflake,
        iconBg: "cyan.50",
        iconColor: "cyan.600",
    },
    {
        serviceType: "HOME_SERVICES",
        title: "Home Services",
        description: "Complete exterior home maintenance delivered to your driveway. Book multiple services.",
        icon: FaHome,
        iconBg: "orange.50",
        iconColor: "orange.600",
    },
];

export const Suggestions = () => {
    const navigate = useNavigate();
    const { colorMode } = useColorMode();
    const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const bgColor = useColorModeValue("white", "darkBg");
    const cardBg = useColorModeValue("white", "whiteAlpha.100");
    const cardBorder = useColorModeValue("gray.100", "whiteAlpha.200");
    const textColor = useColorModeValue("gray.800", "white");
    const descriptionColor = useColorModeValue("gray.600", "gray.300");
    const linkColor = useColorModeValue("brand.500", "brand.300");
    const shadowColor = useColorModeValue(
        "0 4px 24px -4px rgba(0,0,0,0.08), 0 2px 8px -2px rgba(0,0,0,0.04)",
        "0 4px 24px -4px rgba(0,0,0,0.2)"
    );
    const hoverShadow = useColorModeValue(
        "0 12px 40px -8px rgba(36, 168, 157, 0.15), 0 4px 12px -2px rgba(0,0,0,0.06)",
        "0 12px 40px -8px rgba(0,0,0,0.35)"
    );
    const eyebrowColor = useColorModeValue("brand.500", "brand.300");
    const cardHoverBorder = useColorModeValue("brand.100", "whiteAlpha.300");

    const selectedService = selectedServiceType ? getServiceDetailByType(selectedServiceType) : null;

    const openModal = (serviceType: string) => {
        setSelectedServiceType(serviceType);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedServiceType(null);
    };

    const handleBookNow = () => {
        navigate("/#hero");
    };

    return (
        <Box w="full" bg={bgColor} py={{ base: 16, md: 24 }}>
            <Container maxW="1600px" px={{ base: 4, md: 8 }}>
                <VStack align="start" spacing={4} w="full" mb={{ base: 10, md: 14 }}>
                    <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color={eyebrowColor}
                        letterSpacing="wider"
                        textTransform="uppercase"
                    >
                         Services
                    </Text>
                    <Heading
                        fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                        fontWeight="bold"
                        color={textColor}
                        letterSpacing="tight"
                        lineHeight="1.2"
                    >
                        Suggestions
                    </Heading>
                </VStack>

                <SimpleGrid
                    columns={{ base: 1, sm: 2, lg: 3 }}
                    spacing={{ base: 5, md: 6 }}
                    w="full"
                >
                    {services.map((service) => {
                        const IconComponent = service.icon;
                        return (
                            <Box
                                key={service.title}
                                as="article"
                                bg={cardBg}
                                borderRadius="2xl"
                                p={{ base: 6, md: 8 }}
                                borderWidth="1px"
                                borderColor={cardBorder}
                                boxShadow={shadowColor}
                                transition="all 0.25s ease"
                                _hover={{
                                    transform: "translateY(-4px)",
                                    boxShadow: hoverShadow,
                                    borderColor: cardHoverBorder,
                                }}
                                position="relative"
                                overflow="hidden"
                                h="full"
                                display="flex"
                                flexDirection="column"
                            >
                                <Flex
                                    direction="column"
                                    align="start"
                                    flex={1}
                                    gap={5}
                                >
                                    <Box
                                        w="14"
                                        h="14"
                                        borderRadius="2xl"
                                        bg={colorMode === "dark" ? "whiteAlpha.200" : service.iconBg}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexShrink={0}
                                    >
                                        <Icon
                                            as={IconComponent}
                                            boxSize={7}
                                            color={service.iconColor}
                                        />
                                    </Box>
                                    <VStack align="start" spacing={2} flex={1}>
                                        <Heading
                                            size="md"
                                            fontWeight="bold"
                                            color={textColor}
                                            fontSize={{ base: "xl", md: "2xl" }}
                                            letterSpacing="tight"
                                        >
                                            {service.title}
                                        </Heading>
                                        <Text
                                            fontSize="sm"
                                            color={descriptionColor}
                                            lineHeight="1.6"
                                        >
                                            {service.description}
                                        </Text>
                                    </VStack>
                                    <Box
                                        as="button"
                                        type="button"
                                        fontSize="sm"
                                        fontWeight="semibold"
                                        color={linkColor}
                                        _hover={{ color: "brand.600" }}
                                        display="inline-flex"
                                        alignItems="center"
                                        gap={2}
                                        onClick={() => openModal(service.serviceType)}
                                        cursor="pointer"
                                        bg="transparent"
                                        border="none"
                                        p={0}
                                    >
                                        Learn more
                                        <Icon as={FiArrowRight} boxSize={4} />
                                    </Box>
                                </Flex>
                            </Box>
                        );
                    })}
                </SimpleGrid>
            </Container>

            <ServiceDetailsModal
                isOpen={isModalOpen}
                onClose={closeModal}
                service={selectedService ?? null}
                onBookNow={handleBookNow}
            />
        </Box>
    );
};
