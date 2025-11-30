import { array, InferType, object, string } from "yup";

export const UserProfileSchema =  object().shape({
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
  avatar_url: string().optional(),
  bio: string().optional(),
  first_name: string().optional(),
  last_name: string().optional(),
});

 
export type UserProfileSchemaType = InferType<typeof UserProfileSchema>;

