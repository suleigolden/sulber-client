import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { HSeparator } from '../../../components/separator/Separator';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux-action/store';
import { CustomToast } from '../../../hooks/CustomToast';
import { AuthRequest, User } from '@suleigolden/co-renting-api-client';
import { useLogInNavigation } from '../../../hooks/use-login-navigation';
import { authenticate } from '../../../redux-action/slices/auth-slice';
import { LoginSchema, LoginSchemaType } from './schema';
import { SignUp } from '../signUp';


type SignInProps = {
  onClose?: () => void;
}

export const SignIn = ({ onClose }: SignInProps) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const showToast = CustomToast();
  const { navigateToDashboard } = useLogInNavigation();

  const dispatch = useDispatch<AppDispatch>();

  const methods = useForm<LoginSchemaType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver<LoginSchemaType, any, any>(LoginSchema),
    mode: 'onBlur'
  });

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(data: LoginSchemaType) {
    try {
      const res = await dispatch(authenticate(data as AuthRequest));
      await navigateToDashboard(res.payload as User);
      onClose?.();
    } catch (error) {
      showToast('Login', (error as Error).message, 'error');
      console.error(error);
    }
  }


  return (
    <Flex
      maxW="100%"
      w="100%"
      mx="auto"
      alignItems="center"
      justifyContent="center"
      px={{ base: '25px', md: '0px' }}
      flexDirection="column"
    >
      <Flex
        zIndex="2"
        direction="column"
        w="100%"
        maxW="100%"
        background="white"
        borderRadius="20px"
        mx="auto"
        p={9}
      >
        <Box me="auto">
          <Heading
            color="navy.700"
            fontSize="36px"
            mb="10px"
            fontWeight="700"
          >
            Sign in to your account
          </Heading>
        </Box>
        <FormProvider {...methods}>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color="navy.700"
                mb="8px"
                htmlFor="email-input"
              >
                Email<Text color="brand.500">*</Text>
              </FormLabel>
              <Input
                id="email-input"
                isRequired
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="email"
                placeholder="Enter your email"
                mb="24px"
                fontWeight="500"
                size="lg"
                {...register('email')}
              />
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color="navy.700"
                display="flex"
                htmlFor="password-input"
              >
                Password<Text color="brand.500">*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  id="password-input"
                  isRequired
                  fontSize="sm"
                  placeholder="Min. 8 characters"
                  mb="24px"
                  size="lg"
                  type={show ? 'text' : 'password'}
                  {...register('password')}
                />
                <InputRightElement
                  display="flex"
                  alignItems="center"
                  mt="4px"
                >
                  <Icon
                    color="gray.400"
                    _hover={{ cursor: 'pointer' }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <Flex justifyContent="space-between" align="center" mb="24px">
                <FormControl display="flex" alignItems="center">
                  <Checkbox
                    id="remember-login"
                    colorScheme="brandScheme"
                    me="10px"
                  />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="0"
                    fontWeight="normal"
                    color="navy.700"
                    fontSize="sm"
                  >
                    Keep me logged in
                  </FormLabel>
                </FormControl>
                <NavLink to="/auth/forgot-password">
                  <Text
                    color="brand.500"
                    fontSize="sm"
                    w="124px"
                    fontWeight="500"
                  >
                    Forgot password?
                  </Text>
                </NavLink>
              </Flex>
              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                type="submit"
                isLoading={isSubmitting}
                loadingText="Signing in..."
                _hover={{
                  bg: 'brand.600',
                  transform: 'translateY(-1px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s ease"
              >
                Sign In
              </Button>
            </FormControl>
          </Box>
        </FormProvider>
        <Flex align="center" mb="25px">
          <HSeparator />
          <Text color="gray.500" mx="14px">
            or
          </Text>
          <HSeparator />
        </Flex>
        <Button
          fontSize="sm"
          mb="26px"
          py="15px"
          h="50px"
          borderRadius="16px"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          _hover={{ bg: 'gray.50' }}
          _active={{ bg: 'white' }}
          _focus={{ boxShadow: 'none' }}
          // onClick={() => handleGoogleSignIn()}
          isLoading={isSubmitting}
          loadingText="Signing in with Google..."
        >
          <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
          Sign in with Google
        </Button>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          maxW="100%"
          mt="0px"
        >
         <SignUp />
        </Flex>
      </Flex>
    </Flex>
  );
};
