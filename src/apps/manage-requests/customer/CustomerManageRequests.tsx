import {
  Container,
  Heading,
  VStack,
  Box,
  Card,
  CardBody,
  HStack,
  Stack,
  Text,
  Badge,
  Button,
  Spinner,
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
} from "@chakra-ui/react";
import { useJobs } from "~/hooks/use-jobs";
import {
  Job,
  ProviderServiceTypesList,
  api,
  ReasonsForCancellation,
  ReasonForCancellation,
} from "@suleigolden/sulber-api-client";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaDollarSign, FaTimes } from "react-icons/fa";
import { formatNumberWithCommas } from "~/common/utils/currency-formatter";
import { fullAddress } from "~/common/utils/address";
import { useState, useRef } from "react";
import { getStatusColor } from "~/common/utils/status-color";
import { formatDateToStringWithoutTime, formatDateToStringWithTime } from "~/common/utils/date-time";
import { useIsCustomerProfileComplete } from "~/hooks/use-is-customer-profile-complete";
import { IsProfileComplete } from "~/apps/users/customer/IsProfileComplete";
import { useSystemColor } from "~/hooks/use-system-color";
import { ProviderInfoCard } from "./ProviderInfoCard";

export const CustomerManageRequests = () => {
  const { jobs, isLoading } = useJobs();
  const { isProfileComplete, isLoading: isProfileCompleteLoading } = useIsCustomerProfileComplete();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const {
    borderColor,
    headingColor,
    textColor: primaryTextColor,
    mutedTextColor,
    iconColor,
    modalBg,
  } = useSystemColor();
 

  const handleCancelClick = (job: Job) => {
    setSelectedJob(job);
    onOpen();
  };

  const handleCancelConfirm = async () => {
    if (!selectedJob) return;

    // Only allow cancelling when the job is still ACCEPTED.
    // If it's already in progress, block cancellation with a message.
    if (selectedJob.status === "IN_PROGRESS") {
      toast({
        title: "Cannot cancel",
        description: "This service is already in progress and can no longer be cancelled.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      return;
    }

    if (!selectedReason) {
      toast({
        title: "Select a reason",
        description: "Please choose a reason for cancelling this request.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsCancelling(true);
    try {
      const response = await api.service("job").getJobCurrentStatus(selectedJob.id);
      if (response === "IN_PROGRESS") {
        toast({
          title: "Cannot cancel",
          description: "This service is already in progress and can no longer be cancelled. Please contact support with your request ID and reason for cancellation if you need to cancel this service.",
          status: "info",
          duration: 7000,
          isClosable: true,
        });
        return;
      }
      await api.service("job").cancelJob(selectedJob.id, selectedReason as ReasonForCancellation);
      toast({
        title: "Request cancelled",
        description: "Your service request has been cancelled successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setSelectedReason("");
      // Refresh the page to update the list
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to cancel request. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCancelling(false);
    }
  };


  if (isProfileCompleteLoading) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <VStack align="start" spacing={8} w="full" mt={10}>
          <Text color={mutedTextColor}>Loading...</Text>
        </VStack>
      </Container>
    );
  }

  if (!isProfileComplete()) {
    return <IsProfileComplete />;
  }


  if (isLoading) {
    return (
      <Container maxW="1500px" px={{ base: 4, md: 8 }} py={{ base: 4, md: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minH={{ base: "250px", md: "400px" }}
        >
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color={mutedTextColor}>Loading your requests...</Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Container maxW="1500px" px={{ base: 4, md: 8 }} py={{ base: 4, md: 8 }}>
        <VStack align="start" spacing={{ base: 6, md: 8 }} w="full" mt={{ base: 4, md: 10 }}>
          <Heading size="lg" fontWeight="bold" color={headingColor}>
            Your Requests
          </Heading>
          <Box
            w="full"
            p={{ base: 6, md: 12 }}
            bg={"transparent"}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            textAlign="center"
          >
            <VStack spacing={4}>
              <Icon as={FaCalendarAlt} boxSize={12} color={iconColor} />
              <Text fontSize="lg" color={mutedTextColor} fontWeight="medium">
                No service requests yet
              </Text>
              <Text fontSize="sm" color={mutedTextColor}>
                When you create a service request, it will appear here.
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    );
  }

  // Sort jobs by created date (newest first)
  const sortedJobs = [...jobs].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  return (
    <Container maxW="1500px" px={{ base: 4, md: 8 }} py={{ base: 4, md: 8 }}>
      <VStack align="start" spacing={{ base: 6, md: 8 }} w="full" mt={{ base: 4, md: 10 }}>
        <Heading size="lg" fontWeight="bold" color={headingColor}>
          Your Requests ({sortedJobs.length})
        </Heading>

        <VStack spacing={{ base: 3, md: 4 }} w="full" align="stretch">
          {sortedJobs.map((job) => {
            const selectedService = job.service_type
              ? ProviderServiceTypesList.services.find((s) => s.type === job.service_type)
              : null;

            const canCancel = job.status === "PENDING" || job.status === "ACCEPTED";

            return (
              <Card
                key={job.id}
                borderWidth="1px"
                borderColor={borderColor}
                bg={"transparent"}
                boxShadow="sm"
                _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    {/* Header with Status */}
                    <HStack
                      justify={{ base: "flex-start", md: "space-between" }}
                      align={{ base: "flex-start", md: "center" }}
                      flexDirection={{ base: "column", md: "row" }}
                      spacing={{ base: 3, md: 4 }}
                    >
                      {/* Service Title and Status */}
                      <VStack align="start" spacing={1} flex={1}>
                        <Stack
                          direction={{ base: "column", sm: "row" }}
                          align={{ base: "flex-start", sm: "center" }}
                          spacing={{ base: 1, sm: 2 }}
                        >
                          <Heading size="md" fontWeight="bold" color={headingColor}>
                            {selectedService?.title || job.service_type || "Service Request"}
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
                            {job.status === "CUSTOMER_CANCELLED" ? "You cancelled this request" : job.status.replace("_", " ")}
                          </Badge>
                        </Stack>
                        <Text fontSize="xs" color={mutedTextColor}>
                          Request ID: {job.id.slice(0, 8)}...
                        </Text>
                      </VStack>
                      {canCancel && (
                        <Box mt={{ base: 2, md: 0 }}>
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            leftIcon={<Icon as={FaTimes} />}
                            onClick={() => handleCancelClick(job)}
                            w={{ base: "full", sm: "auto" }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      )}
                    </HStack>

                    <Divider />

                    {/* Details Grid + Provider info */}
                    <Box
                      display="grid"
                      gridTemplateColumns={{ base: "1fr", lg: "2fr 1fr" }}
                      gap={{ base: 4, md: 6 }}
                      alignItems="flex-start"
                    >
                      <Box
                        display="grid"
                        gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                        gap={{ base: 3, md: 4 }}
                      >
                        {/* Location */}
                        <HStack align="start" spacing={3}>
                          <Icon as={FaMapMarkerAlt} color="brand.500" mt={1} />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color={mutedTextColor} fontWeight="medium">
                              Location
                            </Text>
                            <Text fontSize="sm" color={primaryTextColor} fontWeight="medium">
                              {fullAddress(job.address)}
                            </Text>
                          </VStack>
                        </HStack>

                        {/* Schedule */}
                        <HStack align="start" spacing={3}>
                          <Icon as={FaCalendarAlt} color="brand.500" mt={1} />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color={mutedTextColor} fontWeight="medium">
                              Schedule
                            </Text>
                            <Text fontSize="sm" color={primaryTextColor} fontWeight="medium">
                              {formatDateToStringWithTime(job?.scheduled_start as string)}
                            </Text>
                          </VStack>
                        </HStack>

                        {/* Price */}
                        {job.total_price_cents && (
                          <HStack align="start" spacing={3}>
                            <Icon as={FaDollarSign} color="brand.500" mt={1} />
                            <VStack align="start" spacing={0}>
                              <Text fontSize="xs" color={mutedTextColor} fontWeight="medium">
                                Price
                              </Text>
                              <Text fontSize="sm" color={primaryTextColor} fontWeight="bold">
                                ${formatNumberWithCommas(Number(job.total_price_cents) / 100)}{" "}
                                {job.currency || "CAD"}
                              </Text>
                            </VStack>
                          </HStack>
                        )}

                        {/* Created Date */}
                        <HStack align="start" spacing={3}>
                          <Icon as={FaClock} color="brand.500" mt={1} />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color={mutedTextColor} fontWeight="medium">
                              Created
                            </Text>
                            <Text fontSize="sm" color={primaryTextColor} fontWeight="medium">
                              {formatDateToStringWithoutTime(job?.created_at.toLocaleString())}
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>
                    </Box>

                    {/* Notes */}
                    {job.notes && (
                      <>
                        <Divider />
                        <Box>
                          <Text fontSize="xs" color={mutedTextColor} fontWeight="medium" mb={1}>
                            Notes
                          </Text>
                          <Text fontSize="sm" color={mutedTextColor}>
                            {job.notes}
                          </Text>
                        </Box>
                      </>
                    )}
                  </VStack>
                  { ["IN_PROGRESS", "COMPLETED", "ACCEPTED"].includes(job.status) && (
                    <Box mt={4}>
                      {/* Provider Information */}
                      <Heading size="sm" fontWeight="semibold" color={headingColor} mb={2}>
                        Provider Information
                      </Heading>
                      <ProviderInfoCard provider={(job as any).provider} />
                    </Box>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </VStack>
      </VStack>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bg={modalBg}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color={headingColor}>
              Cancel Service Request
            </AlertDialogHeader>
            <AlertDialogBody color={primaryTextColor}>
              <Text mb={3}>
                Are you sure you want to cancel this service request? This action cannot be undone.
              </Text>
              <Text fontSize="sm" color={mutedTextColor} mb={2}>
                Select a reason for cancellation:
              </Text>
              <VStack align="stretch" spacing={2}>
                {ReasonsForCancellation.map((reason) => (
                  <Button
                    key={reason}
                    size="sm"
                    variant={selectedReason === reason ? "solid" : "outline"}
                    colorScheme={selectedReason === reason ? "red" : "gray"}
                    justifyContent="flex-start"
                    onClick={() => setSelectedReason(reason)}
                  >
                    {reason.replace(/_/g, " ")}
                  </Button>
                ))}
              </VStack>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No, Keep It
              </Button>
              <Button
                colorScheme="red"
                onClick={handleCancelConfirm}
                ml={3}
                isLoading={isCancelling}
                loadingText="Cancelling..."
              >
                Yes, Cancel Request
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};
