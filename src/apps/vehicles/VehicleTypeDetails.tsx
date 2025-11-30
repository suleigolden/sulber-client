import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { VehicleTypesList } from "@suleigolden/sulber-api-client";

type VehicleTypeDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const VehicleTypeDetails = ({ isOpen, onClose }: VehicleTypeDetailsProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "2xl" }} isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">Vehicle Types</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {VehicleTypesList.map((vehicleType) => (
              <Box
                key={vehicleType.type}
                p={{ base: 4, sm: 5 }}
                bg="white"
                borderWidth="1px"
                borderRadius="lg"
                borderColor="gray.200"
                _hover={{ boxShadow: "md", borderColor: "brand.300" }}
                transition="all 0.2s"
              >
                <VStack align="start" spacing={3}>
                  <HStack spacing={3} flexWrap="wrap">
                    <Heading size={{ base: "sm", sm: "md" }} fontWeight="semibold">
                      {vehicleType.title}
                    </Heading>
                    {/* <Badge
                      colorScheme="purple"
                      variant="subtle"
                      fontSize={{ base: "xs", sm: "sm" }}
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      ${vehicleType.price}
                    </Badge> */}
                  </HStack>
                  
                  <Text fontSize={{ base: "sm", sm: "md" }} color="gray.600" lineHeight="tall">
                    {vehicleType.description}
                  </Text>

                  {vehicleType.examples && vehicleType.examples.length > 0 && (
                    <Box w="full">
                      <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="medium" color="gray.700" mb={2}>
                        Examples:
                      </Text>
                      <HStack spacing={2} flexWrap="wrap">
                        {vehicleType.examples.map((example, index) => (
                          <Badge
                            key={index}
                            colorScheme="blue"
                            variant="outline"
                            fontSize={{ base: "xs", sm: "sm" }}
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            {example}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </Box>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};