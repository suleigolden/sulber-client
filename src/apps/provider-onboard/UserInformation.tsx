import {
    Box,
    Flex,
    Heading,
    Text,
    VStack,
    IconButton,
    Spacer,
    SimpleGrid,
    Card,
    CardBody,
    Icon,
  } from "@chakra-ui/react";
  import { AddIcon, MinusIcon } from "@chakra-ui/icons";
  import { forwardRef, useImperativeHandle } from "react";
  import { Controller, FormProvider } from "react-hook-form";
  import { usePropertyOnboarding } from "~/hooks/use-property-onboarding";
  import { FaHome } from "react-icons/fa";
  import { BsFillHouseFill } from "react-icons/bs";
  
  type UserInformationProps = {
    onNext?: () => void;
  };
  
  type ListingTypeOption = {
    value: string;
    label: string;
    description: string;
    icon: typeof FaHome;
  };
  
  const listingTypes: ListingTypeOption[] = [
    {
      value: "rent",
      label: "For Rent",
      description: "List your property for rental to potential tenants",
      icon: FaHome,
    },
    {
      value: "sell",
      label: "For Sale",
      description: "List your property for sale to potential buyers",
      icon: BsFillHouseFill,
    },
  ];
  
  export const UserInformation = forwardRef<
    { submitForm: () => Promise<void> },
    UserInformationProps
  >(({ onNext }, ref) => {
    const { methods, handleSubmit } = usePropertyOnboarding();
    const {
      control,
      setValue,
      watch,
    } = methods;
  
    const guests = watch("num_of_tenants_or_owners_needed") || 1;
    const bedrooms = watch("number_of_bedrooms") || 1;
    const bathrooms = watch("number_of_bathrooms") || 1;
    const selectedListingType = watch("listing_type");
  
    const createCounter = (label: string, name: string, value: number) => (
      <Flex w="full" align="center" py={4} borderBottom="1px solid #E2E8F0">
        <Text fontSize="md" fontWeight="medium">
          {label}
        </Text>
        <Spacer />
        <Flex align="center" gap={4}>
          <IconButton
            aria-label="decrement"
            icon={<MinusIcon />}
            size="sm"
            variant="outline"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setValue(name as any, Math.max(1, value - 1))}
          />
          <Text fontSize="md" fontWeight="semibold" minW="4" textAlign="center">
            {value}
          </Text>
          <IconButton
            aria-label="increment"
            icon={<AddIcon />}
            size="sm"
            variant="outline"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setValue(name as any, value + 1)}
          />
        </Flex>
      </Flex>
    );
  
    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit()
    }));
  
    return (
      <FormProvider {...methods}>
        <VStack
          spacing={8}
          align="start"
          w="full"
          p={8}
          maxW="900px"
        >
          <Box>
            <Heading size="lg" mb={2}>
              Share information about your property 
            </Heading>
            <Text fontSize="md" color="gray.600">
             Please provide your property's basics details to get started.
            </Text>
          </Box>
  
          <Box w="full">
            <Text fontSize="md" fontWeight="medium" mb={4}>
              What type of listing is this?
            </Text>
            <Controller
              name="listing_type"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                  {listingTypes.map((type) => (
                    <Card
                      key={type.value}
                      cursor="pointer"
                      variant="outline"
                      bg={field.value === type.value ? "blue.50" : "white"}
                      borderColor={field.value === type.value ? "blue.500" : "gray.200"}
                      _hover={{
                        borderColor: "blue.500",
                        transform: "translateY(-2px)",
                        transition: "all 0.2s",
                      }}
                      onClick={() => field.onChange(type.value)}
                    >
                      <CardBody>
                        <VStack spacing={3} align="start">
                          <Icon
                            as={type.icon}
                            boxSize={6}
                            color={field.value === type.value ? "blue.500" : "gray.500"}
                          />
                          <Text fontWeight="semibold">{type.label}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {type.description}
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            />
          </Box>
  
          {selectedListingType && (
            <>
              <Controller
                name="num_of_tenants_or_owners_needed"
                control={control}
                defaultValue={4}
                render={() => createCounter(
                  selectedListingType === "SELL" ? "Number of owners needed" : "Number of tenants needed",
                  "num_of_tenants_or_owners_needed",
                  guests
                )}
              />
              <Controller
                name="number_of_bedrooms"
                control={control}
                defaultValue={1}
                render={() => createCounter("Bedrooms", "number_of_bedrooms", bedrooms)}
              />
              <Controller
                name="number_of_bathrooms"
                control={control}
                defaultValue={1}
                render={() => createCounter("Bathrooms", "number_of_bathrooms", bathrooms)}
              />
            </>
          )}
        </VStack>
      </FormProvider>
    );
  });
  