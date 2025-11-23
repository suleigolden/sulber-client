import {
  Box,
  Heading,
  Text,
  VStack,
  Textarea,
  FormControl,
  FormErrorMessage,
  SimpleGrid,
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { usePropertyOnboarding } from "~/hooks/use-property-onboarding";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { PriceInput } from './components/PriceInput';
import { PropertyTypes, BuildingTypes } from "~/common/constants/listing-bilder-constants";
import { PropertyTypeCard, BuildingTypeCard } from "~/common/utils/Listing-builder-mini";



export const ManagingYourProperty = forwardRef(
  (
    props: { onNext?: () => void },
    ref: React.ForwardedRef<{ submitForm: () => Promise<void> }>,
  ) => {
    const { methods, handleSubmit } = usePropertyOnboarding(true);
    const {
      control,
      formState: { errors },
      watch,
      setValue,
    } = methods;

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit,
    }));

    const selectedPropertyType = watch("property_type");
    const selectedBuildingType = watch("building_type");
    const listingType = watch("listing_type");

    return (
      <FormProvider {...methods}>
        <VStack
          align="start"
          spacing={8}
          w="full"
          maxW="900px"
          p={8}
          bg="white"
        >
          <Box>
            <Heading size="lg">Tell us about your property</Heading>
            <Text fontSize="md" color="gray.600" mt={2}>
              Share some basic info about your place
            </Text>
          </Box>

          {/* Title Section */}
          <FormControl isInvalid={!!errors.title}>
            <Heading size="md" mb={1}>
              Give your property a title
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={3}>
              Short titles work best. This will show up in searches and at the
              top of your listing.
            </Text>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Box>
                  <Textarea
                    {...field}
                    maxLength={37}
                    placeholder="e.g., 3 bedroom apartment in downtown"
                    resize="none"
                    height="80px"
                    borderRadius="lg"
                    _focus={{
                      borderColor: "brand.400",
                      boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)",
                    }}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {field.value?.length || 0}/37
                  </Text>
                </Box>
              )}
            />
            <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
          </FormControl>

         

          {/* Property Type Section */}
          <FormControl isInvalid={!!errors.property_type}>
            <Heading size="md" mb={4}>
              What type of place will guests have?
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {PropertyTypes.map((type) => (
                <PropertyTypeCard
                  key={type.value}
                  value={type.value}
                  icon={type.icon}
                  description={type.description}
                  isSelected={selectedPropertyType === type.value}
                  onClick={() => setValue("property_type", type.value)}
                />
              ))}
            </SimpleGrid>
            <FormErrorMessage>{errors.property_type?.message}</FormErrorMessage>
          </FormControl>

          {/* Building Type Section */}
          <FormControl isInvalid={!!errors.building_type}>
            <Heading size="md" mb={4}>
              What's your building type?
            </Heading>
            <SimpleGrid columns={{ base: 2, sm: 3, md: 6 }} spacing={4}>
              {BuildingTypes.map((type) => (
                <BuildingTypeCard
                  key={type.value}
                  value={type.value}
                  icon={type.icon}
                  isSelected={selectedBuildingType === type.value}
                  onClick={() => setValue("building_type", type.value)}
                />
              ))}
            </SimpleGrid>
            <FormErrorMessage>{errors.building_type?.message}</FormErrorMessage>
          </FormControl>

          {/* Description Section */}
          <FormControl isInvalid={!!errors.description}>
            <Heading size="md" mb={1}>
              Create your description
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={3}>
              Share what makes your place special
            </Text>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Box>
                  <SunEditor
                    {...field}
                    setContents={field.value}
                    onChange={(content) => {
                      // Strip HTML tags to count actual text length
                      const textContent = content.replace(/<[^>]*>/g, '');
                      if (textContent.length <= 5000) {
                        field.onChange(content);
                      }
                    }}
                    setOptions={{
                      height: "300px",
                      buttonList: [
                        ["undo", "redo"],
                        ["formatBlock"],
                        ["bold", "underline", "italic", "strike"],
                        ["fontColor", "hiliteColor"],
                        ["list", "align"],
                        ["fullScreen"]
                      ],
                      formats: ["p", "h3", "h4"],
                      font: ["Arial", "Helvetica", "sans-serif"],
                      placeholder: "Describe what makes your property unique...",
                    }}
                    setDefaultStyle="font-family: Arial, Helvetica, sans-serif; font-size: 16px; padding: 20px;"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {(field.value?.replace(/<[^>]*>/g, '') || '').length}/5000
                  </Text>
                </Box>
              )}
            />
            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
          </FormControl>

           {/* Price Input Section */}
           <Box w="full">
            <PriceInput 
              control={control}
              listingType={listingType || 'rent'}
              errors={errors}
            />
          </Box>
        </VStack>
      </FormProvider>
    );
  },
);
