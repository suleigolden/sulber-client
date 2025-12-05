import { Box, VStack, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { Job } from "@suleigolden/sulber-api-client";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { JobCard } from "./JobCard";

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

  return (
    <VStack spacing={4} w="full" align="stretch">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          showActions={true}
          onAccept={onAccept}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </VStack>
  );
};

