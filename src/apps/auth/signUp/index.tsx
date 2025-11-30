import {
  Box,
  Flex,
  Heading,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useColorModeValue,
  Circle,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaUser, FaBuilding } from "react-icons/fa";
import { CustomerSignUp } from "./CustomerSignUp";
import { useState } from "react";
import { ProviderSignUp } from "./ProviderSignUp";
import { ProviderServiceTypesList } from "@suleigolden/sulber-api-client";

const TabOption = ({
  icon,
  title,
  description,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  description: string;
}) => (
  <VStack spacing={1} align="start" p={2}>
    <Flex align="center" gap={2}>
      <Circle size="32px" bg="brand.100" color="brand.500">
        <Icon as={icon} />
      </Circle>
      <Text fontWeight="600" fontSize="lg">
        {title}
      </Text>
    </Flex>
    <Text color="gray.900" fontSize="xs" pl={10} maxW="400px">
      {/* {description} */}
    </Text>
  </VStack>
);

const AccountTypeDescription = ({
  type,
}: {
  type: "customer" | "provider";
}) => {
  const serviceTypes = ProviderServiceTypesList.services.map((service: { title: string }) => service.title);
  
  const descriptions = {
    customer: (
      <VStack spacing={3} align="start" p={4} bg="gray.50" borderRadius="md">
        <VStack spacing={2} align="start" pl={4}>
          <Text color="gray.700">
            <Text as="span" color="brand.500" fontWeight="bold">Request for trusted</Text> 
            {" "}<Text as="span" fontWeight="bold">{serviceTypes.join(', ')}</Text> 
           {" "}services</Text>
        </VStack>
      </VStack>
    ),
    provider: (
      <VStack spacing={3} align="start" p={4} bg="gray.50" borderRadius="md">
        <VStack spacing={2} align="start" pl={4}>
          <Text color="gray.700"> 
            <Text as="span" color="brand.500" fontWeight="bold">Earn money with SulBer by offering trusted</Text> 
            {" "}<Text as="span" fontWeight="bold">{serviceTypes.join(', ')}</Text> 
            {" "}services.</Text>
        </VStack>
      </VStack>
    ),
  };

  return descriptions[type];
};

type SignUpProps = {
  onSignInClick?: () => void;
}

export const SignUp = ({ onSignInClick }: SignUpProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tabIndex, setTabIndex] = useState(0);
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const tabBg = useColorModeValue("gray.50", "gray.800");
  const activeTabBg = useColorModeValue("white", "gray.700");
  const serviceTypes = ProviderServiceTypesList.services.map((service: { title: string }) => service.title);

  return (
    <Box>
      <Text color="gray.700" fontWeight="400" fontSize="14px">
        Not registered yet?{" "}
        <Text
          color="brand.500"
          as="span"
          ms="5px"
          fontWeight="500"
          cursor="pointer"
          onClick={onOpen}
        >
          Create an Account
        </Text>
      </Text>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent p={5}>
        <ModalCloseButton />
          <ModalBody>
            <Flex
              direction="column"
              maxW="100%"
              background="white"
              borderRadius="20px"
              p={6}
            >
              <Box mb={8}>
                <Heading
                  color="gray.800"
                  fontSize="2xl"
                  mb={3}
                  fontWeight="700"
                >
                  Sign up to SulBer 
                </Heading>
              </Box>

              <Tabs index={tabIndex} onChange={setTabIndex} isLazy>
                <TabList
                  bg={tabBg}
                  borderRadius="xl"
                  p={1}
                  gap={2}
                  border="1px solid"
                  borderColor={borderColor}
                  mb={6}
                >
                   <Tab
                    py={4}
                    flex={1}
                    borderRadius="lg"
                    _selected={{
                      bg: activeTabBg,
                      boxShadow: "md",
                      border: "1px solid",
                      borderColor: "brand.500",
                    }}
                    transition="all 0.2s"
                  >
                    <TabOption
                      icon={FaUser}
                      title="Customer Account"
                      description={`Request for ${serviceTypes.join(', ')} services in minutes`}
                    />
                  </Tab>
                  <Tab
                    py={4}
                    flex={1}
                    borderRadius="lg"
                    _selected={{
                      bg: activeTabBg,
                      boxShadow: "md",
                      border: "1px solid",
                      borderColor: "brand.500",
                    }}
                    transition="all 0.2s"
                  >
                    <TabOption
                      icon={FaBuilding}
                      title="Provider Account"
                      description={`Earn money with SulBer by offering trusted ${serviceTypes.join(', ')} services`}
                    />
                  </Tab>
                </TabList>

                <Box mb={6}>
                  {tabIndex === 0 ? (
                    <AccountTypeDescription type="customer" />
                  ) : (
                    <AccountTypeDescription type="provider" />
                  )}
                </Box>

                <TabPanels>
                  <TabPanel px={0}>
                  <CustomerSignUp />
                  </TabPanel>
                  <TabPanel px={0}>
                  <ProviderSignUp />
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                maxW="100%"
                mt={6}
              >
                <Text color="gray.700" fontWeight="400" fontSize="14px">
                  Already have an account?{" "}
                  <Text
                    color="brand.500"
                    as="span"
                    ms="5px"
                    fontWeight="500"
                    cursor="pointer"
                    onClick={() => {
                      onClose();
                      onSignInClick?.();
                    }}
                  >
                    Sign in
                  </Text>
                </Text>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
