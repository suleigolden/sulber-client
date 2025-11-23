import { Listing, api } from "@suleigolden/co-renting-api-client";
import { useState, useEffect } from "react";


export const useListings = () => {
    const [listings, setListings] = useState<Listing[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
  
    useEffect(() => {

      const fetchListings = async () => {

        setIsLoading(true);
        try {
          const result = await api.service("listing").list();
          setListings(result as Listing[]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchListings();
     
    }, []);
  
    return { listings, isLoading };
};
