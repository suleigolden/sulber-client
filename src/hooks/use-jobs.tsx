import { api } from "@suleigolden/sulber-api-client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSignOut } from "./use-sign-out";
import { useUser } from "./use-user";


export const useJobs = () => {
    const { user } = useUser();
    const signOut = useSignOut();
  
    const {
      data: jobs,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["customerJobs", user?.id],
      queryFn: async () => {
        if (!user?.id) {
          return [];
        }
        if (user.role === 'customer') {
          return await api.service("job").findByCustomerId(user.id);
        } else if (user.role === "provider") {
          return await api.service("job").findByProviderId(user.id);
        }
        return [];
      },
      enabled: Boolean(user?.id),
      staleTime: 30000, // Consider data fresh for 30 seconds
    });

    // Handle 401 errors by signing out
    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorData = error as any;
      if (
        errorData?.response?.status === 401 ||
        errorData?.response?.data?.statusCode === 401 ||
        errorData?.response?.data?.statusCode === "401"
      ) {
        signOut();
      }
    }, [error, signOut]);
  
    return { jobs, isLoading };
};
