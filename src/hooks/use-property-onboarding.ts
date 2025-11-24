import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '@suleigolden/sulber-api-client';
import { CustomToast } from './CustomToast';
import { useEffect, useState } from 'react';
import { PropertyOnboardingSchema, PropertyOnboardingSchemaType } from '~/apps/provider-onboard/schema';
import { useUser } from './use-user';

export const usePropertyOnboarding = (isLastStep?: boolean) => {
  const showToast = CustomToast();
  const { user } = useUser();
  // const { stepsNotCompleted, isLoading } = useStepsNotCompleted();
  // const { landlordInformation } = useLandlordInformation();
//   const [selectedAmenities, setSelectedAmenities] = useState<
//   string[]
// >(stepsNotCompleted?.amenities || []);
// const [photos, setPhotos] = useState<any['photo_galleries']>(
//   stepsNotCompleted?.photo_galleries || []
// );
  const methods = useForm<PropertyOnboardingSchemaType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<PropertyOnboardingSchemaType, any, any>(PropertyOnboardingSchema),
  });
  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    // if (stepsNotCompleted) {
      reset({
        // title: stepsNotCompleted?.title || '',
        // description: stepsNotCompleted?.description || '',
        // property_type: stepsNotCompleted?.property_type || '',
        // listing_type: stepsNotCompleted?.listing_type || 'rent',
        // building_type: stepsNotCompleted?.building_type || '',
        // parking_type: stepsNotCompleted?.parking_type || [],
        // age_of_property: stepsNotCompleted?.age_of_property || 0,
        // square_footage: stepsNotCompleted?.square_footage || '',
        // address: {
        //   street: stepsNotCompleted?.address?.street || '',
        //   country: stepsNotCompleted?.address?.country || '',
        //   city: stepsNotCompleted?.address?.city || '',
        //   state: stepsNotCompleted?.address?.state || '',
        //   postal_code: stepsNotCompleted?.address?.postal_code || '',
        // },
        // monthly_rent_or_sell_amount: stepsNotCompleted?.monthly_rent_or_sell_amount || { amount: 0, currency: 'USD' },
        // num_of_tenants_or_owners_needed: stepsNotCompleted?.num_of_tenants_or_owners_needed || 0,
        // number_of_bedrooms: stepsNotCompleted?.number_of_bedrooms || 0,
        // number_of_bathrooms: stepsNotCompleted?.number_of_bathrooms || 0,
        // amenities: stepsNotCompleted?.amenities || [],
        // pets_allowed: stepsNotCompleted?.pets_allowed || false,
        // smoking_allowed: stepsNotCompleted?.smoking_allowed || false,
        // is_active: stepsNotCompleted?.is_active || false,
        // is_smoking_detector: stepsNotCompleted?.is_smoking_detector || false,
        // is_carbon_monoxide_detector: stepsNotCompleted?.is_carbon_monoxide_detector || false,
        // is_steps_completed: isLastStep ? true : stepsNotCompleted?.is_steps_completed || false,
    });
    // setSelectedAmenities(stepsNotCompleted?.amenities || []);
    // }
  }, [reset]);
  
  const onSubmit = async (data: PropertyOnboardingSchemaType) => {
    try {
      // Validate that we have the required IDs
      // if (!landlordInformation?.id || !user?.id) {
      //   showToast('Error', 'Missing required user or landlord information', 'error');
      //   return;
      // }

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
    // selectedAmenities,
    // setSelectedAmenities,
    // isLoading,
    // setValue,
    // photos, 
    // setPhotos,
    // stepsNotCompleted
  };
}; 