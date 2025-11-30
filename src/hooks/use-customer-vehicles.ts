import { api, CustomerVehicle } from "@suleigolden/sulber-api-client";
import { useEffect, useState } from "react";
import { useUser } from "./use-user";

export const useCustomerVehicles = () => {
  const { user } = useUser();
  const [vehicles, setVehicles] = useState<CustomerVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const result = await api.service("customer-vehicle").findByUserId(user.id);
        setVehicles(result);
      } catch (error) {
        console.error("Error fetching customer vehicles:", error);
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [user?.id]);

  return { vehicles, isLoading };
};

