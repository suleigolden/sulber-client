import {
  Container,
  Heading,
  VStack,
  Box,
  Card,
  CardBody,
  HStack,
  Text,
  Badge,
  Button,
  Spinner,
  useColorModeValue,
  Icon,
  Divider,
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
import { useProviderJobs } from "~/hooks/use-provider-jobs";
import { Job, ProviderServiceTypesList, api } from "@suleigolden/sulber-api-client";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaDollarSign, FaCheck, FaUser } from "react-icons/fa";
import { formatNumberWithCommas } from "~/common/utils/currency-formatter";
import { fullAddress } from "~/common/utils/address";
import { useState, useRef, useMemo, useEffect } from "react";
import { useUser } from "~/hooks/use-user";
import { useUserProfile } from "~/hooks/use-user-profile";
import { getStatusColor } from "~/common/utils/status-color";
import { formatDateToStringWithoutTime, formatDateToStringWithTime } from "~/common/utils/date-time";


export const ProviderManageRequests = () => {
  const { jobs: providerJobs, isLoading: isLoadingProviderJobs } = useProviderJobs();
  const { user } = useUser();
  const { userProfile, isLoading: isLoadingUserProfile } = useUserProfile();
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [isLoadingAvailableJobs, setIsLoadingAvailableJobs] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [actionType, setActionType] = useState<"accept" | "update">("accept");
  const [newStatus, setNewStatus] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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

  // Fetch available jobs (pending jobs without a provider, filtered by location)
  useEffect(() => {
    const fetchAvailableJobs = async () => {
      if (!user?.id || isLoadingUserProfile) return;
      
      // Wait for user profile to load
      if (!userProfile?.address) {
        setIsLoadingAvailableJobs(false);
        return;
      }

      setIsLoadingAvailableJobs(true);
      try {
        const allPendingJobs = await api.service("job").list(undefined, undefined, "PENDING");
        
        // Filter jobs that:
        // 1. Don't have a provider assigned
        // 2. Are in the same location zone as the provider
        const available = allPendingJobs.filter((job) => {
          if (job.providerId) return false;
          return isJobInProviderLocation(job.address, userProfile.address);
        });
        
        setAvailableJobs(available);
      } catch (error: any) {
        console.error("Error fetching available jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load available jobs. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoadingAvailableJobs(false);
      }
    };

    fetchAvailableJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, userProfile?.address, isLoadingUserProfile]);

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

  const handleActionConfirm = async () => {
    if (!selectedJob || !user?.id) return;

    setIsProcessing(true);
    try {
      if (actionType === "accept") {
        await api.service("job").update(selectedJob.id, {
          status: "ACCEPTED",
          providerId: user.id,
        });
        toast({
          title: "Job accepted",
          description: "You have successfully accepted this service request.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await api.service("job").update(selectedJob.id, { status: newStatus as any });
        toast({
          title: "Status updated",
          description: `Job status has been updated to ${newStatus.replace("_", " ")}.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
      // Refresh the page to update the list
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to process request. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
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

  const JobCard = ({ job, showActions = false }: { job: Job; showActions?: boolean }) => {
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
                  {job.status === "PENDING" && !job.providerId && (
                    <Button
                      size="sm"
                      colorScheme="brand"
                      leftIcon={<Icon as={FaCheck} />}
                      onClick={() => handleAcceptClick(job)}
                    >
                      Accept
                    </Button>
                  )}
                  {job.status === "ACCEPTED" && (
                    <Button
                      size="sm"
                      colorScheme="purple"
                      variant="outline"
                      onClick={() => handleUpdateStatusClick(job, "IN_PROGRESS")}
                    >
                      Start Service
                    </Button>
                  )}
                  {job.status === "IN_PROGRESS" && (
                    <Button
                      size="sm"
                      colorScheme="green"
                      leftIcon={<Icon as={FaCheck} />}
                      onClick={() => handleUpdateStatusClick(job, "COMPLETED")}
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

              {/* Price */}
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
                      ${formatNumberWithCommas(Number(job.totalPriceCents) / 100)}{" "}
                      {/* {job.currency || "CAD"} */}
                    </Text>
                  </VStack>
                </HStack>
              )}
          </VStack>
        </CardBody>
      </Card>
    );
  };

  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        <Heading size="lg" fontWeight="bold">
          Manage Requests
        </Heading>

        <Tabs colorScheme="brand" w="full">
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
              {!userProfile?.address ? (
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
              ) : availableJobs.length === 0 ? (
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
              ) : (
                <VStack spacing={4} w="full" align="stretch">
                  {availableJobs.map((job) => (
                    <JobCard key={job.id} job={job} showActions={true} />
                  ))}
                </VStack>
              )}
            </TabPanel>

            {/* Active Jobs Tab */}
            <TabPanel px={0}>
              {activeJobs.length === 0 ? (
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
              ) : (
                <VStack spacing={4} w="full" align="stretch">
                  {activeJobs.map((job) => (
                    <JobCard key={job.id} job={job} showActions={true} />
                  ))}
                </VStack>
              )}
            </TabPanel>

            {/* Completed Jobs Tab */}
            <TabPanel px={0}>
              {completedJobs.length === 0 ? (
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
              ) : (
                <VStack spacing={4} w="full" align="stretch">
                  {completedJobs.map((job) => (
                    <JobCard key={job.id} job={job} showActions={false} />
                  ))}
                </VStack>
              )}
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
                isLoading={isProcessing}
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
