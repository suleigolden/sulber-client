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

/** Job with optional payout relation from findByJobPayoutsByProviderId */
type JobWithPayout = {
  id: string;
  status: string;
  service_type?: string | null;
  job_completed_at?: string | Date | null;
  payout_status?: PayoutStatusKey | null;
  payout?: PayoutRow | null;
  total_price_cents?: number | string | null;
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

/** Normalize unknown date value to ISO string for formatDateToStringWithoutTime */
function toDateString(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  try {
    const d = new Date(value as string | number);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  } catch {
    return null;
  }
}

export const Payouts = () => {
  const { user } = useUser();
  const {
    borderColor,
    headingColor,
    mutedTextColor,
    textColor,
    labelColor,
  } = useSystemColor();

  const {
    data: jobsWithPayouts = [],
    isLoading,
  } = useQuery({
    queryKey: ["jobPayoutsByProvider", user?.id],
    queryFn: async (): Promise<JobWithPayout[]> => {
      if (!user?.id) return [];
      return (api).service("job").findByJobPayoutsByProviderId(user.id);
    },
    enabled: Boolean(user?.id),
    staleTime: 60000,
  });
  console.log("jobsWithPayouts:: ", jobsWithPayouts);

  const payouts = useMemo(() => {
    return (jobsWithPayouts as JobWithPayout[])
      .map((j) => j.payout)
      .filter((p): p is PayoutRow => p != null);
  }, [jobsWithPayouts]);

  const completedJobs = useMemo(() => {
    return (jobsWithPayouts as JobWithPayout[]).filter(
      (job) => job.status === "COMPLETED",
    );
  }, [jobsWithPayouts]);

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
                      <Th color={labelColor}>Price Requested</Th>
                      <Th color={labelColor}>Completed</Th>
                      <Th color={labelColor}>Payout status</Th>
                      <Th color={labelColor}>Amount Paid</Th>
                      <Th color={labelColor}>Payout date</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {completedJobs.map((job) => {
                      const payout = payoutByJobId.get(job.id) ?? job.payout;
                      const status = (payout?.status ?? job.payout_status ?? "PENDING");
                      const serviceTitle =
                        job.service_type &&
                        ProviderServiceTypesList?.services?.find((s) => s.type === job.service_type)?.title;
                      const jobCompletedAt = job.job_completed_at;
                      return (
                        <Tr key={job.id}>
                          <Td color={textColor} fontWeight="medium">
                            {serviceTitle || job.service_type || "—"}
                          </Td>
                          <Td color={mutedTextColor} fontFamily="mono" fontSize="xs">
                            {job.id.slice(0, 8)}…
                          </Td>
                          <Td color={textColor} fontWeight="medium">{formatAmount(Number(job.total_price_cents))}</Td>
                          <Td color={textColor} fontSize="sm">
                            {toDateString(jobCompletedAt)
                              ? formatDateToStringWithoutTime(toDateString(jobCompletedAt)!)
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
                            {toDateString(payout?.created_at)
                              ? formatDateToStringWithoutTime(toDateString(payout?.created_at)!)
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
