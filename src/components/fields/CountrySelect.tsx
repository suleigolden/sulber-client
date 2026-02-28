import { Box, FormControl, FormLabel, FormErrorMessage, useColorModeValue } from '@chakra-ui/react';
import { Controller, Control } from 'react-hook-form';
import ReactSelect from 'react-select';
import CountryList from 'react-select-country-list';
import ReactCountryFlag from 'react-country-flag';

type CountrySelectProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label?: string;
  error?: string;
  isRequired?: boolean;
}

const options = CountryList().getData().map(option => ({
  ...option,
  flag: option.value,
}));

export const CountrySelect = ({
  control,
  name,
  label = "Country",
  error,
  isRequired
}: CountrySelectProps) => {
  const labelColor = useColorModeValue(undefined, '#FFF');
  const controlBorder = useColorModeValue('#E2E8F0', 'rgba(255,255,255,0.3)');
  const controlBg = useColorModeValue('white', '#0b1437');
  const menuBg = useColorModeValue('white', '#0b1437');
  const optionColor = useColorModeValue('gray.800', '#FFF');
  const optionHoverBg = useColorModeValue('gray.50', 'rgba(255,255,255,0.1)');
  const singleValueColor = useColorModeValue('gray.800', '#FFF');
  const inputColor = useColorModeValue('gray.800', '#FFF');
  const placeholderColor = useColorModeValue('#718096', '#FFF');
  const menuBorderColor = useColorModeValue('#E2E8F0', 'rgba(255,255,255,0.3)');

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <FormLabel color={labelColor}>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        rules={{ required: isRequired && 'Country is required' }}
        render={({ field: { onChange, value, ref } }) => (
          <ReactSelect
            ref={ref}
            options={options}
            value={options.find(option => option.value === value) || null}
            onChange={(option) => onChange(option?.value)}
            placeholder="Select a country"
            formatOptionLabel={(option) => (
              <Box display="flex" alignItems="center" color={optionColor}>
                <ReactCountryFlag
                  countryCode={option.flag}
                  svg
                  style={{
                    width: '1.5em',
                    height: '1.5em',
                    marginRight: '8px',
                  }}
                  title={option.label}
                />
                <span>{option.label}</span>
              </Box>
            )}
            isSearchable
            styles={{
              control: (base) => ({
                ...base,
                borderColor: controlBorder,
                backgroundColor: controlBg,
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: menuBg,
                border: `1px solid ${menuBorderColor}`,
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? optionHoverBg : menuBg,
                color: optionColor,
              }),
              singleValue: (base) => ({
                ...base,
                color: singleValueColor,
              }),
              input: (base) => ({
                ...base,
                color: inputColor,
              }),
              placeholder: (base) => ({
                ...base,
                color: placeholderColor,
              }),
            }}
          />
        )}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}; 