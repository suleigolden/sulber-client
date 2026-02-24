import {
  Box,
  Button,
  Container,
  Heading,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { api, type ProviderJobService } from "@suleigolden/sulber-api-client";
import { useUser } from "~/hooks/use-user";
import { ProviderJobServiceCard } from "./ProviderJobServiceCard";
import { PostJobModal } from "./PostJobModal";

export const PostAJob = () => {
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [jobs, setJobs] = useState<ProviderJobService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const headingColor = useColorModeValue("gray.800", "white");
  const mutedColor = useColorModeValue("gray.900", "gray.400");

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

  if (!user) {
    return (
      <Container maxW="1100px" px={{ base: 4, md: 8 }} py={8}>
        <Text color={mutedColor}>Please sign in to view your services.</Text>
      </Container>
    );
  }

  if (user.role !== "provider") {
    return (
      <Container maxW="1100px" px={{ base: 4, md: 8 }} py={8}>
        <Text color={mutedColor}>Only providers can post and manage job services.</Text>
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
            <Text color={mutedColor} mt={2}>
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
            <Text color={mutedColor}>Loading your services...</Text>
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
            borderColor={useColorModeValue("gray.300", "whiteAlpha.300")}
            textAlign="center"
          >
            <Text color={mutedColor} mb={4}>
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
                <ProviderJobServiceCard key={job.id} job={job} />
              ))}
            </VStack>
        )}
      </VStack>

      <PostJobModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={fetchJobs}
        providerId={user.id}
      />
    </Container>
  );
};
