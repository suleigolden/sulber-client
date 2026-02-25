import { useEffect, useState } from "react";
import { useUser } from "./use-user";
import { api } from "@suleigolden/sulber-api-client";

export const useCheckProviderVerification = () => {
    const { user } = useUser();
    const [verificationStatus, setVerificationStatus] = useState<{
        isIdentityVerified: boolean;
        isProfileComplete: boolean;
        status: 'verified' | 'identity_not_verified' | 'profile_not_verified' | 'identity_and_profile_not_verified';
    }>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkProviderVerification = async () => {
            const result = await api.service("user").getProviderVerificationStatus(user?.id as string, user?.email as string);
            setVerificationStatus(result);
        }
        checkProviderVerification();
    }, [user]);

    return { verificationStatus, isLoading };
}