import { Box, VStack, Text, Icon, useColorModeValue, Badge, Button, Flex, HStack } from "@chakra-ui/react";
import { Job, ProviderServiceTypesList } from "@suleigolden/sulber-api-client";
import { FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaStar } from "react-icons/fa";
import { JobCard } from "./JobCard";
import { useState, useEffect } from "react";
import { fullAddress } from "~/common/utils/address";
import { formatNumberWithCommas } from "~/common/utils/currency-formatter";
import { formatDateToStringWithTime } from "~/common/utils/date-time";
import { JobsMap } from "./JobsMap";

type AvailableJobsTabProps = {
  jobs: Job[];
  isLoading: boolean;
  hasAddress: boolean;
  onAccept: (job: Job) => void;
  onUpdateStatus: (job: Job, status: string) => void;
};

export const AvailableJobsTab = ({
  jobs,
  isLoading,
  hasAddress,
  onAccept,
  onUpdateStatus,
}: AvailableJobsTabProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Automatically select the first job on page load
  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      const firstJob = jobs[0];
      setSelectedJobId(firstJob.id);
      // Scroll to the first job card after a short delay to ensure it's rendered
      setTimeout(() => {
        const element = document.getElementById(`job-${firstJob.id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [jobs, selectedJobId]);

  if (!hasAddress) {
    return (
      <Box
        w="full"
        p={12}
        bg="yellow.50"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="yellow.200"
        textAlign="center"
      >
        <VStack spacing={4}>
          <Icon as={FaMapMarkerAlt} boxSize={12} color="yellow.600" />
          <Text fontSize="lg" color="yellow.800" fontWeight="medium">
            Address Required
          </Text>
          <Text fontSize="sm" color="yellow.700">
            Please update your profile with your address to see available service requests in your area.
          </Text>
        </VStack>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        w="full"
        p={12}
        bg={cardBg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        textAlign="center"
      >
        <VStack spacing={4}>
          <Text fontSize="sm" color="gray.600">
            Loading available jobs...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (jobs.length === 0) {
    return (
      <Box
        w="full"
        p={12}
        bg={cardBg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        textAlign="center"
      >
        <VStack spacing={4}>
          <Icon as={FaCalendarAlt} boxSize={12} color="gray.400" />
          <Text fontSize="lg" color="gray.600" fontWeight="medium">
            No available requests
          </Text>
          <Text fontSize="sm" color="gray.700">
            New service requests in your area will appear here for you to accept.
          </Text>
        </VStack>
      </Box>
    );
  }
  const handleJobClick = (job: Job) => {
    setSelectedJobId(job.id);
    // Scroll to job card
    const element = document.getElementById(`job-${job.id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      gap={1}
      h={{ base: "auto", lg: "calc(100vh - 300px)" }}
      minH={{ base: "auto", lg: "600px" }}
      borderRadius="lg"
      boxShadow={"lg"}
      p={1}
    >
      {/* Left Panel - Job List */}
      <Box
        w={{ base: "100%", lg: "400px" }}
        flexShrink={0}
        bg={cardBg}
        overflowY="auto"
        maxH={{ base: "50vh", lg: "100%" }}
      >
        <VStack spacing={3} p={4} align="stretch">
          {jobs.map((job, index) => {
            const selectedService = job.serviceType
              ? ProviderServiceTypesList.services.find((s) => s.type === job.serviceType)
              : null;

            const price = job.totalPriceCents
              ? formatNumberWithCommas(Number(job.totalPriceCents) / 100)
              : "0";

            const isSelected = selectedJobId === job.id;

            // Determine badge label (similar to parking app)
            let badgeLabel = "";
            if (index === 0) badgeLabel = "Shortest distance";
            else if (index === 1) badgeLabel = "Best rating";
            else if (index === 2) badgeLabel = "Price tip";

            return (
              <Box
                key={job.id}
                id={`job-${job.id}`}
                bg={isSelected ? "brand.50" : cardBg}
                boxShadow={"lg"}
                borderColor={isSelected ? "brand.500" : ''}
                borderRadius="lg"
                p={4}
                cursor="pointer"
                onClick={() => handleJobClick(job)}
                _hover={{ borderColor: "brand.400", shadow: "md" }}
                transition="all 0.2s"
              >
                <VStack align="stretch" spacing={3}>
                  {/* Badge and Service Title */}
                  <HStack justify="space-between" align="start">
                    {badgeLabel && (
                      <Badge
                        colorScheme="brand"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        <Icon as={FaStar} mr={1} />
                        {badgeLabel}
                      </Badge>
                    )}
                    <Box flex={1} />
                  </HStack>

                  {/* Address */}
                  <HStack spacing={2} align="start">
                    <Icon as={FaMapMarkerAlt} color="brand.500" mt={0.5} boxSize={4} />
                    <Text fontSize="sm" fontWeight="medium" color="gray.800" flex={1}>
                      {fullAddress(job.address)}
                    </Text>
                  </HStack>

                  {/* Service Type */}
                  <Text fontSize="md" fontWeight="bold" color="gray.900">
                    {selectedService?.title || job.serviceType || "Service Request"}
                  </Text>

                  {/* Schedule */}
                  <HStack spacing={2}>
                    <Icon as={FaCalendarAlt} color="gray.500" boxSize={3} />
                    <Text fontSize="xs" color="gray.600">
                      {formatDateToStringWithTime(job?.scheduledStart as string)}
                    </Text>
                  </HStack>

                  {/* Features/Notes */}
                  {job.notes && (
                    <Box>
                      <HStack spacing={2} flexWrap="wrap">
                        {job.notes.split(". ").map((note, idx) => (
                          <Badge
                            key={idx}
                            colorScheme="blue"
                            variant="subtle"
                            fontSize="xs"
                            px={2}
                            py={0.5}
                            borderRadius="md"
                          >
                            {note}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                  )}

                  {/* Price and Action Button */}
                  <HStack justify="space-between" align="center" pt={2}>
                    <Text fontSize="lg" fontWeight="bold" color="brand.600">
                      ${price}
                    </Text>
                    <Button
                      size="sm"
                      colorScheme="brand"
                      leftIcon={<Icon as={FaCheck} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAccept(job);
                      }}
                    >
                      Accept
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            );
          })}
        </VStack>
      </Box>

      {/* Right Panel - Map */}
      <Box
        flex={1}
        bg={cardBg}
        borderColor={borderColor}
        overflow="hidden"
        minH={{ base: "400px", lg: "100%" }}
      >
        <JobsMap
          jobs={jobs}
          selectedJobId={selectedJobId}
          onJobSelect={(job) => {
            setSelectedJobId(job.id);
            handleJobClick(job);
          }}
        />
      </Box>
    </Flex>
  );
};

