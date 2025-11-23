import { Landlord, api } from "@suleigolden/co-renting-api-client";
import { useState, useEffect } from "react";
import { useSignOut } from "./use-sign-out";
import { useUser } from "./use-user";


export const useLandlordInformation = () => {
    const { user } = useUser();
    const signOut = useSignOut();
    const [landlordInformation, setLandlordInformation] = useState<Landlord>();
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchLandlordInformation = async () => {
        setIsLoading(true);
        try {
          const result = await api.service("landlord").findLandlordByUserId(user?.id as string);
          setLandlordInformation(result);
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
  
      fetchLandlordInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
  
    return { landlordInformation, isLoading };
};
