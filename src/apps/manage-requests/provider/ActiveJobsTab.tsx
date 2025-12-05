import { Box, VStack, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { Job } from "@suleigolden/sulber-api-client";
import { FaUser } from "react-icons/fa";
import { JobCard } from "./JobCard";

type ActiveJobsTabProps = {
  jobs: Job[];
  onUpdateStatus: (job: Job, status: string) => void;
};

export const ActiveJobsTab = ({ jobs, onUpdateStatus }: ActiveJobsTabProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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
          <Icon as={FaUser} boxSize={12} color="gray.400" />
          <Text fontSize="lg" color="gray.600" fontWeight="medium">
            No active jobs
          </Text>
          <Text fontSize="sm" color="gray.700">
            Jobs you've accepted will appear here.
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
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </VStack>
  );
};

