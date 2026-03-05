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
} from "@chakra-ui/react";
import {
  CustomerVehicle,
  ProviderServiceType,
  ProviderServiceTypesList,
} from "@suleigolden/sulber-api-client";
import { useCustomerVehicles } from "~/hooks/use-customer-vehicles";
import { useState, useEffect } from "react";
import { CustomToast } from "~/hooks/CustomToast";
import { useSystemColor } from "~/hooks/use-system-color";


type ServiceRequestType = "one-time" | "monthly";

export type ConfirmServiceRequestData = {
  serviceLocation: string;
  serviceLocationData: {
    lat: number;
    lng: number;
    address: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    street?: string;
  } | null;
  serviceDate: string;
  serviceTime: string;
  serviceType: ProviderServiceType | "";
  serviceRequestType: ServiceRequestType;
  selectedVehicleId: string;
};

type ConfirmServiceRequestProps = {
  isOpen: boolean;
  onClose: () => void;
  serviceLocation: string;
  serviceLocationData: ConfirmServiceRequestData["serviceLocationData"];
  serviceDate: string;
  serviceTime: string;
  serviceType: ProviderServiceType | "";
  serviceRequestType: ServiceRequestType;
  onFindProviders: (data: ConfirmServiceRequestData) => void;
};


export const ConfirmServiceRequest = ({
  isOpen,
  onClose,
  serviceLocation,
  serviceLocationData,
  serviceDate,
  serviceTime,
  serviceType,
  serviceRequestType,
  onFindProviders,
}: ConfirmServiceRequestProps) => {
  const { vehicles, isLoading: isLoadingVehicles } = useCustomerVehicles();
  const showToast = CustomToast();
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
    if (vehicle.license_plate) parts.push(`(${vehicle.license_plate})`);
    return parts.length > 0 ? parts.join(" ") : "Unnamed Vehicle";
  };

  const handleFindProviders = () => {
    if (!serviceType) {
      showToast("Error", "Service type is required", "error");
      return;
    }
    if (!serviceLocationData) {
      showToast("Error", "Service location is required", "error");
      return;
    }
    if (!serviceLocationData.city && !serviceLocationData.state && !serviceLocationData.country) {
      showToast("Error", "Please provide a complete address", "error");
      return;
    }
    if (requiresVehicle && !selectedVehicleId) {
      showToast("Error", "Please select a vehicle", "error");
      return;
    }
    onFindProviders({
      serviceLocation,
      serviceLocationData,
      serviceDate,
      serviceTime,
      serviceType,
      serviceRequestType,
      selectedVehicleId,
    });
    onClose();
  };

  const isFindProvidersDisabled = requiresVehicle && !selectedVehicleId;
  const {
    borderColor,
    labelColor,
    textColor,
    mutedTextColor,
    headingColor,
    modalBg,
  } = useSystemColor();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent bg={modalBg}>
        <ModalHeader color={headingColor}>
          <Heading size="md" color={headingColor}>Confirm Service Request</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {/* Service Details */}
            <Box>
              <VStack align="start" spacing={2} pl={2}>
                <HStack>
                  <Text fontSize="sm" fontWeight="medium" color={labelColor} minW="120px">
                    Service Type:
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    {selectedService?.title || serviceType || "Not selected"}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" fontWeight="medium" color={labelColor} minW="120px">
                    Request Type:
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    {serviceRequestType === "one-time" ? "One Time Service" : "Monthly Service (4 times/month)"}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" fontWeight="medium" color={labelColor} minW="120px">
                    Location:
                  </Text>
                  <Text fontSize="sm" color={textColor} flex={1}>
                    {serviceLocation || "Not specified"}
                  </Text>
                </HStack>
              </VStack>
            </Box>
            <Divider />

            {/* Vehicle Selection (only for car-related services) */}
            {requiresVehicle && (
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="bold" color={headingColor}>
                  Select Vehicle
                </FormLabel>
                {isLoadingVehicles ? (
                  <Text fontSize="sm" color={mutedTextColor}>
                    Loading vehicles...
                  </Text>
                ) : vehicles.length === 0 ? (
                  <Box
                    p={4}
                    bg={"transparent"}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Text fontSize="sm" color={textColor}>
                      No vehicles found. Please add a vehicle to your profile first.
                    </Text>
                  </Box>
                ) : (
                  <Select
                    placeholder="Select a vehicle"
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    borderColor={borderColor}
                    _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px brand.500" }}
                  >
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {formatVehicleLabel(vehicle)} - ({vehicle.type})
                      </option>
                    ))}
                  </Select>
                )}
                {selectedVehicle && (
                  <Box mt={2} p={3} bg={"transparent"} borderRadius="md">
                    <Text fontSize="xs" color={textColor}>
                      <Text as="span" fontWeight="medium">Selected:</Text> {formatVehicleLabel(selectedVehicle)}
                      {selectedVehicle.notes && (
                        <>
                          <br />
                          <Text as="span" fontSize="xs" color={mutedTextColor}>
                            Notes: {selectedVehicle.notes}
                          </Text>
                        </>
                      )}
                    </Text>
                  </Box>
                )}
              </FormControl>
            )}

            {/* Action Buttons */}
            <HStack spacing={3} pt={2}>
              <Button variant="outline" onClick={onClose} flex={1}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleFindProviders}
                flex={1}
                isDisabled={isFindProvidersDisabled}
              >
                Find Providers
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};