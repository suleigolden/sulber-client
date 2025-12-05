import {
  Card,
  CardBody,
  HStack,
  Text,
  Badge,
  Button,
  useColorModeValue,
  Icon,
  Divider,
  VStack,
  Heading,
  Box,
} from "@chakra-ui/react";
import { Job, ProviderServiceTypesList } from "@suleigolden/sulber-api-client";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaCheck } from "react-icons/fa";
import { formatNumberWithCommas } from "~/common/utils/currency-formatter";
import { fullAddress } from "~/common/utils/address";
import { getStatusColor } from "~/common/utils/status-color";
import { formatDateToStringWithoutTime, formatDateToStringWithTime } from "~/common/utils/date-time";

type JobCardProps = {
  job: Job;
  showActions?: boolean;
  onAccept?: (job: Job) => void;
  onUpdateStatus?: (job: Job, status: string) => void;
};

export const JobCard = ({ job, showActions = false, onAccept, onUpdateStatus }: JobCardProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const selectedService = job.serviceType
    ? ProviderServiceTypesList.services.find((s) => s.type === job.serviceType)
    : null;

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.2s"
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Header with Status */}
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={1} flex={1}>
              <HStack>
                <Heading size="md" fontWeight="bold">
                  {selectedService?.title || job.serviceType || "Service Request"}
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
              <Text fontSize="xs" color="gray.700">
                Request ID: {job.id.slice(0, 8)}...
              </Text>
            </VStack>
            {showActions && (
              <VStack spacing={2}>
                {job.status === "PENDING" && !job.providerId && onAccept && (
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
                    colorScheme="green"
                    leftIcon={<Icon as={FaCheck} />}
                    onClick={() => onUpdateStatus(job, "COMPLETED")}
                  >
                    Complete
                  </Button>
                )}
              </VStack>
            )}
          </HStack>

          <Divider />

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
                <Text fontSize="xs" color="gray.700" fontWeight="medium">
                  Location
                </Text>
                <Text fontSize="sm" color="gray.800" fontWeight="medium">
                  {fullAddress(job.address)}
                </Text>
              </VStack>
            </HStack>

            {/* Schedule */}
            <HStack align="start" spacing={3}>
              <Icon as={FaCalendarAlt} color="brand.500" mt={1} />
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color="gray.700" fontWeight="medium">
                  Schedule
                </Text>
                <Text fontSize="sm" color="gray.800" fontWeight="medium">
                  {formatDateToStringWithTime(job?.scheduledStart as string)}
                </Text>
              </VStack>
            </HStack>

            {/* Notes */}
            {job.notes && (
              <HStack align="start" spacing={3}>
                <VStack align="start" spacing={0}>
                  <Text fontSize="xs" color="gray.800" fontWeight="medium">
                    Note
                  </Text>
                  <Text fontSize="sm" color="gray.800" fontWeight="bold">
                    {job.notes}
                  </Text>
                </VStack>
              </HStack>
            )}

            {/* Created Date */}
            <HStack align="start" spacing={3}>
              <Icon as={FaClock} color="brand.500" mt={1} />
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color="gray.700" fontWeight="medium">
                  Created
                </Text>
                <Text fontSize="sm" color="gray.800" fontWeight="medium">
                  {formatDateToStringWithoutTime(job?.createdAt.toLocaleString())}
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Price */}
          {job.totalPriceCents && (
            <HStack align="start" spacing={3}>
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color="gray.900" fontWeight="medium">
                  Price
                </Text>
                <Text fontSize="sm" color="gray.800" fontWeight="bold">
                  ${formatNumberWithCommas(Number(job.totalPriceCents) / 100)}
                </Text>
              </VStack>
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

