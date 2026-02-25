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
        if (!user?.id || !user?.email) {
            setIsLoading(false);
            return;
        }
        const checkProviderVerification = async () => {
            setIsLoading(true);
            const result = await api.service("user").getProviderVerificationStatus(user?.id as string, user?.email as string);
            setVerificationStatus(result);
            if (result.status === 'identity_and_profile_not_verified') {
                window.location.href = `/provider/${user?.id}/complete-profile`;
            }
        }
        
        try {
            checkProviderVerification();
        } catch (error) {
            console.error("Error checking provider verification:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    return { verificationStatus, isLoading };
}