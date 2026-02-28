import { useUserProfile } from "./use-user-profile";


export const useIsCustomerProfileComplete = () => {
    const { userProfile, isLoading } = useUserProfile();

    const isProfileComplete = () => {
        if (!userProfile) return false;
    
        const hasRequiredFields =
          userProfile.first_name &&
          userProfile.last_name &&
          userProfile.phone_number &&
          userProfile.date_of_birth &&
          userProfile.gender &&
          userProfile.address &&
          (userProfile.address.city ||
            userProfile.address.state ||
            userProfile.address.country ||
            userProfile.address.postal_code);
    
        const hasAddress =
          userProfile.address &&
          (userProfile.address.city ||
            userProfile.address.state ||
            userProfile.address.country ||
            userProfile.address.postal_code);
    
        return !!(hasRequiredFields && hasAddress);
      };


    return { isProfileComplete, isLoading };
}