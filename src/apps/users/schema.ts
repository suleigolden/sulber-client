import { array, InferType, object, string } from "yup";

export const LandlordProfileSchema = object({
  first_name: string().required().label("First Name"),
  last_name: string().required().label("Last Name"),
  contact_email: string().required().email("Must be a valid email").label("Email"),
  contact_phone: string().required().label("Phone"),
  description: string().required().label("Description"),
  address: object().shape({
    street: string().optional(),
    city: string().optional(),
    state: string().optional(),
    country: string().optional(),
    postal_code: string().optional(),
  }).optional(),
  website: string().optional(),
});

export const RenterProfileSchema = object({
  first_name: string().required().label("First Name"),
  last_name: string().required().label("Last Name"),
  bio: string().optional(),
  mobile: string().optional(),
  has_pets: string().optional(),
  my_work: string().optional(),
  my_school: string().optional(),
  my_goals: string().optional(),
  my_interests: array().of(string()).optional(),
  my_skills: array().of(string()).optional(),
  my_fun_facts: string().optional(),
  address: object().shape({
    street: string().optional(),
    city: string().optional(),
    state: string().optional(),
    country: string().optional(),
    postal_code: string().optional(),
  }).optional(),
});

export type LandlordProfileSchema = InferType<typeof LandlordProfileSchema>;
export type RenterProfileSchema = InferType<typeof RenterProfileSchema>;


