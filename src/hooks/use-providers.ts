import { useQuery } from "@tanstack/react-query";
import { api, type User } from "@suleigolden/sulber-api-client";

const userService = api.service("user") as { listAll: () => Promise<User[]> };

/**
 * Fetches all users and returns only those with role "provider".
 * Used by system admin manage-providers page.
 */
export function useProviders() {
  const {
    data: providers,
    isLoading,
    error,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["system-admin-providers"],
    queryFn: async () => {
      const users = await userService.listAll();
      return users.filter((u) => u.role === "provider");
    },
    staleTime: 60_000,
  });

  return {
    providers: providers ?? [],
    isLoading,
    error: error ? String((error as Error).message) : null,
    refetch,
  };
}
