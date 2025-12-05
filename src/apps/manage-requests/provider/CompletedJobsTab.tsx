import { Box, VStack, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { Job } from "@suleigolden/sulber-api-client";
import { FaCheck } from "react-icons/fa";
import { JobCard } from "./JobCard";

type CompletedJobsTabProps = {
  jobs: Job[];
};

export const CompletedJobsTab = ({ jobs }: CompletedJobsTabProps) => {
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
          <Icon as={FaCheck} boxSize={12} color="gray.400" />
          <Text fontSize="lg" color="gray.600" fontWeight="medium">
            No completed jobs
          </Text>
          <Text fontSize="sm" color="gray.700">
            Completed service requests will appear here.
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <VStack spacing={4} w="full" align="stretch">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} showActions={false} />
      ))}
    </VStack>
  );
};

