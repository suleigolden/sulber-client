import {
    Box,
    Text,
    Heading,
    SimpleGrid,
    VStack,
    Flex,
    Button,
    Icon,
    Container,
    useColorModeValue,
} from "@chakra-ui/react";
import { FaCar, FaParking, FaWindowMaximize, FaSnowflake, FaHome } from "react-icons/fa";

type ServiceCard = {
    title: string;
    description: string;
    icon: React.ElementType;
    iconColor: string;
};

const services: ServiceCard[] = [
    {
        title: "Car Washing",
        description: "Professional car washing performed at your home or location. Get your vehicle cleaned on-demand.",
        icon: FaCar,
        iconColor: "blue.500",
    },
    {
        title: "Parking Lot Cleaning",
        description: "On-site vehicle cleaning for residential or commercial parking lots. Convenient and efficient.",
        icon: FaParking,
        iconColor: "green.500",
    },
    {
        title: "Window Cleaning",
        description: "Residential window cleaning for exterior and interior surfaces. Crystal clear results.",
        icon: FaWindowMaximize,
        iconColor: "purple.500",
    },
    {
        title: "Snow Shoveling",
        description: "Snow and ice removal during winter months for safe access and mobility. Seasonal service.",
        icon: FaSnowflake,
        iconColor: "cyan.500",
    },
    {
        title: "Home Services",
        description: "Complete exterior home maintenance services delivered to your driveway. Book multiple services.",
        icon: FaHome,
        iconColor: "orange.500",
    },
];

export const Suggestions = () => {
    const bgColor = useColorModeValue("white", "gray.800");
    const cardBg = useColorModeValue("gray.50", "gray.700");
    const cardBorder = useColorModeValue("gray.200", "gray.600");
    const textColor = useColorModeValue("black", "white");
    const descriptionColor = useColorModeValue("gray.600", "gray.300");
    const buttonHoverBg = useColorModeValue("gray.100", "gray.600");
    const buttonBg = useColorModeValue("white", "gray.600");

    return (
        <Box w="full" bg={bgColor} py={{ base: 8, md: 12 }}>
            <Container maxW="container.xl">
                <VStack align="start" spacing={8} w="full">
                    {/* Heading */}
                    <Heading
                        fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                        fontWeight="bold"
                        color={textColor}
                    >
                        Suggestions
                    </Heading>

                    {/* Service Cards Grid */}
                    <SimpleGrid
                        columns={{ base: 1, sm: 2, md: 3, lg: 3 }}
                        spacing={{ base: 4, md: 6 }}
                        w="full"
                    >
                        {services.map((service, index) => {
                            const IconComponent = service.icon;
                            return (
                                <Box
                                    key={service.title}
                                    bg={cardBg}
                                    borderRadius="lg"
                                    p={{ base: 4, md: 6 }}
                                    boxShadow="sm"
                                    border="1px solid"
                                    borderColor={cardBorder}
                                    transition="all 0.2s"
                                    _hover={{
                                        transform: "translateY(-2px)",
                                        boxShadow: "md",
                                    }}
                                    position="relative"
                                    overflow="hidden"
                                    h="full"
                                    minH={{ base: "140px", md: "160px" }}
                                >
                                    <Flex
                                        direction="row"
                                        align="center"
                                        justify="space-between"
                                        h="full"
                                        gap={{ base: 3, md: 4 }}
                                    >
                                        {/* Left Side - Content */}
                                        <VStack
                                            align="start"
                                            spacing={3}
                                            flex={1}
                                            h="full"
                                            justify="space-between"
                                            py={1}
                                        >
                                            <VStack align="start" spacing={2} flex={1}>
                                                <Heading
                                                    size="md"
                                                    fontWeight="bold"
                                                    color={textColor}
                                                    fontSize={{ base: "lg", md: "xl" }}
                                                >
                                                    {service.title}
                                                </Heading>
                                                <Text
                                                    fontSize={{ base: "xs", md: "sm" }}
                                                    color={descriptionColor}
                                                    lineHeight="1.5"
                                                >
                                                    {service.description}
                                                </Text>
                                            </VStack>

                                            {/* Details Button */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                borderRadius="full"
                                                borderColor={cardBorder}
                                                bg={buttonBg}
                                                color={textColor}
                                                px={5}
                                                fontSize={{ base: "xs", md: "sm" }}
                                                fontWeight="normal"
                                                _hover={{
                                                    bg: buttonHoverBg,
                                                }}
                                            >
                                                Details
                                            </Button>
                                        </VStack>

                                        {/* Right Side - Illustration/Icon */}
                                        <Box
                                            flexShrink={0}
                                            w={{ base: "70px", sm: "90px", md: "110px" }}
                                            h={{ base: "70px", sm: "90px", md: "110px" }}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            position="relative"
                                        >
                                            <Box
                                                w="full"
                                                h="full"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                position="relative"
                                            >
                                                <Icon
                                                    as={IconComponent}
                                                    boxSize={{ base: 8, sm: 10, md: 12 }}
                                                    color={service.iconColor}
                                                    style={{
                                                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Flex>
                                </Box>
                            );
                        })}
                    </SimpleGrid>
                </VStack>
            </Container>
        </Box>
    );
};