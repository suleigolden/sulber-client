import { Checkbox, FormControl, FormErrorMessage, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

interface TermsCheckboxProps {
  register: any;
  error?: string;
}

export const TermsCheckbox = ({ register, error }: TermsCheckboxProps) => {
  return (
    <FormControl isInvalid={!!error}>
      <Checkbox
        {...register('acceptTerms', {
          required: 'You must accept the Terms and Privacy Policy to continue',
        })}
        colorScheme="brand"
        spacing={3}
      >
        <Text fontSize="sm" color="gray.600">
          I agree to the{' '}
          <Link as={RouterLink} to="/terms-of-service" color="#24a89d" fontWeight="medium">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link as={RouterLink} to="/privacy-policy" color="#24a89d" fontWeight="medium">
            Privacy Policy
          </Link>
        </Text>
      </Checkbox>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}; 