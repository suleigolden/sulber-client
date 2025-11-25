import {
  Box,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle } from "react";
import {  FormProvider } from "react-hook-form";
import { CountrySelect } from "~/components/fields/CountrySelect";
import { CustomInputField } from "~/components/fields/CustomInputField";
import { usePropertyOnboarding } from "~/hooks/use-provider-onboarding";

type ProviderLocationProps = {
  onNext?: () => void;
};

export const ProviderLocation = forwardRef(
  (
    props: ProviderLocationProps,
    ref: React.ForwardedRef<{ submitForm: () => Promise<void> }>
  ) => {
    const { methods, handleSubmit } = usePropertyOnboarding();
    const {
      control,
      formState: { errors },
    } = methods;

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit,
    }));

    return (
      <FormProvider {...methods}>
        <VStack
          spacing={6}
          align="start"
          w="full"
          maxW="600px"
          p={8}
          bg="white"
        >
          <Box>
            <Heading size="lg" mb={2}>
              Where's your  property located?
            </Heading>
            <Text fontSize="md" color="gray.600">
              Your address is only shared with co-owners or co-tenants after they’ve made a request.
            </Text>
          </Box>

          <CustomInputField
              type="text"
              label="Street Address"
              registerName="address.street"
              isRequired={true}
              isError={errors?.address?.street}
            />
            <CountrySelect
              control={control}
              name="address.country"
              error={errors?.address?.country?.message}
              isRequired
            />
            <CustomInputField
              type="text"
              label="Province/State"
              registerName="address.state"
              isRequired={true}
              isError={errors?.address?.state}
            />
            <CustomInputField
              type="text"
              label="City"
              registerName="address.city"
              isRequired={true}
              isError={errors?.address?.city}
            />
            <CustomInputField
              type="text"
              label="Postal Code"
              registerName="address.postal_code"
              isRequired={true}
              isError={errors?.address?.postal_code}
            />
        </VStack>
      </FormProvider>
    );
  }
);
