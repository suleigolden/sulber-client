import { InferType, object, string } from "yup";

export const LoginSchema = object().shape({
  email: string().email('Invalid email').required('Email is required'),
  password: string().required('Password is required')
});

export type LoginSchemaType = InferType<typeof LoginSchema>;

