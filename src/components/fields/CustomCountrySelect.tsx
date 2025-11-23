import { FC } from "react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import Select from "react-select";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { allCountries } from "common/utils/countryAndStates";
import { useSystemColor } from "hooks/use-system-color";

export const customSelectStyles = {
  clearIndicator: (provided: any) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#000",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none",
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    border: state.isFocused ? "1px solid #309aba" : "",
    borderColor: state.isFocused ? "#309aba" : "#000",
    boxShadow: state.isFocused ? "0 0 0 1px #309aba" : "none",
    ":hover": {
      borderColor: "#309aba",
    },
  }),
};

type CustomCountrySelectProps = {
  label?: string;
  country: string;
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  field: string;
};

export const CustomCountrySelect: FC<CustomCountrySelectProps> = ({
  label = "Country",
  country,
  setValue,
  register,
  field,
}) => {
  const { secondaryTextColor } = useSystemColor();
  // const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
	// const inputText = useColorModeValue('gray.700', 'gray.100');
  
  return (
    <FormControl isRequired>
      <FormLabel color={secondaryTextColor}>{label}</FormLabel>
      <Select
        placeholder="Select Country"
        {...register(field)}
        value={country ? { value: country, label: country } : null}
        onChange={(selectedOption) =>
          setValue(field, selectedOption?.value ?? "")
        }
        options={allCountries.map((country) => ({
          value: country.name,
          label: country.name,
        }))}
        isClearable
        isSearchable
        styles={customSelectStyles}
      />
    </FormControl>
  );
};
