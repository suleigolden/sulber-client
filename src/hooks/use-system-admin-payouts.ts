import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Payout, type PayoutStatus } from "@suleigolden/sulber-api-client";

const payoutService = api.service("payout") as {
  list: (
    providerId?: string,
    status?: PayoutStatus | string,
    fromDate?: string,
    toDate?: string,
  ) => Promise<Payout[]>;
  update: (id: string, data: { status: PayoutStatus }) => Promise<Payout>;
};

export type DateRangePreset = "all" | "7" | "30" | "60" | "90";

function getDateRange(preset: DateRangePreset): { fromDate?: string; toDate?: string } {
  if (preset === "all") return {};
  const days = parseInt(preset, 10);
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return {
    fromDate: from.toISOString().slice(0, 10),
    toDate: to.toISOString().slice(0, 10),
  };
}

export function useSystemAdminPayouts(
  statusFilter: "all" | PayoutStatus | string,
  dateRange: DateRangePreset,
) {
  const queryClient = useQueryClient();
  const { fromDate, toDate } = getDateRange(dateRange);

  const {
    data: payouts,
    isLoading,
    error,
    refetch,
  } = useQuery<Payout[]>({
    queryKey: ["system-admin-payouts", statusFilter, fromDate, toDate],
    queryFn: async () => {
      const status = statusFilter === "all" ? undefined : statusFilter;
      return payoutService.list(undefined, status, fromDate, toDate);
    },
    staleTime: 30_000,
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (id: string) =>
      payoutService.update(id, { status: "PAID" as PayoutStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-admin-payouts"] });
    },
  });

  const markManyAsPaidMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => payoutService.update(id, { status: "PAID" as PayoutStatus })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-admin-payouts"] });
    },
  });

  return {
    payouts: payouts ?? [],
    isLoading,
    error: error ? String((error as Error).message) : null,
    refetch,
    markAsPaid: markAsPaidMutation.mutateAsync,
    markAsPaidLoading: markAsPaidMutation.isPending,
    markManyAsPaid: markManyAsPaidMutation.mutateAsync,
    markManyAsPaidLoading: markManyAsPaidMutation.isPending,
  };
}
