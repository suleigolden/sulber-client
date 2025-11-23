import { Box, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
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
  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
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
              <Box display="flex" alignItems="center">
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
                border: '1px solid #000',
              }),
            }}
          />
        )}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}; 