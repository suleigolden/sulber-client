import { Text } from "@chakra-ui/react";
import { FC } from "react";

type CustomLabelProps = {
  label: string;
  as?: "a" | "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color?: string;
};

export const CustomLabel: FC<CustomLabelProps> = ({ label, as = "span", color = "gray.900" }) => {
  return (
    <Text as={as} color={color} fontWeight={777}>
      {label}
    </Text>
  );
};
