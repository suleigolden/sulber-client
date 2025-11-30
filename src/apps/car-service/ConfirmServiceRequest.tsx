import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Select,
  FormControl,
  FormLabel,
  Button,
  Badge,
  Flex,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { ProviderServiceType, ProviderServiceTypesList } from "@suleigolden/sulber-api-client";
import { useCustomerVehicles } from "~/hooks/use-customer-vehicles";
import { useState, useEffect } from "react";

// Type definition for CustomerVehicle (until API client is rebuilt)
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

type ServiceRequestType = "one-time" | "monthly";

type ConfirmServiceRequestProps = {
  isOpen: boolean;
  onClose: () => void;
  serviceLocation: string;
  serviceDate: string;
  serviceTime: string;
  serviceType: ProviderServiceType | "";
  serviceRequestType: ServiceRequestType;
};


export const ConfirmServiceRequest = ({
  isOpen,
  onClose,
  serviceLocation,
  serviceDate,
  serviceTime,
  serviceType,
  serviceRequestType,
}: ConfirmServiceRequestProps) => {
  const { vehicles, isLoading: isLoadingVehicles } = useCustomerVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const requiresVehicle = Boolean(serviceType && serviceType.includes("CAR"));

  // Reset vehicle selection when modal closes or service type changes
  useEffect(() => {
    if (!isOpen || !requiresVehicle) {
      setSelectedVehicleId("");
    }
  }, [isOpen, requiresVehicle]);

  const selectedService = ProviderServiceTypesList.services.find(
    (s) => s.type === serviceType
  );

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  const formatVehicleLabel = (vehicle: CustomerVehicle) => {
    const parts = [];
    if (vehicle.year) parts.push(vehicle.year);
    if (vehicle.make) parts.push(vehicle.make);
    if (vehicle.model) parts.push(vehicle.model);
    if (vehicle.color) parts.push(vehicle.color);
    if (vehicle.licensePlate) parts.push(`(${vehicle.licensePlate})`);
    return parts.length > 0 ? parts.join(" ") : "Unnamed Vehicle";
  };

  const handleConfirm = () => {
    // TODO: Implement confirmation logic
    console.log({
      serviceLocation,
      serviceDate,
      serviceTime,
      serviceType,
      serviceRequestType,
      vehicleId: requiresVehicle ? selectedVehicleId : undefined,
    });
    onClose();
  };

  const isConfirmDisabled = requiresVehicle && !selectedVehicleId;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">Confirm Service Request</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {/* Service Details */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
                Service Details
              </Text>
              <VStack align="start" spacing={2} pl={2}>
                <HStack>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600" minW="120px">
                    Service Type:
                  </Text>
                  <Text fontSize="sm" color="gray.800">
                    {selectedService?.title || serviceType || "Not selected"}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600" minW="120px">
                    Request Type:
                  </Text>
                  <Text fontSize="sm" color="gray.800">
                    {serviceRequestType === "one-time" ? "One Time Service" : "Monthly Service (4 times/month)"}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600" minW="120px">
                    Location:
                  </Text>
                  <Text fontSize="sm" color="gray.800" flex={1}>
                    {serviceLocation || "Not specified"}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600" minW="120px">
                    Date & Time:
                  </Text>
                  <Text fontSize="sm" color="gray.800">
                    {serviceDate && serviceTime
                      ? `${new Date(serviceDate).toLocaleDateString()} at ${serviceTime}`
                      : "Not specified"}
                  </Text>
                </HStack>
              </VStack>
            </Box>
            <Divider />

            {/* Service Included Items */}
            {selectedService?.included && selectedService.included.length > 0 && (
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                  What's Included
                </Text>
                <Wrap spacing={2}>
                  {selectedService.included.map((item, index) => (
                    <WrapItem key={index}>
                      <Badge
                        colorScheme="brand"
                        variant="outline"
                        px={3}
                        py={1.5}
                        borderRadius="lg"
                        fontSize="xs"
                        fontWeight="medium"
                        textTransform="none"
                      >
                        {item}
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            )}

            {/* Service Requirements */}
            {selectedService?.requirements_for_customer && selectedService.requirements_for_customer.length > 0 && (
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                  Requirements
                </Text>
                <Wrap spacing={2}>
                  {selectedService.requirements_for_customer.map((requirement, index) => (
                    <WrapItem key={index}>
                      <Badge
                        colorScheme="brand"
                        variant="outline"
                        px={3}
                        py={1.5}
                        borderRadius="lg"
                        fontSize="xs"
                        fontWeight="medium"
                        textTransform="none"
                      >
                        {requirement}
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            )}

            <Divider />

            {/* Vehicle Selection (only for car-related services) */}
            {requiresVehicle && (
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">
                  Select Vehicle
                </FormLabel>
                {isLoadingVehicles ? (
                  <Text fontSize="sm" color="gray.500">
                    Loading vehicles...
                  </Text>
                ) : vehicles.length === 0 ? (
                  <Box
                    p={4}
                    bg="yellow.50"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="yellow.200"
                  >
                    <Text fontSize="sm" color="yellow.800">
                      No vehicles found. Please add a vehicle to your profile first.
                    </Text>
                  </Box>
                ) : (
                  <Select
                    placeholder="Select a vehicle"
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    borderColor="gray.300"
                    _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px brand.500" }}
                  >
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {formatVehicleLabel(vehicle)}
                      </option>
                    ))}
                  </Select>
                )}
                {selectedVehicle && (
                  <Box mt={2} p={3} bg="gray.50" borderRadius="md">
                    <Text fontSize="xs" color="gray.600">
                      <Text as="span" fontWeight="medium">Selected:</Text> {formatVehicleLabel(selectedVehicle)}
                      {selectedVehicle.notes && (
                        <>
                          <br />
                          <Text as="span" fontSize="xs" color="gray.500">
                            Notes: {selectedVehicle.notes}
                          </Text>
                        </>
                      )}
                    </Text>
                  </Box>
                )}
              </FormControl>
            )}

              {/* Service Price */}
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                  Price: $100.00
                </Text>
              </Box>

            {/* Action Buttons */}
            <HStack spacing={3} pt={2}>
              <Button variant="outline" onClick={onClose} flex={1}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleConfirm}
                flex={1}
                isDisabled={isConfirmDisabled}
              >
                Confirm Request
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};