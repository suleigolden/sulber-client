import {
  Card,
  CardBody,
  HStack,
  Text,
  Badge,
  Button,
  Icon,
  Divider,
  VStack,
  Heading,
  Box,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { Job, ProviderServiceTypesList, api } from "@suleigolden/sulber-api-client";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaCheck } from "react-icons/fa";
import { formatNumberWithCommas } from "~/common/utils/currency-formatter";
import { fullAddress } from "~/common/utils/address";
import { getStatusColor } from "~/common/utils/status-color";
import { formatDateToStringWithoutTime, formatDateToStringWithTime } from "~/common/utils/date-time";
import { useState, useEffect } from "react";
import { UserProfile } from "@suleigolden/sulber-api-client";
import { CustomerRequestInfoModal } from "./CustomerRequestInfoModal";
import { useSystemColor } from "~/hooks/use-system-color";

const ADDON_LABELS: Record<string, string> = {
  interior_deep_cleaning: "Interior deep cleaning",
  wax_polish: "Wax polish",
  engine_bay_cleaning: "Engine bay cleaning",
  odor_removal: "Odor removal",
  multiple_vehicles_discount: "Multiple vehicles discount",
};

type JobCardProps = {
  job: Job;
  showActions?: boolean;
  onAccept?: (job: Job) => void;
  onUpdateStatus?: (job: Job, status: string) => void;
};

export const JobCard = ({ job, showActions = false, onAccept, onUpdateStatus }: JobCardProps) => {
  const {
    borderColor,
    labelColor,
    textColor,
    mutedTextColor,
    headingColor,
    dividerColor,
  } = useSystemColor();
  const [customerProfile, setCustomerProfile] = useState<UserProfile | null>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selectedService = job.service_type
    ? ProviderServiceTypesList.services.find((s) => s.type === job.service_type)
    : null;

  const addOns =
    Array.isArray(job.add_on_prices) && job.add_on_prices.length > 0
      ? job.add_on_prices.flatMap((entry) =>
          Object.entries(entry).map(([key, value]) => ({
            id: key,
            label: ADDON_LABELS[key] ?? key,
            priceCents: value?.price ?? 0,
          }))
        )
      : [];

  // Fetch customer profile information
  useEffect(() => {
    const fetchCustomerProfile = async () => {
      if (!job.customer_id) return;
      
      setIsLoadingCustomer(true);
      try {
        const profile = await api.service("user-profile").get(job.customer_id);
        setCustomerProfile(profile);
      } catch (error) {
        console.error("Failed to fetch customer profile:", error);
      } finally {
        setIsLoadingCustomer(false);
      }
    };

    fetchCustomerProfile();
  }, [job.customer_id]);

  if (isLoadingCustomer) {
    return (
      <Box>
        <Spinner />
      </Box>
    );
  }

  return (
    <Card
      bg={"transparent"}
      borderWidth="1px"
      borderColor={borderColor}
      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.2s"
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Header with Status */}
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={1} flex={1}>
              <HStack>
                <Heading size="md" fontWeight="bold" color={headingColor}>
                  {selectedService?.title || job.service_type || "Service Request"}
                  {customerProfile && (
                    <Text
                      fontSize="sm"
                      as="span"
                      fontWeight="bold"
                      color="brand.500"
                      cursor="pointer"
                      _hover={{ color: "brand.600", textDecoration: "underline" }}
                      onClick={onOpen}
                      ml={2}
                    >
                      For: {customerProfile.first_name} {customerProfile.last_name}
                    </Text>
                  )}
                </Heading>
                <Badge
                  colorScheme={getStatusColor(job.status)}
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  {job.status.replace("_", " ")}
                </Badge>
              </HStack>
              <Text fontSize="xs" color={mutedTextColor}>
                Request ID: {job.id.slice(0, 8)}...
              </Text>
            </VStack>
            {showActions && (
              <VStack spacing={2}>
                {job.status === "PENDING" && !job.provider_id && onAccept && (
                  <Button
                    size="sm"
                    colorScheme="brand"
                    leftIcon={<Icon as={FaCheck} />}
                    onClick={() => onAccept(job)}
                  >
                    Accept
                  </Button>
                )}
                {job.status === "ACCEPTED" && onUpdateStatus && (
                  <Button
                    size="sm"
                    colorScheme="purple"
                    variant="outline"
                    onClick={() => onUpdateStatus(job, "IN_PROGRESS")}
                  >
                    Start Service
                  </Button>
                )}
                {job.status === "IN_PROGRESS" && onUpdateStatus && (
                  <Button
                    size="sm"
                    colorScheme="brand"
                    leftIcon={<Icon as={FaCheck} />}
                    onClick={() => onUpdateStatus(job, "COMPLETED")}
                  >
                    Mark as Complete
                  </Button>
                )}
              </VStack>
            )}
            
          </HStack>

          <Divider borderColor={dividerColor} />

          {/* Details Grid */}
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={4}
          >
            {/* Location */}
            <HStack align="start" spacing={3}>
              <Icon as={FaMapMarkerAlt} color="brand.500" mt={1} />
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color={labelColor} fontWeight="medium">
                  Location
                </Text>
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                  {fullAddress(job.address)}
                </Text>
              </VStack>
            </HStack>

            {/* Schedule */}
            <HStack align="start" spacing={3}>
              <Icon as={FaCalendarAlt} color="brand.500" mt={1} />
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color={labelColor} fontWeight="medium">
                  Schedule
                </Text>
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                  {formatDateToStringWithTime(job?.scheduled_start as string)}
                </Text>
              </VStack>
            </HStack>

            {/* Add-ons */}
            {addOns.length > 0 && (
              <HStack align="start" spacing={3}>
                <VStack align="start" spacing={1}>
                  <Text fontSize="xs" color={labelColor} fontWeight="medium">
                    Add-ons
                  </Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {addOns.map((addon) => (
                      <Badge
                        key={addon.id}
                        colorScheme="purple"
                        variant="subtle"
                        fontSize="xs"
                        px={2}
                        py={0.5}
                        borderRadius="md"
                      >
                        {addon.label}
                      </Badge>
                    ))}
                  </HStack>
                </VStack>
              </HStack>
            )}

            {/* Notes */}
            {job.notes && (
              <HStack align="start" spacing={3}>
                <VStack align="start" spacing={0}>
                  <Text fontSize="xs" color={labelColor} fontWeight="medium">
                    Note
                  </Text>
                  <Text fontSize="sm" color={textColor} fontWeight="bold">
                    {job.notes}
                  </Text>
                </VStack>
              </HStack>
            )}

            {/* Created Date */}
            <HStack align="start" spacing={3}>
              <Icon as={FaClock} color="brand.500" mt={1} />
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color={labelColor} fontWeight="medium">
                  Created
                </Text>
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                  {formatDateToStringWithoutTime(job?.created_at.toLocaleString())}
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Price */}
          {job.total_price_cents && (
            <HStack align="start" spacing={3}>
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color={labelColor} fontWeight="medium">
                  Price
                </Text>
                <Text fontSize="sm" color="brand.600" fontWeight="bold">
                  ${formatNumberWithCommas(Number(job.total_price_cents) / 100)}
                </Text>
              </VStack>
            </HStack>
          )}
           
        </VStack>
      </CardBody>

      {/* Customer Request Information Modal */}
      <CustomerRequestInfoModal
        isOpen={isOpen}
        onClose={onClose}
        customerProfile={customerProfile}
        job={job}
      />
    </Card>
  );
};

