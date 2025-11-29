import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api, ProviderProfile, UserProfile } from '@suleigolden/sulber-api-client';
import { CustomToast } from './CustomToast';
import { useEffect, useState } from 'react';
import { ProviderOnboardingSchema, ProviderOnboardingSchemaType } from '~/apps/provider-onboard/schema';
import { useUser } from './use-user';
import { useStepsNotCompleted } from './use-steps-not-completed';

export const useProviderOnboarding = (isLastStep?: boolean) => {
  const showToast = CustomToast();
  const { user } = useUser();
  const { stepsNotCompleted, isLoading } = useStepsNotCompleted();
  const userProfile = stepsNotCompleted?.userProfile;
  const providerProfile = stepsNotCompleted?.providerProfile;
  // const { identityVerification } = useIdentityVerifications();
  const [avatarUrl, setAvatarUrl] = useState<UserProfile['avatarUrl']>(
    userProfile?.avatarUrl || ''
  );

  const methods = useForm<ProviderOnboardingSchemaType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<ProviderOnboardingSchemaType, any, any>(ProviderOnboardingSchema),
  });
  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (stepsNotCompleted) {
      reset({
        avatar_url: userProfile?.avatarUrl || '',
        date_of_birth: userProfile?.dateOfBirth || '',
        phone_number: userProfile?.phoneNumber || '',
        gender: userProfile?.gender || '',
        services: providerProfile?.services || [],
        bio: userProfile?.bio || '',
        address: userProfile?.address
          ? {
              street: userProfile.address.street || '',
              city: userProfile.address.city || '',
              state: userProfile.address.state || '',
              country: userProfile.address.country || '',
              postal_code: userProfile.address.postalCode || '',
            }
          : undefined,
      });
    }
  }, [reset, userProfile, providerProfile, stepsNotCompleted]);
  
  const onSubmit = async (data: ProviderOnboardingSchemaType) => {
    try {
      // Validate that we have the required IDs
      if (!userProfile?.id || !user?.id) {
        showToast('Error', 'Missing required user or user profile information', 'error');
        return;
      }

      const userProfilePayload = {
        userId: user.id,
        avatarUrl: data.avatar_url,
        dateOfBirth: data.date_of_birth && data.date_of_birth.trim() !== '' ? data.date_of_birth : null,
        phoneNumber: data.phone_number,
        gender: data.gender,
        bio: data.bio,
        address: {
          street: data.address?.street || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          country: data.address?.country || '',
          postalCode: data.address?.postal_code || '',
        },
      };
      const providerProfilePayload = {
        userId: user.id,
        services: data.services,
        businessName: data.business_name,
      };

      if (userProfile) {
        await api.service('user-profile').update(userProfile.id as string, userProfilePayload as UserProfile);
      } 
      if (providerProfile) {
        await api.service('provider-profile').update(providerProfile.id as string, providerProfilePayload as ProviderProfile);
      }
      
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        'An unexpected error occurred. Please try again.';
      showToast('Error', errorMessage, 'error');
      throw error;
    }
  };

  return {
    methods,
    handleSubmit: handleSubmit(onSubmit),
    isSubmitting,
    isLoading,
    setValue,
    avatarUrl, 
    setAvatarUrl,
    stepsNotCompleted
  };
}; 