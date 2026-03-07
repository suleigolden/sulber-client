import { useQuery } from "@tanstack/react-query";
import { payoutAccountService } from "~/apps/users/payments/payout-api";
import type { ProviderPayoutAccount } from "@suleigolden/sulber-api-client";

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
      return payoutAccountService.findByProviderId(providerId);
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
