import { array, InferType, object, string } from "yup";

export const ProviderOnboardingSchema =  object().shape({
  date_of_birth: string().optional(),
  phone_number: string().optional(),
  gender: string().optional(),
  services: array().of(string()).optional(),
  address: object().shape({
    street: string().optional(),
    city: string().optional(),
    state: string().optional(),
    country: string().optional(),
    postal_code: string().optional(),
  }).optional(),
  referral_code: string().optional(),
  avatar_url: string().optional(),
  bio: string().optional(),
  business_name: string().optional(),
});

 
export type ProviderOnboardingSchemaType = InferType<typeof ProviderOnboardingSchema>;

