import { InferType, object, string } from "yup";

export const ProviderSignUpSchema = object({
  first_name: string().required().label("First Name"),
  last_name: string().required().label("Last Name"),
  email: string().required().email("Must be a valid email").label("Email"),
  password: string().required().label("Password"),
  country: string().required().label("Country"),
  acceptTerms: string().oneOf(["true"], "You must accept the terms and conditions").label("Accept Terms"),
});

export const CustomerSignUpSchema = object({
  first_name: string().required().label("First Name"),
  last_name: string().required().label("Last Name"),
  email: string().required().email("Must be a valid email").label("Email"),
  password: string().required().label("Password"),
  country: string().required().label("Country"),
  acceptTerms: string().oneOf(["true"], "You must accept the terms and conditions").label("Accept Terms"),
});

 
export type ProviderSignUpSchema = InferType<typeof ProviderSignUpSchema>;

 
export type CustomerSignUpSchema = InferType<typeof CustomerSignUpSchema>;


