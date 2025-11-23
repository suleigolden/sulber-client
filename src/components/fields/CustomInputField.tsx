import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useColorModeValue,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FC } from "react";
import { FieldError, useFormContext } from "react-hook-form";

type CustomInputFieldProps = {
  type: "text" | "email" | "password" | "textarea" | "date" | "select" | "hidden";
  label: string;
  registerName: string;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isError?: FieldError | undefined;
  autoComplete?: string;
  options?: { label: string; value: string }[];
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  description?: string;
  isNumeric?: boolean;
};

export const CustomInputField: FC<CustomInputFieldProps> = ({
  type,
  label,
  registerName,
  isReadOnly,
  isRequired = false,
  isError,
  autoComplete,
  options,
  placeholder,
  onChange,
  description,
  isNumeric,
}) => {
  const { register, setValue } = useFormContext();
  
  const inputBg = useColorModeValue('white', 'navy.700');
  const inputBorder = useColorModeValue('gray.200', 'navy.600');
  const inputText = useColorModeValue('gray.800', 'white');
  const placeholderColor = useColorModeValue('gray.400', 'whiteAlpha.400');

  const commonStyles = {
    bg: inputBg,
    color: inputText,
    borderColor: inputBorder,
    borderWidth: "1px",
    borderRadius: "lg",
    _hover: {
      borderColor: 'brand.500',
    },
    _focus: {
      borderColor: 'brand.500',
      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
    },
    _disabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    _placeholder: {
      color: placeholderColor,
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumeric) {
      e.target.value = e.target.value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*?)\..*/g, "$1")
        .replace(/^(\d+)\.(\d{2}).*$/, "$1.$2");
    }
    if (onChange) onChange(e);
    setValue(registerName, e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isNumeric) {
      const numericValue = e.target.value.replace(/,/g, "");
      e.target.value = new Intl.NumberFormat().format(Number(numericValue));
    }
  };

  return (
    <FormControl 
      flex={1} 
      isRequired={isRequired}
      isInvalid={!!isError}
    >
      {type !== "hidden" && (
        <FormLabel 
          fontSize="sm"
          fontWeight="500"
          mb={2}
        >
          {label}
        </FormLabel>
      )}

      {type === "textarea" ? (
        <Textarea
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          {...register(registerName)}
          data-testid={registerName}
          isDisabled={isReadOnly}
          required={isRequired}
          onChange={onChange}
          minH="120px"
          {...commonStyles}
          border={"1px solid #000"}
        />
      ) : type === "select" ? (
        <Select
          placeholder={placeholder || `Select ${label.toLowerCase()}`}
          {...register(registerName)}
          data-testid={registerName}
          required={isRequired}
          onChange={onChange}
          isDisabled={isReadOnly}
          {...commonStyles}
          border={"1px solid #000"}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          type={type}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          {...register(registerName)}
          data-testid={registerName}
          isDisabled={isReadOnly}
          required={isRequired}
          autoComplete={autoComplete}
          onChange={handleChange}
          onBlur={handleBlur}
          h="40px"
          {...commonStyles}
          border={"1px solid #000"}
        />
      )}

      {description && !isError && (
        <FormHelperText color="gray.500" fontSize="xs" mt={1}>
          {description}
        </FormHelperText>
      )}

      {isError && (
        <FormErrorMessage fontSize="xs" mt={1}>
          {isError.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};
