import { useQuery } from "@tanstack/react-query";
import { api } from "@suleigolden/sulber-api-client";
import { useUser } from "./use-user";

/**
 * Check if the provider has at least one job in provider-job-service.
 * Exposes checkAndRedirectToPostJob() to redirect to post-a-job when they have none.
 */
export const useCheckProviderHasJob = () => {
    const { user } = useUser();
    
  
    const {
      data: providerJobServices = [],
      isLoading: isLoadingProviderJobs,
      refetch: refetchProviderJobs,
    } = useQuery({
      queryKey: ["provider-job-services", user?.id],
      queryFn: () =>
        (api.service("provider-job-service") as { findByProviderId: (id: string) => Promise<unknown[]> }).findByProviderId(user!.id),
      enabled: !!user?.id,
    });
  
    const hasAtLeastOneJob = (providerJobServices?.length ?? 0) >= 1;
  
    const checkAndRedirectToPostJob = async () => {
      const result = await refetchProviderJobs();
      const list = result.data ?? [];
      if (list.length === 0 && user?.id) {
        window.location.href = `/provider/${user.id}/post-a-job`;
      }
    };
  
    return {
      hasAtLeastOneJob,
      isLoading: isLoadingProviderJobs,
      refetch: refetchProviderJobs,
      checkAndRedirectToPostJob,
    };
  };