import { api, UserProfile } from "@suleigolden/sulber-api-client";
import { useEffect, useState } from "react";
import { useUser } from "./use-user";
import { ProviderProfile } from "@suleigolden/sulber-api-client";
import { useProviderProfile } from "./use-provider-profile";
import { useUserProfile } from "./use-user-profile";

export const useStepsNotCompleted = () => {
  const { user } = useUser();
  const [stepsNotCompleted, setStepsNotCompleted] = useState<{ userProfile: UserProfile | undefined, providerProfile: ProviderProfile | undefined }>();
  const { userProfile, isLoading: isUserProfileLoading } = useUserProfile();
  const { providerProfile, isLoading: isProviderProfileLoading } = useProviderProfile();
  const [isLoading, setIsLoading] = useState(true);
  const urlParams = window.location.href;
 
  useEffect(() => {
    // Wait for both profiles to finish loading before processing
    if (isUserProfileLoading || isProviderProfileLoading) {
      return;
    }

    const fetchStepsNotCompleted = async () => {
      setIsLoading(true);
      try {
        if (!userProfile && !providerProfile && urlParams.includes("step")) {
          window.location.href = `/provider/${user?.id}/provider-onboard`;
        } else {
          setStepsNotCompleted({ userProfile: userProfile || undefined, providerProfile: providerProfile || undefined });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStepsNotCompleted();
  }, [isUserProfileLoading, isProviderProfileLoading, userProfile, providerProfile, urlParams, user?.id]);

  return { stepsNotCompleted, isLoading };
};
