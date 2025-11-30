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
} from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useCustomerVehicles } from "~/hooks/use-customer-vehicles";
import { AddVehicle } from "./AddVehicle";
import { useState } from "react";
import { api } from "@suleigolden/sulber-api-client";
import { CustomToast } from "~/hooks/CustomToast";

// Type definition for CustomerVehicle
type CustomerVehicle = {
  id: string;
  userId: string;
  make?: string | null;
  model?: string | null;
  year?: number | null;
  color?: string | null;
  licensePlate?: string | null;
  notes?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const Vehicles = () => {
  const { vehicles, isLoading, refetch } = useCustomerVehicles();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [vehicleToEdit, setVehicleToEdit] = useState<CustomerVehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const showToast = CustomToast();

  const handleAddClick = () => {
    setVehicleToEdit(null);
    onOpen();
  };

  const handleEditClick = (vehicle: CustomerVehicle) => {
    setVehicleToEdit(vehicle);
    onOpen();
  };

  const handleDeleteClick = async (vehicleId: string) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    setIsDeleting(vehicleId);
    try {
      await api.service("customer-vehicle").delete(vehicleId);
      showToast("Success", "Vehicle deleted successfully", "success");
      refetch();
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
          <Heading size={{ base: "md", sm: "lg" }} fontWeight="bold" mb={2}>
            My Vehicles
          </Heading>
          <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500">
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
          bg="gray.50"
          borderRadius="lg"
          textAlign="center"
          border="2px dashed"
          borderColor="gray.200"
        >
          <Text fontSize={{ base: "sm", sm: "md" }} color="gray.500" mb={4}>
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
              bg="white"
              borderWidth="1px"
              borderRadius="lg"
              borderColor="gray.200"
              _hover={{ boxShadow: "md", borderColor: "brand.300" }}
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
                    <Heading size={{ base: "sm", sm: "md" }} fontWeight="semibold">
                      {formatVehicleLabel(vehicle)}
                    </Heading>
                    {vehicle.licensePlate && (
                      <Badge
                        colorScheme="blue"
                        variant="subtle"
                        fontSize={{ base: "xs", sm: "sm" }}
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {vehicle.licensePlate}
                      </Badge>
                    )}
                  </HStack>
                  {vehicle.notes && (
                    <Text
                      fontSize={{ base: "xs", sm: "sm" }}
                      color="gray.600"
                      mt={2}
                      noOfLines={2}
                    >
                      {vehicle.notes}
                    </Text>
                  )}
                </Box>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Edit vehicle"
                    icon={<FaEdit />}
                    size={{ base: "sm", sm: "md" }}
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => handleEditClick(vehicle)}
                  />
                  <IconButton
                    aria-label="Delete vehicle"
                    icon={<FaTrash />}
                    size={{ base: "sm", sm: "md" }}
                    colorScheme="red"
                    variant="outline"
                    onClick={() => handleDeleteClick(vehicle.id)}
                    isLoading={isDeleting === vehicle.id}
                  />
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
    </Box>
  );
};
