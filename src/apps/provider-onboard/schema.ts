import { array, boolean, InferType, number, object, string } from "yup";

export const PropertyOnboardingSchema =  object().shape({
  title: string().optional(),
  description: string().optional(),

  property_type: string().optional(),

  listing_type: string().optional(),

  building_type: string().optional(),

  parking_type: array().of(string()).optional(),

  age_of_property: number().optional(),

  square_footage: string().optional(),

  address: object().shape({
    street: string().optional(),
    city: string().optional(),
    state: string().optional(),
    country: string().optional(),
    postal_code: string().optional(),
  }).optional(),

  monthly_rent_or_sell_amount: object().shape({
    amount: number().optional(),
    currency: string().optional(),
  }).optional(),

  num_of_tenants_or_owners_needed: number().optional(),

  number_of_bedrooms: number().required('number_of_bedrooms is required'),

  number_of_bathrooms: number().required('number_of_bathrooms is required'),

  amenities: array().of(string()).optional(),

  pets_allowed: boolean().optional(),

  smoking_allowed: boolean().optional(),

  is_active: boolean().optional(),

  is_smoking_detector: boolean().optional(),

  is_carbon_monoxide_detector: boolean().optional(),

  is_steps_completed: boolean().optional(),

  photo_galleries: array().of(object().shape({
    url: string().required(),
    is_cover_photo: boolean().optional(),
  })).optional(),
});

 
export type PropertyOnboardingSchemaType = InferType<typeof PropertyOnboardingSchema>;

