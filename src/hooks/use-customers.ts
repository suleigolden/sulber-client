import { useQuery } from "@tanstack/react-query";
import { api, type User } from "@suleigolden/sulber-api-client";

const userService = api.service("user") as { listAll: () => Promise<User[]> };

/**
 * Fetches all users and returns only those with role "customer".
 * Used by system admin manage-customers page.
 */
export function useCustomers() {
  const {
    data: customers,
    isLoading,
    error,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["system-admin-customers"],
    queryFn: async () => {
      const users = await userService.listAll();
      return users.filter((u) => u.role === "customer");
    },
    staleTime: 60_000,
  });

  return {
    customers: customers ?? [],
    isLoading,
    error: error ? String((error as Error).message) : null,
    refetch,
  };
}
