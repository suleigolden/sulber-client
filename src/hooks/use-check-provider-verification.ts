import { useQuery } from "@tanstack/react-query";
import { useUser } from "./use-user";
import { api } from "@suleigolden/sulber-api-client";

export type ProviderVerificationStatus = {
  isIdentityVerified: boolean;
  isProfileComplete: boolean;
  status:
    | "verified"
    | "identity_not_verified"
    | "profile_not_verified"
    | "identity_and_profile_not_verified";
};

const getProviderVerificationStatus = async (
  userId: string,
  email: string
): Promise<ProviderVerificationStatus> => {
  return api.service("user").getProviderVerificationStatus(userId, email);
};

export const providerVerificationQueryKey = ["provider-verification"] as const;

export const useCheckProviderVerification = () => {
  const { user } = useUser();

  const {
    data: verificationStatus,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [...providerVerificationQueryKey, user?.id, user?.email],
    queryFn: () =>
      getProviderVerificationStatus(user!.id, user!.email),
    enabled: !!user?.id && !!user?.email,
  });

  const isProfileComplete = (verificationStatus: ProviderVerificationStatus) => {

        if (verificationStatus.status === 'identity_and_profile_not_verified' ||
            verificationStatus.status === 'identity_not_verified' ||
            verificationStatus.status === 'profile_not_verified'
        ) {
          window.location.href = `/provider/${user?.id}/complete-profile`;
        } 
  }

  return {
    verificationStatus,
    isLoading,
    isError,
    error,
    refetch,
    isProfileComplete,
  };
};
