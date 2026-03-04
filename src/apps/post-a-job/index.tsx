import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Container,
  Heading,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import { api, type ProviderJobService } from "@suleigolden/sulber-api-client";
import { useUser } from "~/hooks/use-user";
import { CustomToast } from "~/hooks/CustomToast";
import { ProviderJobServiceCard } from "./ProviderJobServiceCard";
import { PostJobModal } from "./PostJobModal";
import { EditProviderJobModal } from "./EditProviderJobModal";
import { useCheckProviderVerification } from "~/hooks/use-check-provider-verification";
import { useSystemColor } from "~/hooks/use-system-color";

export const PostAJob = () => {
  const { user } = useUser();
  const { isLoading: isCheckingVerification, verificationStatus, isProfileComplete } = useCheckProviderVerification();
  const showToast = CustomToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelDeleteRef = useRef<HTMLButtonElement>(null);
  const [jobs, setJobs] = useState<ProviderJobService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [jobToDelete, setJobToDelete] = useState<ProviderJobService | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingJob, setEditingJob] = useState<ProviderJobService | null>(null);

  const {
    headingColor,
    mutedTextColor,
    borderColor,
  } = useSystemColor();

  const fetchJobs = useCallback(async () => {
    if (!user?.id || user?.role !== "provider") return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const svc = api.service("provider-job-service" as never) as { findByProviderId?: (id: string) => Promise<ProviderJobService[]> };
      if (typeof svc?.findByProviderId !== "function") {
        setLoadError("Provider job service API is not available.");
        setJobs([]);
        return;
      }
      const list = await svc.findByProviderId(user.id);
      setJobs(Array.isArray(list) ? list : []);
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to load your services.";
      setLoadError(message);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleToggleStatus = useCallback(
    async (job: ProviderJobService) => {
      const newStatus = job.status === "active" ? "inactive" : "active";
      try {
        const svc = api.service("provider-job-service" as never) as {
          update?: (id: string, data: { status: string }) => Promise<unknown>;
        };
        if (typeof svc?.update !== "function") return;
        await svc.update(job.id, { status: newStatus });
        showToast("Success", `Service set to ${newStatus}.`, "success");
        fetchJobs();
      } catch (err) {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: string }).message)
            : "Failed to update status.";
        showToast("Error", message, "error");
      }
    },
    [fetchJobs, showToast]
  );

  const handleDeleteClick = useCallback((job: ProviderJobService) => {
    setJobToDelete(job);
    onDeleteOpen();
  }, [onDeleteOpen]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    try {
      const svc = api.service("provider-job-service" as never) as {
        delete?: (id: string) => Promise<void>;
      };
      if (typeof svc?.delete !== "function") {
        showToast("Error", "Provider job service API is not available.", "error");
        return;
      }
      await svc.delete(jobToDelete.id);
      showToast("Success", "Service removed.", "success");
      onDeleteClose();
      setJobToDelete(null);
      fetchJobs();
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to delete.";
      showToast("Error", message, "error");
    } finally {
      setIsDeleting(false);
    }
  }, [jobToDelete, onDeleteClose, fetchJobs, showToast]);

  const handleEdit = useCallback((job: ProviderJobService) => {
    setEditingJob(job);
  }, []);

  const handleEditClose = useCallback(() => {
    setEditingJob(null);
  }, []);

  if (isCheckingVerification) {
    return <Spinner size="lg" color="brand.500" />;
  }
  if (!isLoading && verificationStatus) {
    isProfileComplete(verificationStatus);
  }
  if (!user) {
    return (
      <Container maxW="1100px" px={{ base: 4, md: 8 }} py={8}>
        <Text color={mutedTextColor}>Please sign in to view your services.</Text>
      </Container>
    );
  }

  if (user.role !== "provider") {
    return (
      <Container maxW="1100px" px={{ base: 4, md: 8 }} py={8}>
        <Text color={mutedTextColor}>Only providers can post and manage job services.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="1100px" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
      <VStack align="stretch" spacing={8}>
        <Box display="flex" flexDirection={{ base: "column", sm: "row" }} justifyContent="space-between" alignItems={{ base: "stretch", sm: "center" }} gap={4}>
          <Box>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="brand.500"
              letterSpacing="wider"
              textTransform="uppercase"
              mb={1}
            >
              How do you want to earn with SulBer?
            </Text>
            <Heading size="xl" color={headingColor} letterSpacing="tight">
              My services
            </Heading>
            <Text color={mutedTextColor} mt={2}>
              Manage the services you offer. Add new ones so customers can find and book you.
            </Text>
          </Box>
          <Button
            leftIcon={<MdAdd />}
            colorScheme="brand"
            bg="brand.500"
            color="white"
            _hover={{ bg: "brand.600" }}
            onClick={onOpen}
            borderRadius="lg"
            size="lg"
            flexShrink={0}
          >
            Post a job
          </Button>
        </Box>

        {isLoading ? (
          <VStack py={12}>
            <Spinner size="lg" color="brand.500" />
            <Text color={mutedTextColor}>Loading your services...</Text>
          </VStack>
        ) : loadError ? (
          <Box py={8}>
            <Text color="red.500">{loadError}</Text>
          </Box>
        ) : jobs.length === 0 ? (
          <Box
            py={12}
            px={6}
            borderRadius="xl"
            borderWidth="1px"
            borderStyle="dashed"
            borderColor={borderColor}
            textAlign="center"
          >
            <Text color={mutedTextColor} mb={4}>
              You haven&apos;t posted any services yet.
            </Text>
            <Button
              leftIcon={<MdAdd />}
              colorScheme="brand"
              bg="brand.500"
              color="white"
              _hover={{ bg: "brand.600" }}
              onClick={onOpen}
              borderRadius="lg"
            >
              Post your first job
            </Button>
          </Box>
        ) : (
          <VStack spacing={4} w="full" align="stretch">
            {jobs.map((job) => (
              <ProviderJobServiceCard
                key={job.id}
                job={job}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteClick}
              />
            ))}
          </VStack>
        )}
      </VStack>

      <PostJobModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={fetchJobs}
        providerId={user.id}
        usedServiceTypes={jobs.map((job) => (job as any).serviceType ?? (job as any).service_type).filter(Boolean)}
      />

      <EditProviderJobModal
        job={editingJob}
        onClose={handleEditClose}
        onSuccess={() => {
          handleEditClose();
          fetchJobs();
        }}
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelDeleteRef}
        onClose={() => {
          onDeleteClose();
          setJobToDelete(null);
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader>Delete service?</AlertDialogHeader>
            <AlertDialogBody>
              This will permanently remove this service offering. This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelDeleteRef} onClick={onDeleteClose} borderRadius="lg">
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                isLoading={isDeleting}
                ml={3}
                borderRadius="lg"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};
