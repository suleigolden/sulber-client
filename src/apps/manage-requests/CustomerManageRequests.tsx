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
} from "@chakra-ui/react";
import { useCustomerJobs } from "~/hooks/use-customer-jobs";
import { Job, ProviderServiceTypesList, api } from "@suleigolden/sulber-api-client";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaDollarSign, FaTimes } from "react-icons/fa";
import { formatNumberWithCommas } from "~/common/utils/currency-formatter";
import { fullAddress } from "~/common/utils/address";
import { useState, useRef } from "react";
import { getStatusColor } from "~/common/utils/status-color";
import { formatDateToStringWithoutTime, formatDateToStringWithTime } from "~/common/utils/date-time";

export const CustomerManageRequests = () => {
  const { jobs, isLoading } = useCustomerJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const [isCancelling, setIsCancelling] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleCancelClick = (job: Job) => {
    setSelectedJob(job);
    onOpen();
  };

  const handleCancelConfirm = async () => {
    if (!selectedJob) return;

    setIsCancelling(true);
    try {
      await api.service("job").update(selectedJob.id, { status: "CANCELLED" });
      toast({
        title: "Request cancelled",
        description: "Your service request has been cancelled successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
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

  if (isLoading) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color="gray.600">Loading your requests...</Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <VStack align="start" spacing={8} w="full" mt={10}>
          <Heading size="lg" fontWeight="bold">
            Your Requests
          </Heading>
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
                No service requests yet
              </Text>
              <Text fontSize="sm" color="gray.500">
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
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        <Heading size="lg" fontWeight="bold">
          Your Requests ({sortedJobs.length})
        </Heading>

        <VStack spacing={4} w="full" align="stretch">
          {sortedJobs.map((job) => {
            const selectedService = job.serviceType
              ? ProviderServiceTypesList.services.find((s) => s.type === job.serviceType)
              : null;

            const canCancel = job.status === "PENDING" || job.status === "ACCEPTED";

            return (
              <Card
                key={job.id}
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
                        <Text fontSize="xs" color="gray.500">
                          Request ID: {job.id.slice(0, 8)}...
                        </Text>
                      </VStack>
                      {canCancel && (
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          leftIcon={<Icon as={FaTimes} />}
                          onClick={() => handleCancelClick(job)}
                        >
                          Cancel
                        </Button>
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
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">
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
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">
                            Schedule
                          </Text>
                          <Text fontSize="sm" color="gray.800" fontWeight="medium">
                            {formatDateToStringWithTime(job?.scheduledStart as string)}
                          </Text>
                        </VStack>
                      </HStack>

                      {/* Price */}
                      {job.totalPriceCents && (
                        <HStack align="start" spacing={3}>
                          <Icon as={FaDollarSign} color="brand.500" mt={1} />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color="gray.500" fontWeight="medium">
                              Price
                            </Text>
                            <Text fontSize="sm" color="gray.800" fontWeight="bold">
                              ${formatNumberWithCommas(Number(job.totalPriceCents) / 100)}{" "}
                              {job.currency || "CAD"}
                            </Text>
                          </VStack>
                        </HStack>
                      )}

                      {/* Created Date */}
                      <HStack align="start" spacing={3}>
                        <Icon as={FaClock} color="brand.500" mt={1} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">
                            Created
                          </Text>
                          <Text fontSize="sm" color="gray.800" fontWeight="medium">
                            {formatDateToStringWithoutTime(job?.createdAt.toLocaleString())}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>

                    {/* Notes */}
                    {job.notes && (
                      <>
                        <Divider />
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>
                            Notes
                          </Text>
                          <Text fontSize="sm" color="gray.700">
                            {job.notes}
                          </Text>
                        </Box>
                      </>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            );
          })}
        </VStack>
      </VStack>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Service Request
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to cancel this service request? This action cannot be undone.
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
