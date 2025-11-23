import { Box, VStack, Icon, Text } from "@chakra-ui/react";


  export type PropertyTypeCardProps = {
    value: string;
    icon: React.ComponentType;
    description?: string;
    isSelected: boolean;
    onClick: () => void;
  };
  
  export function PropertyTypeCard({
    value,
    icon,
    description,
    isSelected,
    onClick,
  }: PropertyTypeCardProps) {
    return (
      <Box
        onClick={onClick}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="lg"
        borderColor={isSelected ? "brand.400" : "gray.200"}
        bg={isSelected ? "brand.50" : "white"}
        p={4}
        transition="all 0.2s"
        _hover={{
          transform: "translateY(-2px)",
          shadow: "md",
          borderColor: "brand.400",
        }}
      >
        <VStack spacing={3} align="start">
          <Icon
            as={icon}
            boxSize={6}
            color={isSelected ? "brand.500" : "gray.500"}
          />
          <Text fontWeight="semibold">{value}</Text>
          {description && (
            <Text fontSize="sm" color="gray.600">
              {description}
            </Text>
          )}
        </VStack>
      </Box>
    );
  }
  
  export function BuildingTypeCard({
    value,
    icon,
    isSelected,
    onClick,
  }: PropertyTypeCardProps) {
    return (
      <Box
        onClick={onClick}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        borderColor={isSelected ? "brand.400" : "gray.200"}
        bg={isSelected ? "brand.50" : "white"}
        p={3}
        transition="all 0.2s"
        _hover={{
          transform: "translateY(-2px)",
          shadow: "sm",
          borderColor: "brand.400",
        }}
      >
        <VStack spacing={2}>
          <Icon
            as={icon}
            boxSize={5}
            color={isSelected ? "brand.500" : "gray.500"}
          />
          <Text fontSize="sm" fontWeight="medium">
            {value}
          </Text>
        </VStack>
      </Box>
    );
  }