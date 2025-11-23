import { api } from "@suleigolden/co-renting-api-client";
import { useEffect, useState } from "react";
import { useUser } from "./use-user";
import { useSignOut } from "./use-sign-out";
import { Listing } from "@suleigolden/co-renting-api-client";

export const useStepsNotCompleted = () => {
  const { user } = useUser();
  const signOut = useSignOut();
  const [stepsNotCompleted, setStepsNotCompleted] = useState<Listing>();
  const [isLoading, setIsLoading] = useState(true);
  const urlParams = window.location.href;

  useEffect(() => {
    const fetchStepsNotCompleted = async () => {
      setIsLoading(true);
      try {
        const result = await api.service("listing").findStepsIsNotCompleted();
        if (!result && urlParams.includes("step")) {
          window.location.href = `/onboard/${user?.id}/property`;
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
