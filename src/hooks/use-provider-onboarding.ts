import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api, ProviderProfile, UserProfile } from '@suleigolden/sulber-api-client';
import { CustomToast } from './CustomToast';
import { useEffect, useState } from 'react';
import { ProviderOnboardingSchema, ProviderOnboardingSchemaType } from '~/apps/provider-onboard/schema';
import { useUser } from './use-user';
import { useStepsNotCompleted } from './use-steps-not-completed';
import { useUserProfile } from './use-user-profile';
import { useIdentityVerifications } from './use-identity-verifications';

export const useProviderOnboarding = (isLastStep?: boolean) => {
  const showToast = CustomToast();
  const { user } = useUser();
  const { stepsNotCompleted, isLoading } = useStepsNotCompleted();
  const { userProfile } = useUserProfile();
  const { identityVerification } = useIdentityVerifications();
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
        services: stepsNotCompleted?.services || [],
        bio: stepsNotCompleted?.bio || '',
        verification_status: identityVerification?.status || '',
        verification_provider: identityVerification?.provider || '',
        verification_document_type: identityVerification?.documentType || '',
        verification_document_expiration_date: identityVerification?.documentExpirationDate || '',
        verification_document_front_url: identityVerification?.meta?.documentFrontUrl || '',
        verification_document_back_url: identityVerification?.meta?.documentBackUrl || '',
    });
    }
  }, [reset, userProfile]);
  
  const onSubmit = async (data: ProviderOnboardingSchemaType) => {
    try {
      // Validate that we have the required IDs
      if (!userProfile?.id || !user?.id) {
        showToast('Error', 'Missing required user or user profile information', 'error');
        return;
      }

      const payload = {
        userId: user.id,
        avatarUrl: data.avatar_url,
        dateOfBirth: data.date_of_birth,
        phoneNumber: data.phone_number,
        gender: data.gender,
        services: data.services,
        bio: data.bio,
        status: data.verification_status,
        provider: data.verification_provider,
        documentType: data.verification_document_type,
        documentExpirationDate: data.verification_document_expiration_date,
        documentFrontUrl: data.verification_document_front_url,
        documentBackUrl: data.verification_document_back_url,
        ...data,
      };
      console.log(data);

      // await api.service('provider-profile').update(userProfile.id as string, payload as ProviderProfile);

      // const payload = {
      //   landlord_id: landlordInformation.id,
      //   user_id: user.id,
      //   ...data,
      //   amenities: data.amenities,
      // };

      // if (stepsNotCompleted) {
      //   await api.service('listing').updateListing(stepsNotCompleted.id as string, payload as Listing);
      // } else {
      //   await api.service('listing').createListing(payload as Listing);
      // }

      showToast('Success', 'Property information saved successfully', 'success');
      if (isLastStep) {
        // window.location.href = `/properties/${stepsNotCompleted?.id}/onboard-complete`;
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