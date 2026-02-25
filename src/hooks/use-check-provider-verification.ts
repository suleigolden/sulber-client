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
        let cancelled = false;
        const check = async () => {
            setIsLoading(true);
            try {
                const result = await api.service("user").getProviderVerificationStatus(user.id, user.email);
                if (!cancelled) setVerificationStatus(result);
            } catch (error) {
                if (!cancelled) setVerificationStatus(undefined);
                console.error("Error checking provider verification:", error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        check();
        return () => { cancelled = true; };
    }, [user?.id, user?.email]);

    return { verificationStatus, isLoading };
}