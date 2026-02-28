import {
    Box,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    IconButton,
    Flex,
    Spinner,
    useDisclosure,
    Badge,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Icon,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorModeValue,
} from "@chakra-ui/react";
import { FaPlus, FaExclamationTriangle, FaEllipsisV } from "react-icons/fa";
import { useCustomerVehicles } from "~/hooks/use-customer-vehicles";
import { AddVehicle } from "./AddVehicle";
import { useState, useRef } from "react";
import { api, CustomerVehicle, VehicleTypesList } from "@suleigolden/sulber-api-client";
import { CustomToast } from "~/hooks/CustomToast";



export const Vehicles = () => {
    const { vehicles, isLoading, refetch } = useCustomerVehicles();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
    } = useDisclosure();
    const [vehicleToEdit, setVehicleToEdit] = useState<CustomerVehicle | null>(null);
    const [vehicleToDelete, setVehicleToDelete] = useState<CustomerVehicle | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);
    const showToast = CustomToast();

    const handleAddClick = () => {
        setVehicleToEdit(null);
        onOpen();
    };

    const handleEditClick = (vehicle: CustomerVehicle) => {
        setVehicleToEdit(vehicle);
        onOpen();
    };

    const handleDeleteClick = (vehicle: CustomerVehicle) => {
        setVehicleToDelete(vehicle);
        onDeleteOpen();
    };

    const handleConfirmDelete = async () => {
        if (!vehicleToDelete) return;

        setIsDeleting(vehicleToDelete.id);
        try {
            await api.service("customer-vehicle").delete(vehicleToDelete.id);
            showToast("Success", "Vehicle deleted successfully", "success");
            refetch();
            onDeleteClose();
            setVehicleToDelete(null);
        } catch (error: unknown) {
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })?.response
                    ?.data?.message || "Failed to delete vehicle";
            showToast("Error", errorMessage, "error");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleSuccess = () => {
        refetch();
    };

    const formatVehicleLabel = (vehicle: CustomerVehicle) => {
        const parts = [];
        if (vehicle.year) parts.push(vehicle.year);
        if (vehicle.make) parts.push(vehicle.make);
        if (vehicle.model) parts.push(vehicle.model);
        if (vehicle.color) parts.push(vehicle.color);
        return parts.length > 0 ? parts.join(" ") : "Unnamed Vehicle";
    };

    const getVehicleTypeTitle = (vehicleType?: string | null) => {
        if (!vehicleType) return null;
        const vehicleTypeData = VehicleTypesList.find((vt) => vt.type === vehicleType);
        return vehicleTypeData?.title || vehicleType;
    };

    const headingColor = useColorModeValue("gray.800", "white");
    const subtextColor = useColorModeValue("gray.500", "gray.400");
    const emptyStateBg = useColorModeValue("gray.50", "whiteAlpha.200");
    const emptyStateBorder = useColorModeValue("gray.200", "whiteAlpha.300");
    const emptyStateTextColor = useColorModeValue("gray.500", "gray.400");
    const cardBg = useColorModeValue("white", "#0b1437");
    const cardBorder = useColorModeValue("gray.200", "whiteAlpha.300");
    const cardHoverBorder = useColorModeValue("brand.300", "brand.400");
    const vehicleNotesColor = useColorModeValue("gray.600", "gray.400");
    const menuListBg = useColorModeValue("white", "gray.800");
    const alertBodyTextColor = useColorModeValue("gray.600", "gray.300");
    const alertPreviewBg = useColorModeValue("gray.50", "whiteAlpha.200");
    const alertPreviewTextColor = useColorModeValue("gray.800", "white");
    const alertPreviewSubtextColor = useColorModeValue("gray.600", "gray.400");

    return (
        <Box w="full" p={{ base: 4, sm: 6, md: 8 }}>
            <Flex
                direction={{ base: "column", sm: "row" }}
                justify="space-between"
                align={{ base: "start", sm: "center" }}
                mb={6}
                gap={4}
            >
                <Box>
                    <Heading size={{ base: "md", sm: "lg" }} fontWeight="bold" mb={2} color={headingColor}>
                        My Vehicles
                    </Heading>
                    <Text fontSize={{ base: "xs", sm: "sm" }} color={subtextColor}>
                        Manage your vehicles here.
                    </Text>
                </Box>
                <Button
                    leftIcon={<FaPlus />}
                    colorScheme="brand"
                    onClick={handleAddClick}
                    size={{ base: "sm", sm: "md" }}
                    w={{ base: "full", sm: "auto" }}
                >
                    Add Vehicle
                </Button>
            </Flex>

            {isLoading ? (
                <Flex justify="center" align="center" minH="200px">
                    <Spinner size="xl" color="brand.500" />
                </Flex>
            ) : vehicles.length === 0 ? (
                <Box
                    p={8}
                    bg={emptyStateBg}
                    borderRadius="lg"
                    textAlign="center"
                    border="2px dashed"
                    borderColor={emptyStateBorder}
                >
                    <Text fontSize={{ base: "sm", sm: "md" }} color={emptyStateTextColor} mb={4}>
                        No vehicles added yet.
                    </Text>
                    <Button
                        leftIcon={<FaPlus />}
                        colorScheme="brand"
                        onClick={handleAddClick}
                        size={{ base: "sm", sm: "md" }}
                    >
                        Add Your First Vehicle
                    </Button>
                </Box>
            ) : (
                <VStack spacing={4} align="stretch">
                    {vehicles.map((vehicle) => (
                        <Box
                            key={vehicle.id}
                            p={{ base: 4, sm: 6 }}
                            bg={cardBg}
                            borderWidth="1px"
                            borderRadius="lg"
                            borderColor={cardBorder}
                            _hover={{ boxShadow: "md", borderColor: cardHoverBorder }}
                            transition="all 0.2s"
                        >
                            <Flex
                                direction={{ base: "column", sm: "row" }}
                                justify="space-between"
                                align={{ base: "start", sm: "center" }}
                                gap={4}
                            >
                                <Box flex={1}>
                                    <HStack spacing={2} mb={2} flexWrap="wrap">
                                        <Heading size={{ base: "sm", sm: "md" }} fontWeight="semibold" color={headingColor}>
                                            {formatVehicleLabel(vehicle)}
                                        </Heading>
                                        {vehicle.type && (
                                            <Badge
                                                colorScheme="purple"
                                                variant="subtle"
                                                fontSize={{ base: "xs", sm: "sm" }}
                                                px={2}
                                                py={1}
                                                borderRadius="md"
                                            >
                                                {getVehicleTypeTitle(vehicle.type)}
                                            </Badge>
                                        )}
                                        {vehicle.license_plate && (
                                            <Badge
                                                colorScheme="blue"
                                                variant="subtle"
                                                fontSize={{ base: "xs", sm: "sm" }}
                                                px={2}
                                                py={1}
                                                borderRadius="md"
                                            >
                                                {vehicle.license_plate}
                                            </Badge>
                                        )}
                                    </HStack>
                                    {vehicle.notes && (
                                        <Text
                                            fontSize={{ base: "xs", sm: "sm" }}
                                            color={vehicleNotesColor}
                                            mt={2}
                                            noOfLines={2}
                                        >
                                            {vehicle.notes}
                                        </Text>
                                    )}
                                </Box>
                                <HStack spacing={2}>
                                    <Menu
                                        placement="bottom-end"
                                        strategy="fixed"
                                    >
                                        <MenuButton
                                            as={IconButton}
                                            icon={<FaEllipsisV />}
                                            variant="outline"
                                            size="sm"
                                            color="brand"
                                            _hover={{ bg: 'whiteAlpha.200' }}
                                            _active={{ bg: 'whiteAlpha.300' }}
                                            aria-label="Options"
                                        />
                                        <MenuList
                                            bg={menuListBg}
                                            shadow="xl"
                                            borderRadius="lg"
                                            minW="160px"
                                            zIndex={1500}
                                        >
                                            <MenuItem onClick={() => handleEditClick(vehicle)}>Edit</MenuItem>
                                            <MenuItem onClick={() => handleDeleteClick(vehicle)}>Delete</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </HStack>
                            </Flex>
                        </Box>
                    ))}
                </VStack>
            )}

            <AddVehicle
                isOpen={isOpen}
                onClose={() => {
                    onClose();
                    setVehicleToEdit(null);
                }}
                onSuccess={handleSuccess}
                vehicleToEdit={vehicleToEdit}
            />

            {/* Delete Confirmation Modal */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
                isCentered
                motionPreset="slideInBottom"
            >
                <AlertDialogOverlay>
                    <AlertDialogContent mx={{ base: 4, sm: 0 }}>
                        <AlertDialogHeader fontSize={{ base: "lg", sm: "xl" }} fontWeight="bold">
                            <HStack spacing={3}>
                                <Icon as={FaExclamationTriangle} color="red.500" boxSize={5} />
                                <Text>Delete Vehicle</Text>
                            </HStack>
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <VStack align="start" spacing={3}>
                                <Text fontSize={{ base: "sm", sm: "md" }} color={alertBodyTextColor}>
                                    Are you sure you want to delete this vehicle? This action cannot be undone.
                                </Text>
                                {vehicleToDelete && (
                                    <Box
                                        p={3}
                                        bg={alertPreviewBg}
                                        borderRadius="md"
                                        borderLeft="4px solid"
                                        borderColor="red.500"
                                        w="full"
                                    >
                                        <Text fontSize={{ base: "sm", sm: "md" }} fontWeight="semibold" color={alertPreviewTextColor}>
                                            {formatVehicleLabel(vehicleToDelete)}
                                        </Text>
                                        {vehicleToDelete.license_plate && (
                                            <Text fontSize="xs" color={alertPreviewSubtextColor} mt={1}>
                                                License Plate: {vehicleToDelete.license_plate}
                                            </Text>
                                        )}
                                    </Box>
                                )}
                            </VStack>
                        </AlertDialogBody>

                        <AlertDialogFooter gap={3}>
                            <Button
                                ref={cancelRef}
                                onClick={onDeleteClose}
                                variant="outline"
                                size={{ base: "sm", sm: "md" }}
                                flex={{ base: 1, sm: "none" }}
                            >
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleConfirmDelete}
                                isLoading={isDeleting === vehicleToDelete?.id}
                                size={{ base: "sm", sm: "md" }}
                                flex={{ base: 1, sm: "none" }}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};
