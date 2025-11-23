import { FC } from 'react';
import { FormControl, FormLabel, Box } from '@chakra-ui/react';
import Select from 'react-select';
import { useFormContext, Controller, FieldError } from 'react-hook-form';
import { useSystemColor } from 'hooks/use-system-color';

type CustomSelectFieldProps = {
  label: string;
  registerName: string;
  options: { label: string; value: string }[];
  isRequired?: boolean;
  isError?: FieldError | undefined;
  placeholder?: string;
  onChange?: (selectedOption: any) => void;
};

export const CustomSelectField: FC<CustomSelectFieldProps> = ({
  label,
  registerName,
  options,
  isRequired = false,
  isError,
  placeholder,
  onChange
}) => {
  const { control } = useFormContext();
  const { secondaryTextColor } = useSystemColor();

  return (
    <FormControl isRequired={isRequired} mb={4}>
      <FormLabel color={secondaryTextColor}>{label}</FormLabel>
      <Controller
        name={registerName}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            value={options?.find((option) => option.value === field.value)}
            placeholder={placeholder || `Select ${label}`}
            isSearchable
            styles={{
              control: (provided, state) => ({
                ...provided,
                border: state.isFocused ? "1px solid #6868f7" : "",
                borderColor: state.isFocused ? "#6868f7" : "#000",
                boxShadow: state.isFocused ? "0 0 0 1px #6868f7" : "none",
                ":hover": {
                  borderColor: "#6868f7",
                },
                // backgroundColor: `${inputBg}`,
                // color: `${inputText}`
              }),
            }}
            onChange={(selectedOption) => {
              field.onChange(selectedOption?.value || '');
              if (onChange) onChange(selectedOption);
            }}
          />
        )}
      />
      <Box color="red.500" mt={2} fontSize="sm">
        {isError?.message}
      </Box>
    </FormControl>
  );
};
