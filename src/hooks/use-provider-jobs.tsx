import { Job, api } from "@suleigolden/sulber-api-client";
import { useState, useEffect } from "react";
import { useSignOut } from "./use-sign-out";
import { useUser } from "./use-user";


export const useProviderJobs = () => {
    const { user } = useUser();
    const signOut = useSignOut();
    const [jobs, setJobs] = useState<Job[]>();
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchJob = async () => {
        setIsLoading(true);
        try {
          const result = await api.service("job").findByProviderId(user?.id as string);
          setJobs(result);
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
  
      fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
  
    return { jobs, isLoading };
};
