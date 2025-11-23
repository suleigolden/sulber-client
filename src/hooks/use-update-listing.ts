import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api, Listing } from '@suleigolden/co-renting-api-client';
import { CustomToast } from './CustomToast';
import { useLandlordInformation } from './use-landloardinformation';
import { useUser } from './use-user';
import { UpdateListingSchemaType, UpdateListingSchema } from '~/apps/listings/update/schema';
import { useEffect } from 'react';

export const useUpdateListing = (listing: Listing) => {
  const showToast = CustomToast();
  const { user } = useUser();
  const { landlordInformation } = useLandlordInformation();

  const methods = useForm<UpdateListingSchemaType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<UpdateListingSchemaType, any, any>(UpdateListingSchema),
  });
  const {
    reset,
    formState: { isSubmitting },
  } = methods;
  
  useEffect(() => {
    if (listing) {
      reset({
        title: listing?.title || '',
        description: listing?.description || '',
        property_type: listing?.property_type || '',
        listing_type: listing?.listing_type || 'rent',
        building_type: listing?.building_type || '',
        parking_type: listing?.parking_type || [],
        age_of_property: listing?.age_of_property || 0,
        square_footage: listing?.square_footage || '',
        address: {
          street: listing?.address?.street || '',
          country: listing?.address?.country || '',
          city: listing?.address?.city || '',
          state: listing?.address?.state || '',
          postal_code: listing?.address?.postal_code || '',
        },
        monthly_rent_or_sell_amount: listing?.monthly_rent_or_sell_amount || { amount: 0, currency: 'USD' },
        num_of_tenants_or_owners_needed: listing?.num_of_tenants_or_owners_needed || 0,
        number_of_bedrooms: listing?.number_of_bedrooms || 0,
        number_of_bathrooms: listing?.number_of_bathrooms || 0,
        amenities: listing?.amenities || [],
        pets_allowed: listing?.pets_allowed || false,
        smoking_allowed: listing?.smoking_allowed || false,
        is_active: listing?.is_active || false,
        is_smoking_detector: listing?.is_smoking_detector || false,
        is_carbon_monoxide_detector: listing?.is_carbon_monoxide_detector || false,
      });
    }
  }, [listing, reset]);

  const onSubmit = async (payload: UpdateListingSchemaType) => {
    try {
      if (!landlordInformation || !user?.id) {
        showToast('Error', 'Missing required user or landlord information', 'error');
        return;
      }
      if (!listing.id) {
        showToast('Error', 'Missing listing ID', 'error');
        return;
      }

      await api.service('listing').updateListing(listing.id, {
        ...payload,
        amenities: payload.amenities,
      } as Listing);

      showToast('Success', 'Listing information updated successfully', 'success');
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        'An unexpected error occurred. Please try again.';
      showToast('Error', errorMessage, 'error');
      throw error;
    }
  };

  return {
    methods,
    handleSubmit: onSubmit,
    isSubmitting,
  };
}; 