import * as yup from 'yup';

export const ContactUsValidationSchema = yup.object().shape({
    subject: yup.string().required('Subject is required'),
    fullName: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    message: yup.string().required('Message is required'),
  });
  export type ContactUsSchema = yup.InferType<typeof ContactUsValidationSchema>;      