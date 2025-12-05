import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Spinner,
  Card,
  CardBody,
  Badge,
  Divider,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, Job, ProviderServiceTypesList } from "@suleigolden/sulber-api-client";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaDollarSign, FaInfoCircle } from "react-icons/fa";
import { formatNumberWithCommas } from "~/common/utils/currency-formatter";
import { fullAddress } from "~/common/utils/address";
import { getStatusColor } from "~/common/utils/status-color";

export const WaitingToConnectWithProvider = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setError("Job ID not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const jobData = await api.service("job").get(jobId);
        setJob(jobData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching job:", err);
        setError(err?.response?.data?.message || "Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const selectedService = job?.serviceType
    ? ProviderServiceTypesList.services.find((s) => s.type === job.serviceType)
    : null;

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Not scheduled";
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (date: Date | string | null | undefined) => {
    if (!date) return "Not scheduled";
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid time";
    }
  };

  if (isLoading) {
    return (
      <Box w="full" minH="80vh" display="flex" justifyContent="center" alignItems="center">
        <VStack spacing={6}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.500"
            size="xl"
          />
          <VStack spacing={2}>
            <Heading size="lg" fontWeight="bold" color="gray.700">
              Waiting to connect with provider
            </Heading>
            <Text color="gray.500" fontSize="md">
              Please wait while we find a provider for your service...
            </Text>
          </VStack>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box w="full" minH="80vh" display="flex" justifyContent="center" alignItems="center">
        <VStack spacing={4}>
          <Icon as={FaInfoCircle} boxSize={12} color="red.500" />
          <Heading size="lg" fontWeight="bold" color="red.500">
            Error
          </Heading>
          <Text color="gray.600">{error}</Text>
        </VStack>
      </Box>
    );
  }

  if (!job) {
    return (
      <Box w="full" minH="80vh" display="flex" justifyContent="center" alignItems="center">
        <VStack spacing={4}>
          <Icon as={FaInfoCircle} boxSize={12} color="gray.400" />
          <Heading size="lg" fontWeight="bold" color="gray.600">
            Job not found
          </Heading>
        </VStack>
      </Box>
    );
  }

  return (
    <Box w="full" minH="80vh" py={8}>
      <VStack spacing={6} maxW="800px" mx="auto" px={4}>
        {/* Header with Status */}
        <VStack spacing={4} w="full">
          <HStack spacing={4} w="full" justifyContent="center">
            <Spinner
              thickness="3px"
              speed="0.65s"
              emptyColor="gray.200"
              color="brand.500"
              size="md"
            />
            <Heading size="xl" fontWeight="bold" color="gray.800">
              Waiting to connect with provider
            </Heading>
          </HStack>
          <Badge
            colorScheme={getStatusColor(job.status)}
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
            fontWeight="bold"
            textTransform="uppercase"
          >
            {job.status}
          </Badge>
          <Text color="gray.600" fontSize="md" textAlign="center">
            Your service request has been submitted. We're matching you with a qualified provider.
          </Text>
        </VStack>

        {/* Job Details Card */}
        <Card w="full" bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="lg">
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Service Type */}
              <Box>
                <HStack mb={2}>
                  <Icon as={FaInfoCircle} color="brand.500" />
                  <Text fontSize="lg" fontWeight="bold" color="gray.700">
                    Service Details
                  </Text>
                </HStack>
                <VStack align="start" spacing={2} pl={8}>
                  <HStack>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600" minW="120px">
                      Service Type:
                    </Text>
                    <Text fontSize="sm" color="gray.800" fontWeight="medium">
                      {selectedService?.title || job.serviceType || "Not specified"}
                    </Text>
                  </HStack>
                  {job.notes && (
                    <HStack align="start">
                      <Text fontSize="sm" fontWeight="medium" color="gray.600" minW="120px">
                        Notes:
                      </Text>
                      <Text fontSize="sm" color="gray.800" flex={1}>
                        {job.notes}
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </Box>

              <Divider />

              {/* Location */}
              <Box>
                <HStack mb={2}>
                  <Icon as={FaMapMarkerAlt} color="brand.500" />
                  <Text fontSize="lg" fontWeight="bold" color="gray.700">
                    Location
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.800" pl={8}>
                  {fullAddress(job.address)}
                </Text>
              </Box>

              <Divider />

              {/* Schedule */}
              <Box>
                <HStack mb={2}>
                  <Icon as={FaCalendarAlt} color="brand.500" />
                  <Text fontSize="lg" fontWeight="bold" color="gray.700">
                    Schedule
                  </Text>
                </HStack>
                <VStack align="start" spacing={2} pl={8}>
                  <HStack>
                    <Icon as={FaCalendarAlt} color="gray.400" boxSize={4} />
                    <Text fontSize="sm" color="gray.600" minW="100px">
                      Date:
                    </Text>
                    <Text fontSize="sm" color="gray.800" fontWeight="medium">
                      {formatDate(job.scheduledStart)}
                    </Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaClock} color="gray.400" boxSize={4} />
                    <Text fontSize="sm" color="gray.600" minW="100px">
                      Time:
                    </Text>
                    <Text fontSize="sm" color="gray.800" fontWeight="medium">
                      {formatTime(job.scheduledStart)}
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              <Divider />

              {/* Price */}
              {job.totalPriceCents && (
                <>
                  <Box>
                    <HStack mb={2}>
                      <Icon as={FaDollarSign} color="brand.500" />
                      <Text fontSize="lg" fontWeight="bold" color="gray.700">
                        Price
                      </Text>
                    </HStack>
                    <HStack pl={8}>
                      <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                        ${formatNumberWithCommas(Number(job.totalPriceCents))}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {job.currency || "CAD"}
                      </Text>
                    </HStack>
                  </Box>
                </>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Info Message */}
        <Box
          bg="blue.50"
          borderWidth="1px"
          borderColor="blue.200"
          borderRadius="md"
          p={4}
          w="full"
        >
          <HStack spacing={3}>
            <Icon as={FaInfoCircle} color="blue.500" boxSize={5} />
            <Text fontSize="sm" color="blue.800" flex={1}>
              You'll be notified once a provider accepts your service request. Please keep this page open or check back later.
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};
