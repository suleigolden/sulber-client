import { useQuery } from "@tanstack/react-query";
import { api, type ProviderPayoutAccount } from "@suleigolden/sulber-api-client";

/**
 * Fetches the provider payout account for the given provider (user) id.
 * Use when the current user is a provider (role === 'provider').
 */
export function useProviderPayoutAccount(providerId: string | undefined) {
  const {
    data: account,
    isLoading,
    error,
    refetch,
  } = useQuery<ProviderPayoutAccount | null>({
    queryKey: ["provider-payout-account", providerId],
    queryFn: async () => {
      if (!providerId) return null;
      return (api.service("provider-payout-account") as { findByProviderId: (id: string) => Promise<ProviderPayoutAccount | null> }).findByProviderId(providerId);
    },
    enabled: Boolean(providerId),
    staleTime: 60_000,
  });

  return {
    account: account ?? null,
    isLoading,
    error: error ? String((error as Error).message) : null,
    refetch,
  };
}
