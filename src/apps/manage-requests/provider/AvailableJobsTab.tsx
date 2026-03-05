import { Box, VStack, Text, Icon, Badge, Button, Flex, HStack } from "@chakra-ui/react";
import { Job, ProviderServiceTypesList } from "@suleigolden/sulber-api-client";
import { FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { fullAddress } from "~/common/utils/address";
import { formatNumberWithCommas, formatNumberWithCommasAndDecimals } from "~/common/utils/currency-formatter";
import { formatDateToStringWithTime } from "~/common/utils/date-time";
import { formatDistance } from "~/common/utils/distance";
import { useJobDistances } from "~/hooks/use-job-distances";
import { useUserProfile } from "~/hooks/use-user-profile";
import { JobsMap } from "./JobsMap";
import { useSystemColor } from "~/hooks/use-system-color";
import { CustomerInfoCard } from "./CustomerInfoCard";

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
  const { userProfile } = useUserProfile();
  const providerAddress = userProfile?.address
    ? [userProfile.address.street, userProfile.address.city, userProfile.address.state, userProfile.address.country, userProfile.address.postal_code]
      .filter(Boolean)
      .join(", ")
    : null;
  const { distances, isLoading: isLoadingDistances } = useJobDistances(providerAddress, jobs);
  const {
    borderColor,
    iconMutedColor,
    mutedTextColor,
    textColor: addressColor,
    headingColor: titleColor,
    dividerColor: scheduleColor,
    selectedCardBg,
  } = useSystemColor();
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
        bg={"transparent"}
        borderRadius="lg"
        borderWidth="1px"
        textAlign="center"
      >
        <VStack spacing={4}>
          <Icon as={FaMapMarkerAlt} boxSize={12} color={iconMutedColor} />
          <Text fontSize="lg" color={mutedTextColor} fontWeight="medium">
            Address Required
          </Text>
          <Text fontSize="sm" color={mutedTextColor}>
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
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        textAlign="center"
      >
        <VStack spacing={4}>
          <Text fontSize="sm" color={mutedTextColor}>
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
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        textAlign="center"
      >
        <VStack spacing={4}>
          <Icon as={FaCalendarAlt} boxSize={12} color={iconMutedColor} />
          <Text fontSize="lg" color={mutedTextColor} fontWeight="medium">
            No available requests
          </Text>
          <Text fontSize="sm" color={mutedTextColor}>
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
      p={1}
    >
      {/* Left Panel - Job List */}
      <Box
        w={{ base: "100%", lg: "400px" }}
        flexShrink={0}
        borderColor={borderColor}
        borderWidth="1px"
        borderRadius="lg"
        overflowY="auto"
        maxH={{ base: "50vh", lg: "100%" }}
      >
        <VStack spacing={3} p={4} align="stretch">
          {jobs.map((job, index) => {
            const selectedService = job.service_type
              ? ProviderServiceTypesList.services.find((s) => s.type === job.service_type)
              : null;

            const price = job.total_price_cents
              ? formatNumberWithCommas(Number(job.total_price_cents) / 100)
              : "0";

            const addOns =
              Array.isArray(job.add_on_prices) && job.add_on_prices.length > 0
                ? job.add_on_prices.flatMap((entry) =>
                  Object.entries(entry).map(([key]) => key)
                )
                : [];

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
                bg={isSelected ? selectedCardBg : "transparent"}
                boxShadow="lg"
                borderWidth="1px"
                borderColor={isSelected ? "brand.500" : borderColor}
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
                    <Text fontSize="sm" fontWeight="medium" color={addressColor} flex={1}>
                      {fullAddress(job.address)}
                    </Text>
                  </HStack>

                  {/* Distance from provider (e.g. "10 km away") */}
                  {!isLoadingDistances && distances.has(job.id) && (
                    <Badge
                      colorScheme="orange"
                      variant="outline"
                      width="fit-content"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      <Icon as={FaMapMarkerAlt} mr={1} boxSize={3} />
                      {formatDistance(distances.get(job.id)!)}
                    </Badge>
                  )}

                  {/* Service Type */}
                  <Text fontSize="md" fontWeight="bold" color={titleColor}>
                    {selectedService?.title || job.service_type || "Service Request"}
                  </Text>

                  {/* Schedule */}
                  <HStack spacing={2}>
                    <Icon as={FaCalendarAlt} color="brand.500" boxSize={3} />
                    <Text color={scheduleColor}>
                      {formatDateToStringWithTime(job?.scheduled_start as string)}
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

                  {/* Add-ons */}
                  {addOns.length > 0 && (
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color={titleColor}>Add-ons</Text>
                      <HStack spacing={2} flexWrap="wrap">
                        {addOns.map((addonKey) => (
                          <Badge
                            key={addonKey}
                            colorScheme="purple"
                            variant="subtle"
                            fontSize="xs"
                            px={2}
                            py={0.5}
                            borderRadius="md"
                          >
                            {addonKey.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                  )}

                  {/* Price and Action Button */}
                  <HStack justify="space-between" align="center" pt={2}>
                    <Badge
                      colorScheme="green"
                      variant="outline"
                      width="fit-content"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="lg"
                      fontWeight="bold"
                    >
                      ${formatNumberWithCommasAndDecimals(Number(job.total_price_cents))}
                    </Badge>
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

                  {/* Customer information */}
                  <CustomerInfoCard job={job} />
                </VStack>
              </Box>
            );
          })}
        </VStack>
      </Box>

      {/* Right Panel - Map */}
      <Box
        flex={1}
        borderColor={borderColor}
        borderWidth="1px"
        borderRadius="lg"
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

