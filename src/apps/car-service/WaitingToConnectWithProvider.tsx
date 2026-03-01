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
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaInfoCircle } from "react-icons/fa";
import { formatNumberWithCommasAndDecimals } from "~/common/utils/currency-formatter";
import { fullAddress } from "~/common/utils/address";
import { getStatusColor } from "~/common/utils/status-color";
import { formatDateToStringWithTime } from "~/common/utils/date-time";

export const WaitingToConnectWithProvider = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardBg = useColorModeValue("white", "#0b1437");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.300");
  const headingColor = useColorModeValue("gray.700", "white");
  const subHeadingColor = useColorModeValue("gray.800", "white");
  const bodyColor = useColorModeValue("gray.600", "gray.300");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const valueColor = useColorModeValue("gray.800", "white");
  const iconMutedColor = useColorModeValue("gray.400", "gray.500");
  const errorTextColor = useColorModeValue("gray.600", "gray.400");
  const infoBoxBg = useColorModeValue("blue.50", "whiteAlpha.200");
  const infoBoxBorder = useColorModeValue("blue.200", "blue.700");
  const infoBoxTextColor = useColorModeValue("blue.800", "blue.200");

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

  const selectedService = job?.service_type
    ? ProviderServiceTypesList.services.find((s) => s.type === job.service_type)
    : null;

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
            <Heading size="lg" fontWeight="bold" color={headingColor}>
              Waiting to connect with provider
            </Heading>
            <Text color={bodyColor} fontSize="md">
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
          <Text color={errorTextColor}>{error}</Text>
        </VStack>
      </Box>
    );
  }

  if (!job) {
    return (
      <Box w="full" minH="80vh" display="flex" justifyContent="center" alignItems="center">
        <VStack spacing={4}>
          <Icon as={FaInfoCircle} boxSize={12} color="gray.400" />
          <Heading size="lg" fontWeight="bold" color={headingColor}>
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
            <Heading size="xl" fontWeight="bold" color={subHeadingColor}>
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
          <Text color={bodyColor} fontSize="md" textAlign="center">
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
                  <Text fontSize="lg" fontWeight="bold" color={headingColor}>
                    Service Details
                  </Text>
                </HStack>
                <VStack align="start" spacing={2} pl={8}>
                  <HStack>
                    <Text fontSize="sm" fontWeight="medium" color={labelColor} minW="120px">
                      Service Type:
                    </Text>
                    <Text fontSize="sm" color={valueColor} fontWeight="medium">
                      {selectedService?.title || job.service_type || "Not specified"}
                    </Text>
                  </HStack>
                  {job.notes && (
                    <HStack align="start">
                      <Text fontSize="sm" fontWeight="medium" color={labelColor} minW="120px">
                        Notes:
                      </Text>
                      <Text fontSize="sm" color={valueColor} flex={1}>
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
                  <Text fontSize="lg" fontWeight="bold" color={headingColor}>
                    Location
                  </Text>
                </HStack>
                <Text fontSize="sm" color={valueColor} pl={8}>
                  {fullAddress(job.address)}
                </Text>
              </Box>

              <Divider />

              {/* Schedule */}
              <Box>
                <HStack mb={2}>
                  <Icon as={FaCalendarAlt} color="brand.500" />
                  <Text fontSize="lg" fontWeight="bold" color={headingColor}>
                    Schedule
                  </Text>
                </HStack>
                <VStack align="start" spacing={2} pl={8}>
                  <HStack>
                    <Icon as={FaCalendarAlt} color={iconMutedColor} boxSize={4} />
                    <Text fontSize="sm" color={labelColor} minW="100px">
                      Date:
                    </Text>
                    <Text fontSize="sm" color={valueColor} fontWeight="medium">
                      {formatDateToStringWithTime(job?.scheduled_start as string)}
                    </Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaClock} color={iconMutedColor} boxSize={4} />
                    <Text fontSize="sm" color={labelColor} minW="100px">
                      Time:
                    </Text>
                    <Text fontSize="sm" color={valueColor} fontWeight="medium">
                      {formatDateToStringWithTime(job?.scheduled_start as string)}
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              <Divider />

              {/* Price */}
              {job.total_price_cents && (
                <>
                  <Box>
                    <HStack mb={2}>
                      <Text fontSize="lg" fontWeight="bold" color={headingColor}>
                        Price
                      </Text>
                    </HStack>
                    <HStack pl={8}>
                      <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                        ${formatNumberWithCommasAndDecimals(Number(job.total_price_cents))}
                      </Text>
                      <Text fontSize="sm" color={bodyColor}>
                        {job.currency}
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
          bg={infoBoxBg}
          borderWidth="1px"
          borderColor={infoBoxBorder}
          borderRadius="md"
          p={4}
          w="full"
        >
          <HStack spacing={3}>
            <Icon as={FaInfoCircle} color="blue.500" boxSize={5} />
            <Text fontSize="sm" color={infoBoxTextColor} flex={1}>
              You'll be notified once a provider accepts your service request. Please keep this page open or check back later.
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};
