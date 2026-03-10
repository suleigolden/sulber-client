import {
  Box,
  VStack,
  Heading,
  Text,
  HStack,
  Circle,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { FormProvider } from "react-hook-form";
import { CustomInputField } from "~/components/fields/CustomInputField";
import { useProviderOnboarding } from "~/hooks/use-provider-onboarding";
import { LocationSearchInput } from "./components/LocationSearchInput";
import { OnboardingStepper } from "./OnboardingStepper";

type ProviderLocationProps = {
  onNext?: () => void;
  activeStep: number;
  steps: any;
  shouldDisplayStepper?: boolean;
  onLocationValidChange?: (isValid: boolean) => void;
};

export const ProviderLocation = forwardRef(
  (
    _props: ProviderLocationProps,
    ref: React.ForwardedRef<{ submitForm: () => Promise<void> }>
  ) => {
    const {
      methods,
      handleSubmit: submitOnboarding,
      isSubmitting,
      setValue,
      stepsNotCompleted,
    } = useProviderOnboarding();
    const userProfile = stepsNotCompleted?.userProfile;
    const [selectedLocation, setSelectedLocation] = useState<{
      lat: number;
      lng: number;
      address: string;
      city?: string;
      state?: string;
      country?: string;
      postal_code?: string;
    } | null>(null);
    const {
      formState: { errors },
      watch,
    } = methods;

    // Build address string from saved address
    const savedAddress = userProfile?.address;
    const addressString = savedAddress
      ? [
        savedAddress.street,
        savedAddress.city,
        savedAddress.state,
        savedAddress.country,
        savedAddress.postal_code,
      ]
        .filter(Boolean)
        .join(', ')
      : '';

    const locationInitialValue =
      savedAddress?.city !== "null" ? addressString : "";
    const [locationInputValue, setLocationInputValue] = useState<string>(
      locationInitialValue
    );

    // Watch address fields to determine if location is valid
    const addressCity = watch('address.city');
    const addressState = watch('address.state');
    const addressCountry = watch('address.country');
    const isLocationValid = locationInputValue.trim().length > 0;

    useImperativeHandle(ref, () => ({
      submitForm: submitOnboarding,
    }));

    // Notify parent component about location validity
    React.useEffect(() => {
      _props.onLocationValidChange?.(isLocationValid);
    }, [isLocationValid, _props]);

    React.useEffect(() => {
      setLocationInputValue(locationInitialValue);
    }, [locationInitialValue]);

    // Initialize form with saved address when component mounts
    React.useEffect(() => {
      if (savedAddress) {
        if (savedAddress.street) {
          setValue('address.street', savedAddress.street);
        }
        if (savedAddress.city) {
          setValue('address.city', savedAddress.city);
        }
        if (savedAddress.state) {
          setValue('address.state', savedAddress.state);
        }
        if (savedAddress.country) {
          setValue('address.country', savedAddress.country);
        }
        if (savedAddress.postal_code) {
          setValue('address.postal_code', savedAddress.postal_code);
        }
      }
    }, [savedAddress, setValue]);

    // Update form values when location is selected
    React.useEffect(() => {
      if (selectedLocation) {
        if (selectedLocation.city) {
          setValue('address.city', selectedLocation.city);
        }
        if (selectedLocation.state) {
          setValue('address.state', selectedLocation.state);
        }
        if (selectedLocation.country) {
          setValue('address.country', selectedLocation.country);
        }
        if (selectedLocation.postal_code) {
          setValue('address.postal_code', selectedLocation.postal_code);
        }
      }
    }, [selectedLocation, setValue]);

    const mutedColor = useColorModeValue("gray.600", "gray.400");

    return (
      <FormProvider {...methods}>
        <VStack spacing={8} align="center" w="full" >
          <Box
            w="full"
            maxW="720px"
            borderRadius="2xl"
          >
            {_props.shouldDisplayStepper && <OnboardingStepper activeStep={_props.activeStep} steps={_props.steps} />}
            <Box
              w="full"
              bg="brand.500"
              color="white"
              borderRadius="8px 8px 0 0"
              p={{ base: 6, md: 10 }}
            >

              <HStack spacing={4} align="center" >
                <Circle size="60px" bg="green.100" color="green.600">
                  <FaRegMoneyBillAlt size="28px" />
                </Circle>
                <Heading size="lg">Earn with SulBer</Heading>
              </HStack>
            </Box>
            <VStack 
            align="start" 
            spacing={6} 
            w="full" 
            p={{ base: 6, md: 10 }} 
            border="1px #333333 solid"
            borderRadius="0 0 8px 8px">
              <Text fontSize="md" color={mutedColor} mt={-7}>
                Select City, State, and Country to get started.
              </Text>
              <Text fontSize="md" color={mutedColor} mt={-3}>
                Primary earning location. Where do you want to offer your services?
              </Text>

              <VStack spacing={4} w="full">
                <LocationSearchInput
                  onLocationSelect={(location) => {
                    if (!location) {
                      setSelectedLocation(null);
                      setValue("address.street", "");
                      setValue("address.city", "");
                      setValue("address.state", "");
                      setValue("address.country", "");
                      setValue("address.postal_code", "");
                      return;
                    }
                    setSelectedLocation(location);
                  }}
                  initialValue={locationInitialValue}
                  onValueChange={setLocationInputValue}
                />
                <CustomInputField
                  type="text"
                  label="Referral code (optional)"
                  registerName="referral_code"
                  placeholder="Enter your SulBer referral code"
                  isError={errors?.referral_code}
                />
              </VStack>

              <Text fontSize="sm" color={mutedColor} lineHeight="tall">
                By proceeding, I agree that SulBer, its customers, and its representatives may contact me by
                email, phone, or SMS for service requests at this location.
              </Text>
            </VStack>
          </Box>
        </VStack>
      </FormProvider>
    );
  }
);
