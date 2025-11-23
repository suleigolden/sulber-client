import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Icon,
  Button,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { RenterSignUpSchema } from './schema';
import { CountrySelect } from '../../../components/fields/CountrySelect';
import { registerUser } from '../../../redux-action/slices/auth-slice';
import { RegisterRequest, User } from '@suleigolden/co-renting-api-client';
import { useDispatch } from 'react-redux';
import { useLogInNavigation } from '../../../hooks/use-login-navigation';
import { AppDispatch } from '../../../redux-action/store';
import { CustomToast } from '../../../hooks/CustomToast';
import { TermsCheckbox } from '../../../components/fields/TermsCheckbox';

export const RenterSignUp = () => {
  const [show, setShow] = useState<boolean>(false);
  const handleClick = () => setShow(!show);
  const [isEmailExists, setIsEmailExists] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const { navigateToDashboard } = useLogInNavigation('signup');
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm<RenterSignUpSchema>({
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      country: '',
    },
  });
  const showToast = CustomToast();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        role: 'renter',
      };
      const res = await dispatch(registerUser(payload as RegisterRequest));

      if (res.meta.requestStatus === 'fulfilled') {
        await navigateToDashboard(res.payload as User);
      } else {
        const errorMessage = res.payload as string;
        showToast('Sign Up', errorMessage, 'error');
        if (
          typeof errorMessage === 'string' &&
          errorMessage.includes('Email')
        ) {
          setIsEmailExists(errorMessage);
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      showToast('Sign Up', error.message, 'error');
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl isInvalid={!!errors.first_name}>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            {...register('first_name', {
              required: 'First name is required',
            })}
            placeholder="Enter your first name"
          />
          <FormErrorMessage>
            {errors.first_name && errors.first_name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.last_name}>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            {...register('last_name', {
              required: 'Last Name is required',
            })}
            placeholder="Last name"
          />
          <FormErrorMessage>
            {errors.last_name && errors.last_name.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Invalid email address',
              },
            })}
            placeholder="Email"
            onKeyUp={() => setIsEmailExists('')}
          />
          <Text
            as={'span'}
            color="red.500"
            display="flex"
            flexDirection="column"
            gap={2}
          >
            {errors.email && errors.email.message}
            {isEmailExists && isEmailExists}
          </Text>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <InputRightElement>
              <Icon
                as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                color="gray.400"
                cursor="pointer"
                onClick={handleClick}
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <CountrySelect
          control={control}
          name="country"
          error={errors.country?.message}
          isRequired
        />

        <TermsCheckbox 
          register={register} 
          error={errors.acceptTerms?.message}
        />

        <Button
          type="submit"
          colorScheme="brand"
          size="lg"
          fontSize="md"
          isLoading={isSubmitting}
          w="100%"
          mt={4}
        >
          Create Renter Account
        </Button>
      </Stack>
    </Box>
  );
};
