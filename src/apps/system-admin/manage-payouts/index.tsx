import {
  Container,
  Heading,
  VStack,
  HStack,
  Select,
  Text,
  Spinner,
  Box,
  Button,
  Card,
  CardBody,
  SimpleGrid,
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
import { useMemo, useState } from "react";
import { ProviderServiceTypesList } from "@suleigolden/sulber-api-client";
import { TableSearchInput } from "~/components/fields/TableSearchInput";
import { useSystemAdminCompletedJobs, type DateRangePreset, type JobWithPayout } from "~/hooks/use-system-admin-completed-jobs";
import { useProviders } from "~/hooks/use-providers";
import { useSystemColor } from "~/hooks/use-system-color";
import { formatDateToStringWithoutTime } from "~/common/utils/date-time";
import { useToast } from "@chakra-ui/react";
import { FaWallet, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

type PayoutStatusKey = "PENDING" | "PAID" | "FAILED";

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

function getProviderDisplayName(
  providerId: string | null | undefined,
  providerMap: Map<string, { email?: string; profile?: { first_name?: string; last_name?: string } | null }>,
): string {
  if (!providerId) return "—";
  const p = providerMap.get(providerId);
  if (!p) return providerId.slice(0, 8) + "…";
  const profile = p.profile ?? undefined;
  const first = profile?.first_name?.trim();
  const last = profile?.last_name?.trim();
  if (first || last) return [first, last].filter(Boolean).join(" ");
  return p.email ?? providerId.slice(0, 8) + "…";
}

export const SystemAdminManagePayouts = () => {
  const toast = useToast();
  const {
    borderColor,
    headingColor,
    mutedTextColor,
    textColor,
    labelColor,
  } = useSystemColor();
  const { providers } = useProviders();
  const providerMap = useMemo(
    () =>
      new Map(
        providers.map((u) => [
          u.id,
          { email: u.email, profile: u.profile ?? undefined } as {
            email?: string;
            profile?: { first_name?: string; last_name?: string } | null;
          },
        ]),
      ),
    [providers],
  );

  const [dateRange, setDateRange] = useState<DateRangePreset>("30");
  const [statusFilter, setStatusFilter] = useState<"all" | "PENDING" | "PAID" | "FAILED">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    completedJobs,
    isLoading,
    error,
    markPayoutAsPaid,
    markPayoutAsPaidLoading,
  } = useSystemAdminCompletedJobs(dateRange);

  const filtered = useMemo(() => {
    let list: JobWithPayout[] = completedJobs;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((job) => {
        const providerName = getProviderDisplayName(job.provider_id, providerMap).toLowerCase();
        const serviceTitle =
          job.service_type &&
          ProviderServiceTypesList?.services?.find((s) => s.type === job.service_type)?.title?.toLowerCase();
        const jobId = (job.id ?? "").toLowerCase();
        return (
          providerName.includes(q) ||
          (serviceTitle && serviceTitle.includes(q)) ||
          jobId.includes(q)
        );
      });
    }
    if (statusFilter !== "all") {
      list = list.filter((job) => {
        const payout = job.payout;
        const status = (payout?.status ?? job.payout_status ?? "PENDING") as PayoutStatusKey;
        return status === statusFilter;
      });
    }
    return list;
  }, [completedJobs, searchQuery, statusFilter, providerMap]);

  const payoutsFromJobs = useMemo(() => {
    return filtered
      .map((j) => j.payout)
      .filter((p): p is NonNullable<typeof p> => p != null);
  }, [filtered]);

  const totals = useMemo(() => {
    let total = 0;
    let pending = 0;
    let paid = 0;
    let failed = 0;
    payoutsFromJobs.forEach((p) => {
      const amt = Number(p.amount);
      total += amt;
      if (p.status === "PENDING") pending += amt;
      else if (p.status === "PAID") paid += amt;
      else if (p.status === "FAILED") failed += amt;
    });
    return { total, pending, paid, failed };
  }, [payoutsFromJobs]);

  const handleMarkAsPaid = async (payoutId: string) => {
    try {
      await markPayoutAsPaid(payoutId);
      toast({ title: "Payout marked as paid", status: "success", isClosable: true });
    } catch (e) {
      toast({
        title: "Failed to update payout",
        description: (e as Error).message,
        status: "error",
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <VStack align="start" spacing={8} w="full" mt={10}>
          <Spinner size="lg" color="brand.500" />
          <Text color={mutedTextColor}>Loading completed jobs…</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <VStack align="start" spacing={8} w="full" mt={10}>
          <Heading size="md" color="red.500">
            Could not load completed jobs
          </Heading>
          <Text color={mutedTextColor}>{error}</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="stretch" spacing={6} w="full" mt={10}>
        <Heading size="lg" fontWeight="bold" color={headingColor}>
          Manage payouts
        </Heading>
        <Text fontSize="sm" color={mutedTextColor}>
          View completed jobs and payout status for all providers. Display shows job payout status and payout record status.
        </Text>

        <HStack wrap="wrap" spacing={4} w="full" align="center">
          <TableSearchInput
            query={searchQuery}
            setQuery={setSearchQuery}
            placeholder="Search by provider, service, job ID…"
          />
          <Select
            size="sm"
            w="160px"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRangePreset)}
          >
            <option value="all">All time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="60">Last 60 days</option>
            <option value="90">Last 90 days</option>
          </Select>
          <Select
            size="sm"
            w="130px"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "PENDING" | "PAID" | "FAILED")
            }
          >
            <option value="all">All status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
          </Select>
          <Text fontSize="sm" color={mutedTextColor}>
            {filtered.length} job{filtered.length !== 1 ? "s" : ""}
          </Text>
        </HStack>

        {/* Summary cards – same as provider payouts */}
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
                  {payoutsFromJobs.length} payout{payoutsFromJobs.length !== 1 ? "s" : ""}
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

        {/* Completed jobs & payout status – columns like provider payouts + Provider + Job payout status + Payout status + Actions */}
        <Box w="full">
          <Heading size="md" fontWeight="semibold" color={headingColor} mb={4}>
            Completed jobs & payout status
          </Heading>
          {filtered.length === 0 ? (
            <Card bg="transparent" borderWidth="1px" borderColor={borderColor}>
              <CardBody py={12}>
                <VStack spacing={2}>
                  <Text color={mutedTextColor} fontWeight="medium">
                    No completed jobs in this range
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Adjust the date range or filters to see completed jobs and their payout status.
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
                      <Th color={labelColor}>Provider</Th>
                      <Th color={labelColor}>Service</Th>
                      <Th color={labelColor}>Job ID</Th>
                      <Th color={labelColor}>Price Requested</Th>
                      <Th color={labelColor}>Completed</Th>
                      <Th color={labelColor}>Job payout status</Th>
                      <Th color={labelColor}>Payout status</Th>
                      <Th color={labelColor}>Amount Paid</Th>
                      <Th color={labelColor}>Payout date</Th>
                      <Th color={labelColor}>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filtered.map((job) => {
                      const payout = job.payout;
                      const jobPayoutStatus = (job.payout_status ?? "PENDING") as PayoutStatusKey;
                      const payoutStatus = (payout?.status ?? jobPayoutStatus) as PayoutStatusKey;
                      const serviceTitle =
                        job.service_type &&
                        ProviderServiceTypesList?.services?.find((s) => s.type === job.service_type)?.title;
                      const jobCompletedAt = job.job_completed_at;
                      return (
                        <Tr key={job.id}>
                          <Td color={textColor} fontWeight="medium">
                            {getProviderDisplayName(job.provider_id, providerMap)}
                          </Td>
                          <Td color={textColor} fontWeight="medium">
                            {serviceTitle || job.service_type || "—"}
                          </Td>
                          <Td color={mutedTextColor} fontFamily="mono" fontSize="xs">
                            {job.id.slice(0, 8)}…
                          </Td>
                          <Td color={textColor} fontWeight="medium">
                            {formatAmount(Number(job.total_price_cents ?? 0))}
                          </Td>
                          <Td color={textColor} fontSize="sm">
                            {toDateString(jobCompletedAt)
                              ? formatDateToStringWithoutTime(toDateString(jobCompletedAt)!)
                              : "—"}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={STATUS_COLOR[jobPayoutStatus] ?? "gray"}
                              fontSize="xs"
                              px={2}
                              py={0.5}
                            >
                              {STATUS_LABEL[jobPayoutStatus] ?? jobPayoutStatus}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={STATUS_COLOR[payoutStatus] ?? "gray"}
                              fontSize="xs"
                              px={2}
                              py={0.5}
                            >
                              {STATUS_LABEL[payoutStatus] ?? payoutStatus}
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
                          <Td>
                            {payout?.status === "PENDING" ? (
                              <Button
                                size="xs"
                                colorScheme="green"
                                onClick={() => handleMarkAsPaid(payout.id)}
                                isLoading={markPayoutAsPaidLoading}
                              >
                                Mark as paid
                              </Button>
                            ) : (
                              <Text fontSize="sm">—</Text>
                            )}
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
