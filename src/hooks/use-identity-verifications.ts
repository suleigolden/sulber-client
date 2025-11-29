import { api, IdentityVerification} from "@suleigolden/sulber-api-client";
import { useEffect, useState } from "react";
import { useUser } from "./use-user";


export const useIdentityVerifications = () => {
    const { user } = useUser();
    const [identityVerification, setIdentityVerification] = useState<IdentityVerification[]>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchIdentityVerifications = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const result = await api.service("identity-verification").findByUserId(user.id);
                setIdentityVerification(result);
            } catch (error) {
                console.error("Error fetching identity verifications:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchIdentityVerifications();
    }, [user]);

    return { identityVerification, isLoading };
}