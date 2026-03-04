import { Box, VStack, Text, Icon } from "@chakra-ui/react";
import { Job } from "@suleigolden/sulber-api-client";
import { FaUser } from "react-icons/fa";
import { JobCard } from "./JobCard";
import { useSystemColor } from "~/hooks/use-system-color";

type ActiveJobsTabProps = {
  jobs: Job[];
  onUpdateStatus: (job: Job, status: string) => void;
};

export const ActiveJobsTab = ({ jobs, onUpdateStatus }: ActiveJobsTabProps) => {
  const {
    borderColor,
    iconMutedColor,
    mutedTextColor,
  } = useSystemColor();

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
          <Icon as={FaUser} boxSize={12} color={iconMutedColor} />
          <Text fontSize="lg" color={mutedTextColor} fontWeight="medium">
            No active jobs
          </Text>
          <Text fontSize="sm" color={mutedTextColor}>
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

