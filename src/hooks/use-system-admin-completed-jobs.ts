import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@suleigolden/sulber-api-client";

export type DateRangePreset = "all" | "7" | "30" | "60" | "90";

/** Job with payout relation as returned by API (status COMPLETED, optional date range) */
export type JobWithPayout = {
  id: string;
  status: string;
  service_type?: string | null;
  job_completed_at?: string | Date | null;
  payout_status?: "PENDING" | "PAID" | "FAILED" | null;
  payout?: {
    id: string;
    job_id: string;
    provider_id: string;
    amount: number;
    currency: string;
    status: "PENDING" | "PAID" | "FAILED";
    created_at: Date | string;
    updated_at?: Date | string;
  } | null;
  total_price_cents?: number | string | null;
  provider_id?: string | null;
};

const jobService = api.service("job") as {
  list: (
    customerId?: string,
    providerId?: string,
    status?: string,
    createdAtFrom?: string,
    createdAtTo?: string,
    jobCompletedAtFrom?: string,
    jobCompletedAtTo?: string,
  ) => Promise<JobWithPayout[]>;
};

const payoutService = api.service("payout") as {
  update: (id: string, data: { status: "PAID" }) => Promise<unknown>;
};

function getDateRange(preset: DateRangePreset): { jobCompletedAtFrom?: string; jobCompletedAtTo?: string } {
  if (preset === "all") return {};
  const days = parseInt(preset, 10);
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return {
    jobCompletedAtFrom: from.toISOString().slice(0, 10),
    jobCompletedAtTo: to.toISOString().slice(0, 10),
  };
}

export function useSystemAdminCompletedJobs(dateRange: DateRangePreset) {
  const queryClient = useQueryClient();
  const { jobCompletedAtFrom, jobCompletedAtTo } = getDateRange(dateRange);

  const {
    data: jobs = [],
    isLoading,
    error,
    refetch,
  } = useQuery<JobWithPayout[]>({
    queryKey: ["system-admin-completed-jobs", dateRange, jobCompletedAtFrom, jobCompletedAtTo],
    queryFn: async () =>
      jobService.list(
        undefined,
        undefined,
        "COMPLETED",
        undefined,
        undefined,
        jobCompletedAtFrom,
        jobCompletedAtTo,
      ),
    staleTime: 30_000,
  });

  const markPayoutAsPaidMutation = useMutation({
    mutationFn: (payoutId: string) => payoutService.update(payoutId, { status: "PAID" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-admin-completed-jobs"] });
    },
  });

  return {
    completedJobs: jobs,
    isLoading,
    error: error ? String((error as Error).message) : null,
    refetch,
    markPayoutAsPaid: markPayoutAsPaidMutation.mutateAsync,
    markPayoutAsPaidLoading: markPayoutAsPaidMutation.isPending,
  };
}
