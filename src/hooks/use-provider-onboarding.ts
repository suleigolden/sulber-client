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
  const [avatarUrl, setAvatarUrl] = useState<UserProfile['avatar_url']>(
    userProfile?.avatar_url || ''
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
      const raw = userProfile as Record<string, unknown> | undefined;
      reset({
        first_name: (raw?.first_name ?? raw?.firstName ?? '') as string,
        last_name: (raw?.last_name ?? raw?.lastName ?? '') as string,
        avatar_url: userProfile?.avatar_url || (raw?.avatar_url as string) || '',
        date_of_birth: userProfile?.date_of_birth || (raw?.date_of_birth as string) || '',
        phone_number: userProfile?.phone_number || (raw?.phone_number as string) || '',
        gender: userProfile?.gender || (raw?.gender as string) || '',
        services: providerProfile?.services || [],
        bio: userProfile?.bio || (raw?.bio as string) || '',
        address: userProfile?.address
          ? {
              street: userProfile.address.street || '',
              city: userProfile.address.city || '',
              state: userProfile.address.state || '',
              country: userProfile.address.country || '',
              postal_code: userProfile.address.postal_code || '',
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
        user_id: user.id,
        first_name: data.first_name?.trim() || null,
        last_name: data.last_name?.trim() || null,
        avatar_url: data.avatar_url,
        date_of_birth: data.date_of_birth && data.date_of_birth.trim() !== '' ? data.date_of_birth : null,
        phone_number: data.phone_number,
        gender: data.gender,
        bio: data.bio,
        address: {
          street: data.address?.street || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          country: data.address?.country || '',
          postal_code: data.address?.postal_code || '',
        },
      };
      const providerProfilePayload = {
        user_id: user.id,
        services: data.services,
        business_name: data.business_name,
      };

      if (userProfile) {
        await api.service('user-profile').update(userProfile.id as string, userProfilePayload as unknown as UserProfile);
      }
      if (providerProfile) {
        await api.service('provider-profile').update(providerProfile.id as string, providerProfilePayload as ProviderProfile);
      }

      showToast('Success', 'Your changes have been saved successfully.', 'success');
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