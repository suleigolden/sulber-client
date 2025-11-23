import { FC } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import Select from "react-select";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { customSelectStyles } from "./CustomCountrySelect";
import { getStateOptions } from "common/utils/helperFuntions";
import { useSystemColor } from "hooks/use-system-color";

type CustomStateSelectProps = {
  country: string;
  state: string;
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  field: string;
};

export const CustomStateSelect: FC<CustomStateSelectProps> = ({
  country,
  state,
  setValue,
  register,
  field,
}) => {
  const { secondaryTextColor } = useSystemColor();
  const stateOptions = getStateOptions(country ?? "Canada");
  const isCanadaOrUS = country === "Canada" || country === "United States";

  return (
    <FormControl isRequired>
      <FormLabel color={secondaryTextColor}>Province/State</FormLabel>
      {isCanadaOrUS ? (
        <Select
          placeholder="Select Province/State"
          {...register(field)}
          value={
            stateOptions.find((option) => option.value === state)
              ? { value: state, label: state }
              : null
          }
          onChange={(selectedOption) =>
            setValue(field, selectedOption?.value ?? "")
          }
          options={stateOptions}
          isClearable
          isSearchable
          styles={customSelectStyles}
        />
      ) : (
        <Input {...register(field)} placeholder="Province/State" />
      )}
    </FormControl>
  );
};
