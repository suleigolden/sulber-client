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
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { api, 
    CustomerVehicle, 
    ProviderServiceType, 
    ProviderServiceTypesList,
   } from "@suleigolden/sulber-api-client";
import { useCustomerVehicles } from "~/hooks/use-customer-vehicles";
import { useUser } from "~/hooks/use-user";
import { useState, useEffect } from "react";
import { CustomToast } from "~/hooks/CustomToast";
import { formatNumberWithCommas } from "~/common/utils/currency-formatter";
import { useNavigate } from "react-router-dom";


type ServiceRequestType = "one-time" | "monthly";

type ConfirmServiceRequestProps = {
  isOpen: boolean;
  onClose: () => void;
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
}: ConfirmServiceRequestProps) => {
  const { vehicles, isLoading: isLoadingVehicles } = useCustomerVehicles();
  const { user } = useUser();
  const navigate = useNavigate();
  const showToast = CustomToast();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

  const handleConfirm = async () => {
    if (!user?.id) {
      showToast("Error", "User not authenticated", "error");
      return;
    }

    if (!serviceType) {
      showToast("Error", "Service type is required", "error");
      return;
    }

    if (!serviceLocationData) {
      showToast("Error", "Service location is required", "error");
      return;
    }

    // Validate address fields
    if (!serviceLocationData.city && !serviceLocationData.state && !serviceLocationData.country) {
      showToast("Error", "Please provide a complete address", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse address from location data
      const address = {
        street: serviceLocationData.street || serviceLocationData.address || "",
        city: serviceLocationData.city || "",
        state: serviceLocationData.state || "",
        country: serviceLocationData.country || "",
        postal_code: serviceLocationData.postalCode || "",
      };

      // Combine date and time for scheduledStart
      let scheduledStart: string | undefined;
      let scheduledEnd: string | undefined;

      if (serviceDate && serviceTime) {
        const startDateTime = new Date(`${serviceDate}T${serviceTime}`);
        scheduledStart = startDateTime.toISOString();
        
        // Set end time to 2 hours after start (default duration)
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(endDateTime.getHours() + 2);
        scheduledEnd = endDateTime.toISOString();
      }

      // Calculate price in cents (as string to match API)
      const selectedService = ProviderServiceTypesList.services.find(
        (s) => s.type === serviceType
      );
      const price = formatNumberWithCommas(selectedService?.price || 0);

      // Build notes
      const notesParts: string[] = [];
      if (serviceRequestType === "monthly") {
        notesParts.push("Monthly subscription service (4 times per month)");
      }
      if (requiresVehicle && selectedVehicleId) {
        const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
        if (vehicle) {
          notesParts.push(`Vehicle: ${formatVehicleLabel(vehicle)}`);
        }
      }

      // Create job
      const jobData = {
        customer_id: user.id,
        serviceType: serviceType as ProviderServiceType,
        address,
        scheduledStart,
        scheduledEnd,
        totalprice: price,
        currency: "CAD",
        notes: notesParts.length > 0 ? notesParts.join(". ") : undefined,
      };

      // Create job using the API client
      const job = await api.service('job').create(jobData);
      if (!job) {
        throw new Error("Failed to create job");
      }

      showToast("Success", "Service request created successfully!", "success");
      onClose();
      
      // Redirect to waiting page with job ID
      if (user?.id && user?.role) {
        navigate(`/${user.role}/${user.id}/waiting-to-connect-with-provider?jobId=${job.id}`);
      }
    } catch (error: any) {
      console.error("Error creating job:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create service request. Please try again.";
      showToast("Error", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isConfirmDisabled = requiresVehicle && !selectedVehicleId;

  const modalBg = useColorModeValue("white", "#0b1437");
  const headerColor = useColorModeValue(undefined, "white");
  const labelColor = useColorModeValue("gray.600", "gray.300");
  const valueColor = useColorModeValue("gray.800", "white");
  const sectionTitleColor = useColorModeValue("gray.700", "gray.200");
  const selectBorderColor = useColorModeValue("gray.300", "whiteAlpha.300");
  const noVehicleBg = useColorModeValue("yellow.50", "whiteAlpha.200");
  const noVehicleBorder = useColorModeValue("yellow.200", "yellow.700");
  const noVehicleTextColor = useColorModeValue("yellow.800", "yellow.200");
  const selectedVehicleBg = useColorModeValue("gray.50", "whiteAlpha.200");
  const selectedVehicleTextColor = useColorModeValue("gray.600", "gray.300");
  const selectedVehicleNotesColor = useColorModeValue("gray.500", "gray.400");
  const loadingTextColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent bg={modalBg}>
        <ModalHeader color={headerColor}>
          <Heading size="md" color={headerColor}>Confirm Service Request</Heading>
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
                  <Text fontSize="sm" color={valueColor}>
                    {selectedService?.title || serviceType || "Not selected"}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" fontWeight="medium" color={labelColor} minW="120px">
                    Request Type:
                  </Text>
                  <Text fontSize="sm" color={valueColor}>
                    {serviceRequestType === "one-time" ? "One Time Service" : "Monthly Service (4 times/month)"}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" fontWeight="medium" color={labelColor} minW="120px">
                    Location:
                  </Text>
                  <Text fontSize="sm" color={valueColor} flex={1}>
                    {serviceLocation || "Not specified"}
                  </Text>
                </HStack>
              </VStack>
            </Box>
            <Divider />

            {/* Service Included Items */}
            {selectedService?.included && selectedService.included.length > 0 && (
              <Box>
                <Text fontSize="sm" fontWeight="bold" color={sectionTitleColor} mb={3}>
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
                <Text fontSize="sm" fontWeight="bold" color={sectionTitleColor} mb={3}>
                  Customer Requirements
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
                <FormLabel fontSize="sm" fontWeight="bold" color={sectionTitleColor}>
                  Select Vehicle
                </FormLabel>
                {isLoadingVehicles ? (
                  <Text fontSize="sm" color={loadingTextColor}>
                    Loading vehicles...
                  </Text>
                ) : vehicles.length === 0 ? (
                  <Box
                    p={4}
                    bg={noVehicleBg}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={noVehicleBorder}
                  >
                    <Text fontSize="sm" color={noVehicleTextColor}>
                      No vehicles found. Please add a vehicle to your profile first.
                    </Text>
                  </Box>
                ) : (
                  <Select
                    placeholder="Select a vehicle"
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    borderColor={selectBorderColor}
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
                  <Box mt={2} p={3} bg={selectedVehicleBg} borderRadius="md">
                    <Text fontSize="xs" color={selectedVehicleTextColor}>
                      <Text as="span" fontWeight="medium">Selected:</Text> {formatVehicleLabel(selectedVehicle)}
                      {selectedVehicle.notes && (
                        <>
                          <br />
                          <Text as="span" fontSize="xs" color={selectedVehicleNotesColor}>
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
                <Text fontSize="sm" fontWeight="bold" color={sectionTitleColor} mb={3}>
                  Price: ${selectedService?.price || 0}
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
                isDisabled={isConfirmDisabled || isSubmitting}
                isLoading={isSubmitting}
                loadingText="Creating..."
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