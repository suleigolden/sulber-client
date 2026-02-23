import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Box,
    Text,
    Heading,
    VStack,
    List,
    ListItem,
    ListIcon,
    Button,
    useColorModeValue,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import type { ServiceDetail, ServiceDetailSections } from "./service-details-data";
import { getSectionLabel } from "./service-details-data";

type ServiceDetailsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    service: ServiceDetail | null;
    onBookNow: () => void;
};

function renderSectionValue(
    key: string,
    value: string | string[] | { model: string; notes: string[] }
): React.ReactNode {
    if (typeof value === "string") {
        return <Text lineHeight="tall">{value}</Text>;
    }
    if (Array.isArray(value)) {
        return (
            <List spacing={2}>
                {value.map((item, i) => (
                    <ListItem key={i} display="flex" alignItems="flex-start" gap={2}>
                        <ListIcon as={MdCheckCircle} color="brand.500" mt={0.5} />
                        <Text as="span">{item}</Text>
                    </ListItem>
                ))}
            </List>
        );
    }
    if (value && typeof value === "object" && "model" in value && "notes" in value) {
        return (
            <VStack align="stretch" spacing={2}>
                <Text fontWeight="medium" color="gray.600" _dark={{ color: "gray.400" }}>
                    {value.model.replace(/_/g, " ")}
                </Text>
                <List spacing={1}>
                    {value.notes.map((note, i) => (
                        <ListItem key={i} pl={2} borderLeftWidth="2px" borderColor="brand.200">
                            <Text fontSize="sm">{note}</Text>
                        </ListItem>
                    ))}
                </List>
            </VStack>
        );
    }
    return null;
}

export function ServiceDetailsModal({
    isOpen,
    onClose,
    service,
    onBookNow,
}: ServiceDetailsModalProps) {
    const headingColor = useColorModeValue("gray.800", "white");
    const subtextColor = useColorModeValue("gray.600", "gray.300");
    const sectionHeadingColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");

    if (!service) return null;

    const sections = service.sections as ServiceDetailSections;
    const sectionEntries = Object.entries(sections).filter(
        ([_, v]) => v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true)
    );

    const handleBookNow = () => {
        onClose();
        onBookNow();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent maxH="90vh" borderRadius="2xl">
                <ModalHeader pt={8} pb={2}>
                    <Heading size="lg" color={headingColor}>
                        {service.title}
                    </Heading>
                    <Text fontWeight="normal" color={subtextColor} fontSize="md" mt={2}>
                        {service.shortDescription}
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={8}>
                    <VStack align="stretch" spacing={8}>
                        {sectionEntries.map(([key, value]) => (
                            <Box key={key}>
                                <Heading
                                    size="sm"
                                    textTransform="capitalize"
                                    color={sectionHeadingColor}
                                    mb={3}
                                    fontSize="md"
                                >
                                    {getSectionLabel(key)}
                                </Heading>
                                {renderSectionValue(key, value as string | string[] | { model: string; notes: string[] })}
                            </Box>
                        ))}

                        {/* Ready to Book CTA */}
                        <Box
                            pt={6}
                            mt={4}
                            borderTopWidth="1px"
                            borderColor={borderColor}
                        >
                            <Heading size="sm" color={headingColor} mb={2}>
                                Ready to Book?
                            </Heading>
                            <Text color={subtextColor} mb={4} fontSize="sm">
                                Get matched with a verified Sulber provider in minutes.
                            </Text>
                            <Button
                                colorScheme="brand"
                                bg="brand.500"
                                color="white"
                                _hover={{ bg: "brand.600" }}
                                onClick={handleBookNow}
                                size="lg"
                                borderRadius="lg"
                            >
                                Book Now
                            </Button>
                        </Box>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
