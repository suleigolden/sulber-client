import { useQuery } from "@tanstack/react-query";
import { api, type User } from "@suleigolden/sulber-api-client";

export type SystemAdminStats = {
  customersCount: number;
  providersCount: number;
  jobsCount: number;
  payoutsCount: number;
};

const userService = api.service("user") as { listAll: () => Promise<User[]> };
const jobService = api.service("job") as { list: () => Promise<unknown[]> };
const payoutService = api.service("payout") as { list: () => Promise<unknown[]> };

export function useSystemAdminStats() {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery<SystemAdminStats>({
    queryKey: ["system-admin-stats"],
    queryFn: async () => {
      const [users, jobs, payouts] = await Promise.all([
        userService.listAll(),
        jobService.list(),
        payoutService.list(),
      ]);

      const customersCount = users.filter((u) => u.role === "customer").length;
      const providersCount = users.filter((u) => u.role === "provider").length;

      return {
        customersCount,
        providersCount,
        jobsCount: Array.isArray(jobs) ? jobs.length : 0,
        payoutsCount: Array.isArray(payouts) ? payouts.length : 0,
      };
    },
    staleTime: 60_000,
  });

  return {
    stats: stats ?? null,
    isLoading,
    error: error ? String((error as Error).message) : null,
    refetch,
  };
}
