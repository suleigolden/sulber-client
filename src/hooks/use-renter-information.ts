import { Renter, api } from "@suleigolden/co-renting-api-client";
import { useState, useEffect } from "react";
import { useSignOut } from "./use-sign-out";
import { useUser } from "./use-user";


export const useRenterInformation = () => {
    const { user } = useUser();
    const signOut = useSignOut();
    const [renterInformation, setRenterInformation] = useState<Renter>();
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchRenterInformation = async () => {
        setIsLoading(true);
        try {
          const result = await api.service("renter").findRenterByUserId(user?.id as string);
          setRenterInformation(result);
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
  
      fetchRenterInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
  
    return { renterInformation, isLoading };
};
