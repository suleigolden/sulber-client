import {
  Container,
  Heading,
  VStack,
  HStack,
  Box,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  Spinner,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
} from "@chakra-ui/react";
import { useUser } from "~/hooks/use-user";
import { useJobs } from "~/hooks/use-jobs";
import { useQuery } from "@tanstack/react-query";
import { api, ProviderServiceTypesList } from "@suleigolden/sulber-api-client";
import { useMemo } from "react";
import { useSystemColor } from "~/hooks/use-system-color";
import { formatDateToStringWithoutTime } from "~/common/utils/date-time";
import { FaWallet, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

type PayoutStatusKey = "PENDING" | "PAID" | "FAILED";

/** Payout shape from API (job_id, amount, status, etc.) */
type PayoutRow = {
  id: string;
  job_id: string;
  provider_id: string;
  amount: number;
  currency: string;
  status: PayoutStatusKey;
  created_at: Date | string;
  updated_at?: Date | string;
};

const STATUS_COLOR: Record<PayoutStatusKey, string> = {
  PENDING: "yellow",
  PAID: "green",
  FAILED: "red",
};

const STATUS_LABEL: Record<PayoutStatusKey, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
};

function formatAmount(amount: number, currency = "CAD"): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export const Payouts = () => {
  const { user } = useUser();
  const { jobs: providerJobs = [], isLoading: isLoadingJobs } = useJobs();
  const {
    borderColor,
    headingColor,
    mutedTextColor,
    textColor,
    labelColor,
  } = useSystemColor();

  const {
    data: payouts = [],
    isLoading: isLoadingPayouts,
  } = useQuery({
    queryKey: ["payouts", user?.id],
    queryFn: async (): Promise<PayoutRow[]> => {
      if (!user?.id) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (api as any).service("payout").findByProviderId(user.id);
    },
    enabled: Boolean(user?.id),
    staleTime: 60000,
  });

  const completedJobs = useMemo(() => {
    if (!providerJobs) return [];
    return providerJobs.filter((job) => job.status === "COMPLETED");
  }, [providerJobs]);

  const payoutByJobId = useMemo(() => {
    const map = new Map<string, PayoutRow>();
    payouts.forEach((p) => map.set(p.job_id, p));
    return map;
  }, [payouts]);

  const totals = useMemo(() => {
    let total = 0;
    let pending = 0;
    let paid = 0;
    let failed = 0;
    payouts.forEach((p) => {
      const amt = Number(p.amount);
      total += amt;
      if (p.status === "PENDING") pending += amt;
      else if (p.status === "PAID") paid += amt;
      else if (p.status === "FAILED") failed += amt;
    });
    return { total, pending, paid, failed };
  }, [payouts]);

  const isLoading = isLoadingJobs || isLoadingPayouts;
  const isProvider = user?.role === "provider";

  if (!isProvider) {
    return (
      <Container maxW="1200px" px={{ base: 4, md: 8 }} py={8}>
        <Box
          p={8}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          textAlign="center"
        >
          <Text color={mutedTextColor}>
            Payouts are only available for providers. Switch to a provider account to view this page.
          </Text>
        </Box>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxW="1200px" px={{ base: 4, md: 8 }} py={8}>
        <Box display="flex" justifyContent="center" alignItems="center" minH="300px">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color={mutedTextColor}>Loading payouts...</Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="1200px" px={{ base: 4, md: 8 }} py={{ base: 4, md: 8 }}>
      <VStack align="stretch" spacing={{ base: 6, md: 8 }} w="full">
        <Heading size="lg" fontWeight="bold" color={headingColor}>
          Payouts
        </Heading>
        <Text fontSize="sm" color={mutedTextColor}>
          View your payout summary and completed jobs with their payout status.
        </Text>

        {/* Summary cards */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} w="full">
          <Card bg="transparent" borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack align="start" spacing={1}>
                <HStack spacing={2}>
                  <Icon as={FaWallet} color="brand.500" boxSize={5} />
                  <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                    Total payouts
                  </Text>
                </HStack>
                <Text fontSize="xl" fontWeight="bold" color={headingColor}>
                  {formatAmount(totals.total)}
                </Text>
                <Text fontSize="xs" color={mutedTextColor}>
                  {payouts.length} payout{payouts.length !== 1 ? "s" : ""}
                </Text>
              </VStack>
            </CardBody>
          </Card>
          <Card bg="transparent" borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack align="start" spacing={1}>
                <HStack spacing={2}>
                  <Icon as={FaClock} color="yellow.500" boxSize={5} />
                  <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                    Pending
                  </Text>
                </HStack>
                <Text fontSize="xl" fontWeight="bold" color={headingColor}>
                  {formatAmount(totals.pending)}
                </Text>
                <Text fontSize="xs" color={mutedTextColor}>
                  Awaiting processing
                </Text>
              </VStack>
            </CardBody>
          </Card>
          <Card bg="transparent" borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack align="start" spacing={1}>
                <HStack spacing={2}>
                  <Icon as={FaCheckCircle} color="green.500" boxSize={5} />
                  <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                    Paid
                  </Text>
                </HStack>
                <Text fontSize="xl" fontWeight="bold" color={headingColor}>
                  {formatAmount(totals.paid)}
                </Text>
                <Text fontSize="xs" color={mutedTextColor}>
                  Successfully paid
                </Text>
              </VStack>
            </CardBody>
          </Card>
          <Card bg="transparent" borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack align="start" spacing={1}>
                <HStack spacing={2}>
                  <Icon as={FaTimesCircle} color="red.500" boxSize={5} />
                  <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                    Failed
                  </Text>
                </HStack>
                <Text fontSize="xl" fontWeight="bold" color={headingColor}>
                  {formatAmount(totals.failed)}
                </Text>
                <Text fontSize="xs" color={mutedTextColor}>
                  Payouts that failed
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Completed jobs & payout status */}
        <Box w="full">
          <Heading size="md" fontWeight="semibold" color={headingColor} mb={4}>
            Completed jobs & payout status
          </Heading>
          {completedJobs.length === 0 ? (
            <Card bg="transparent" borderWidth="1px" borderColor={borderColor}>
              <CardBody py={12}>
                <VStack spacing={2}>
                  <Text color={mutedTextColor} fontWeight="medium">
                    No completed jobs yet
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Completed service requests and their payout status will appear here.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            <Card bg="transparent" borderWidth="1px" borderColor={borderColor} overflow="hidden">
              <TableContainer>
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th color={labelColor}>Service</Th>
                      <Th color={labelColor}>Job ID</Th>
                      <Th color={labelColor}>Completed</Th>
                      <Th color={labelColor}>Payout status</Th>
                      <Th color={labelColor}>Amount</Th>
                      <Th color={labelColor}>Payout date</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {completedJobs.map((job) => {
                      const payout = payoutByJobId.get(job.id);
                      const status = (payout?.status ?? (job as { payout_status?: PayoutStatusKey }).payout_status ?? "PENDING");
                      const serviceTitle =
                        job.service_type &&
                        ProviderServiceTypesList?.services?.find((s) => s.type === job.service_type)?.title;
                      const jobCompletedAt = (job as { job_completed_at?: string | Date | null }).job_completed_at;
                      return (
                        <Tr key={job.id}>
                          <Td color={textColor} fontWeight="medium">
                            {serviceTitle || job.service_type || "—"}
                          </Td>
                          <Td color={mutedTextColor} fontFamily="mono" fontSize="xs">
                            {job.id.slice(0, 8)}…
                          </Td>
                          <Td color={textColor} fontSize="sm">
                            {jobCompletedAt
                              ? formatDateToStringWithoutTime(
                                  typeof jobCompletedAt === "string"
                                    ? jobCompletedAt
                                    : (jobCompletedAt as Date).toISOString()
                                )
                              : "—"}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={STATUS_COLOR[status] ?? "gray"}
                              fontSize="xs"
                              px={2}
                              py={0.5}
                            >
                              {STATUS_LABEL[status] ?? status}
                            </Badge>
                          </Td>
                          <Td color={textColor} fontWeight="medium">
                            {payout ? formatAmount(Number(payout.amount), payout.currency) : "—"}
                          </Td>
                          <Td color={mutedTextColor} fontSize="sm">
                            {payout?.created_at
                              ? formatDateToStringWithoutTime(
                                  typeof payout.created_at === "string"
                                    ? payout.created_at
                                    : (payout.created_at as Date).toISOString()
                                )
                              : "—"}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </Box>
      </VStack>
    </Container>
  );
};
