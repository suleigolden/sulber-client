import { api, IdentityVerification} from "@suleigolden/sulber-api-client";
import { useEffect, useState } from "react";
import { useUser } from "./use-user";


export const useIdentityVerifications = () => {
    const { user } = useUser();
    const [identityVerification, setIdentityVerification] = useState<IdentityVerification>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchIdentityVerifications = async () => {
            const result = await api.service("identity-verification").findByUserId(user?.id as string);
            setIdentityVerification(result);
        }
        fetchIdentityVerifications();
    }, [user]);

    return { identityVerification, isLoading };
}