import {
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  SimpleGrid,
  Text,
  FormErrorMessage,
  VStack,
  Box,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { ProviderOnboardingSchemaType } from "../schema";
import { useCallback } from "react";
import { FaDollarSign } from "react-icons/fa";

type PriceInputProps = {
  control: Control<ProviderOnboardingSchemaType>;
  listingType: string;
  errors: FieldErrors<ProviderOnboardingSchemaType>;
};

const currencies = [
  { value: "CAD", symbol: "$", label: "CAD", flag: "🇨🇦" },
  { value: "USD", symbol: "$", label: "USD", flag: "🇺🇸" },
  { value: "EUR", symbol: "€", label: "EUR", flag: "🇪🇺" },
];

export const PriceInput = ({ control, listingType, errors }: PriceInputProps) => {
  const isRental = listingType === "rent";
  const label = isRental ? "Monthly Rent" : "Selling Price";
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const boxBg = useColorModeValue("gray.50", "gray.700");
  const boxBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const inputBg = useColorModeValue("white", "gray.800");
  const iconColor = useColorModeValue("gray.500", "gray.400");

  const formatNumber = useCallback((value: string) => {
    // Remove any existing commas and non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Split number into integer and decimal parts
    const [integerPart, decimalPart] = cleanValue.split('.');
    
    // Add commas to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Return formatted number with decimal part if it exists
    return decimalPart !== undefined 
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  }, []);

  const parseNumber = useCallback((value: string) => {
    // Remove commas and convert to number
    return Number(value.replace(/,/g, ''));
  }, []);

  return (
    <FormControl isInvalid={!!errors.monthly_rent_or_sell_amount}>
      <VStack align="start" spacing={4} w="full">
        <Box>
          <Heading size="md" mb={1}>
            {label}
          </Heading>
          <Text fontSize="sm" color={mutedColor}>
            {isRental
              ? "Set the monthly rental amount for your property"
              : "Set the selling price for your property"}
          </Text>
        </Box>

        <Box
          w="full"
          p={6}
          bg={boxBg}
          borderRadius="xl"
          border="1px solid"
          borderColor={boxBorder}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box>
              <FormLabel fontSize="sm" color={labelColor}>
                Amount
              </FormLabel>
              <Controller
                name="monthly_rent_or_sell_amount.amount"
                control={control}
                render={({ field }) => (
                  <InputGroup size="lg">
                    <InputLeftElement
                      pointerEvents="none"
                      children={<FaDollarSign color={iconColor} />}
                    />
                    <Input
                      {...field}
                      bg={inputBg}
                      value={field.value ? formatNumber(field.value.toString()) : ''}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        if (rawValue === '') {
                          field.onChange('');
                          return;
                        }
                        const numericValue = parseNumber(rawValue);
                        if (!isNaN(numericValue)) {
                          field.onChange(numericValue);
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value) {
                          const numericValue = parseNumber(value);
                          field.onChange(numericValue);
                        }
                      }}
                      placeholder="0.00"
                      type="text"
                      fontSize="lg"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    />
                  </InputGroup>
                )}
              />
            </Box>

            <Box>
              <FormLabel fontSize="sm" color={labelColor}>
                Currency
              </FormLabel>
              <Controller
                name="monthly_rent_or_sell_amount.currency"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="lg"
                    bg={inputBg}
                    fontSize="lg"
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                    }}
                  >
                    {currencies.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.flag} {currency.label}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </Box>
          </SimpleGrid>

          {isRental && (
            <Text mt={4} fontSize="sm" color={mutedColor}>
              This is the amount your tenants will pay monthly
            </Text>
          )}
        </Box>

        <FormErrorMessage>
          {errors.monthly_rent_or_sell_amount?.message}
        </FormErrorMessage>
      </VStack>
    </FormControl>
  );
}; 