import { api } from "@suleigolden/sulber-api-client";
import { useEffect, useState } from "react";
import { useUser } from "./use-user";
import { useSignOut } from "./use-sign-out";
import { ProviderProfile } from "@suleigolden/sulber-api-client";

export const useStepsNotCompleted = () => {
  const { user } = useUser();
  const signOut = useSignOut();
  const [stepsNotCompleted, setStepsNotCompleted] = useState<ProviderProfile>();
  const [isLoading, setIsLoading] = useState(true);
  const urlParams = window.location.href;
 
  useEffect(() => {
    const fetchStepsNotCompleted = async () => {
      setIsLoading(true);
      try {
        const result = await api.service("provider-profile").get(user?.id);
        if (!result && urlParams.includes("step")) {
          window.location.href = `/provider/${user?.id}/provider-onboard`;
        } else {
          setStepsNotCompleted(result);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Check if it's a 401 error user is not authenticated
        if (error?.response?.status === 401 || 
            error?.response?.data?.statusCode === 401 ||
            error?.response?.data?.statusCode === "401") {
          signOut();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStepsNotCompleted();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { stepsNotCompleted, isLoading };
};
