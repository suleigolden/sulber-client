import {
  Container,
  Heading,
  VStack,
  Box,
  Text,
  Button,
  Spinner,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useJobs } from "~/hooks/use-jobs";
import { Job, api } from "@suleigolden/sulber-api-client";
import { useState, useRef, useMemo, useEffect } from "react";
import { useUser } from "~/hooks/use-user";
import { useUserProfile } from "~/hooks/use-user-profile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AvailableJobsTab } from "./AvailableJobsTab";
import { ActiveJobsTab } from "./ActiveJobsTab";
import { CompletedJobsTab } from "./CompletedJobsTab";


export const ProviderManageRequests = () => {
  const { jobs: providerJobs, isLoading: isLoadingProviderJobs } = useJobs();
  const { user } = useUser();
  const { userProfile, isLoading: isLoadingUserProfile } = useUserProfile();
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [actionType, setActionType] = useState<"accept" | "update">("accept");
  const [newStatus, setNewStatus] = useState<string>("");
  const [tabIndex, setTabIndex] = useState(0); // 0: Available, 1: Active, 2: Completed
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  // Helper function to check if job location matches provider location
  const isJobInProviderLocation = (
    jobAddress: Job["address"],
    providerAddress: { country?: string | null; state?: string | null; city?: string | null; street?: string | null } | null | undefined
  ): boolean => {
    if (!providerAddress) return false;

    // Normalize strings for comparison (case-insensitive, trim whitespace)
    const normalize = (str: string | null | undefined): string => 
      str?.toLowerCase().trim() || "";

    const jobCountry = normalize(jobAddress.country);
    const jobState = normalize(jobAddress.state);
    const jobCity = normalize(jobAddress.city);
    const jobStreet = normalize(jobAddress.street);

    const providerCountry = normalize(providerAddress.country);
    const providerState = normalize(providerAddress.state);
    const providerCity = normalize(providerAddress.city);
    const providerStreet = normalize(providerAddress.street);

    // Match if same country AND (same state OR same city OR same street)
    const countryMatch = jobCountry && providerCountry && jobCountry === providerCountry;
    const locationMatch = 
      (jobState && providerState && jobState === providerState) ||
      (jobCity && providerCity && jobCity === providerCity) ||
      (jobStreet && providerStreet && jobStreet === providerStreet);
    
    return Boolean(countryMatch && locationMatch);
  };

  // Fetch available jobs using TanStack Query
  const {
    data: availableJobs = [],
    isLoading: isLoadingAvailableJobs,
    error: availableJobsError,
  } = useQuery({
    queryKey: ["availableJobs", user?.id, userProfile?.address],
    queryFn: async () => {
      if (!user?.id || !userProfile?.address) {
        return [];
      }

      const allPendingJobs = await api.service("job").list(undefined, undefined, "PENDING");
      
      // Filter jobs that:
      // 1. Don't have a provider assigned
      // 2. Are in the same location zone as the provider
      return allPendingJobs.filter((job) => {
        if (job.providerId) return false;
        return isJobInProviderLocation(job.address, userProfile.address);
      });
    },
    enabled: Boolean(user?.id && userProfile?.address && !isLoadingUserProfile),
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Show error toast if available jobs fetch fails
  useEffect(() => {
    if (availableJobsError) {
      toast({
        title: "Error",
        description: "Failed to load available jobs. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [availableJobsError, toast]);

  // Filter accepted/in-progress jobs
  const activeJobs = useMemo(() => {
    if (!providerJobs) return [];
    return providerJobs.filter(
      (job) => job.status === "ACCEPTED" || job.status === "IN_PROGRESS"
    );
  }, [providerJobs]);

  // Filter completed jobs
  const completedJobs = useMemo(() => {
    if (!providerJobs) return [];
    return providerJobs.filter((job) => job.status === "COMPLETED");
  }, [providerJobs]);

  const handleAcceptClick = (job: Job) => {
    setSelectedJob(job);
    setActionType("accept");
    onOpen();
  };

  const handleUpdateStatusClick = (job: Job, status: string) => {
    setSelectedJob(job);
    setActionType("update");
    setNewStatus(status);
    onOpen();
  };

  // Mutation for accepting/updating jobs
  const updateJobMutation = useMutation({
    mutationFn: async ({ jobId, updates }: { jobId: string; updates: Partial<Job> }) => {
      return await api.service("job").update(jobId, updates);
    },
    onMutate: async ({ jobId, updates }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["customerJobs", user?.id] });
      await queryClient.cancelQueries({ queryKey: ["availableJobs"] });
      
      // Snapshot the previous values
      const previousJobs = queryClient.getQueryData<Job[]>(["customerJobs", user?.id]);
      const previousAvailableJobs = queryClient.getQueryData<Job[]>(["availableJobs", user?.id, userProfile?.address]);
      
      // Optimistically update the cache
      if (actionType === "accept" && selectedJob) {
        // Add the accepted job to provider jobs list
        const updatedProviderJobs = previousJobs ? [...previousJobs, { ...selectedJob, ...updates, status: "ACCEPTED" as any, providerId: user?.id }] : [{ ...selectedJob, ...updates, status: "ACCEPTED" as any, providerId: user?.id }];
        queryClient.setQueryData<Job[]>(["customerJobs", user?.id], updatedProviderJobs);
        
        // Remove the job from available jobs list
        if (previousAvailableJobs) {
          const updatedAvailableJobs = previousAvailableJobs.filter((job) => job.id !== jobId);
          queryClient.setQueryData<Job[]>(["availableJobs", user?.id, userProfile?.address], updatedAvailableJobs);
        }
      } else if (previousJobs) {
        // For status updates, just update the existing job
        const updatedJobs = previousJobs.map((job) =>
          job.id === jobId ? { ...job, ...updates } : job
        );
        queryClient.setQueryData<Job[]>(["customerJobs", user?.id], updatedJobs);
      }
      
      return { previousJobs, previousAvailableJobs };
    },
    onSuccess: async (updatedJob, variables) => {
      // Invalidate and refetch relevant queries
      await queryClient.invalidateQueries({ queryKey: ["availableJobs"] });
      await queryClient.invalidateQueries({ queryKey: ["customerJobs", user?.id] });
      
      if (actionType === "accept") {
        // Switch to Active tab when a job is accepted
        setTabIndex(1);
        
        toast({
          title: "Job accepted",
          description: "You have successfully accepted this service request.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Status updated",
          description: `Job status has been updated to ${newStatus.replace("_", " ")}.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    },
    onError: (error: any, variables, context) => {
      // Rollback to previous values on error
      if (context?.previousJobs) {
        queryClient.setQueryData(["customerJobs", user?.id], context.previousJobs);
      }
      if (context?.previousAvailableJobs) {
        queryClient.setQueryData(["availableJobs", user?.id, userProfile?.address], context.previousAvailableJobs);
      }
      
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to process request. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleActionConfirm = async () => {
    if (!selectedJob || !user?.id) return;

    if (actionType === "accept") {
      updateJobMutation.mutate({
        jobId: selectedJob.id,
        updates: {
          status: "ACCEPTED",
          providerId: user.id,
        },
      });
    } else {
      updateJobMutation.mutate({
        jobId: selectedJob.id,
        updates: { status: newStatus as any },
      });
    }
  };

  const isLoading = isLoadingProviderJobs || isLoadingAvailableJobs || isLoadingUserProfile;

  if (isLoading) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color="gray.600">Loading requests...</Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="1500px" px={[4, 8]} py={[0, 0]}>
      <VStack align="start" spacing={8} w="full" mt={1}>


        <Tabs colorScheme="brand" w="full" index={tabIndex} onChange={setTabIndex}>
          <TabList>
            <Tab>
              Available ({availableJobs.length})
            </Tab>
            <Tab>
              Active ({activeJobs.length})
            </Tab>
            <Tab>
              Completed ({completedJobs.length})
            </Tab>
          </TabList>

          <TabPanels>
            {/* Available Jobs Tab */}
            <TabPanel px={0}>
              <AvailableJobsTab
                jobs={availableJobs}
                isLoading={isLoadingAvailableJobs}
                hasAddress={Boolean(userProfile?.address)}
                onAccept={handleAcceptClick}
                onUpdateStatus={handleUpdateStatusClick}
              />
            </TabPanel>

            {/* Active Jobs Tab */}
            <TabPanel px={0}>
              <ActiveJobsTab jobs={activeJobs} onUpdateStatus={handleUpdateStatusClick} />
            </TabPanel>

            {/* Completed Jobs Tab */}
            <TabPanel px={0}>
              <CompletedJobsTab jobs={completedJobs} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Action Confirmation Dialog */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {actionType === "accept" ? "Accept Service Request" : "Update Job Status"}
            </AlertDialogHeader>
            <AlertDialogBody>
              {actionType === "accept" ? (
                "Are you sure you want to accept this service request? You'll be responsible for completing the service."
              ) : (
                `Are you sure you want to update this job status to ${newStatus.replace("_", " ")}?`
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleActionConfirm}
                ml={3}
                isLoading={updateJobMutation.isPending}
                loadingText="Processing..."
              >
                {actionType === "accept" ? "Accept" : "Update"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};
