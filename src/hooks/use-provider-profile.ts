import { ProviderProfile, api } from "@suleigolden/sulber-api-client";
import { useState, useEffect } from "react";
import { useSignOut } from "./use-sign-out";
import { useUser } from "./use-user";


export const useProviderProfile = () => {
    const { user } = useUser();
    const signOut = useSignOut();
    const [providerProfile, setProviderProfile] = useState<ProviderProfile>();
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
          const result = await api.service("provider-profile").get(user?.id as string);
          setProviderProfile(result);
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
  
      fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
  
    return { providerProfile, isLoading };
};
