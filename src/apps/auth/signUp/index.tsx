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
  titleColor,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  description: string;
  titleColor: string;
}) => (
  <VStack spacing={1} align="start" p={2}>
    <Flex align="center" gap={2}>
      <Circle size="32px" bg="brand.100" color="brand.500">
        <Icon as={icon} />
      </Circle>
      <Text fontWeight="600" fontSize="lg" color={titleColor}>
        {title}
      </Text>
    </Flex>
    <Text color={titleColor} fontSize="xs" pl={10} maxW="400px" opacity={0.9}>
      {/* {description} */}
    </Text>
  </VStack>
);

const AccountTypeDescription = ({
  type,
  boxBg,
  textColor,
}: {
  type: "customer" | "provider";
  boxBg: string;
  textColor: string;
}) => {
  const serviceTypes = ProviderServiceTypesList.services.map((service: { title: string }) => service.title);

  const descriptions = {
    customer: (
      <VStack spacing={3} align="start" p={4} bg={boxBg} borderRadius="md">
        <VStack spacing={2} align="start" pl={4}>
          <Text color={textColor}>
            <Text as="span" color="brand.500" fontWeight="bold">Request for trusted</Text>
            {" "}<Text as="span" fontWeight="bold">{serviceTypes.join(', ')}</Text>
            {" "}services</Text>
        </VStack>
      </VStack>
    ),
    provider: (
      <VStack spacing={3} align="start" p={4} bg={boxBg} borderRadius="md">
        <VStack spacing={2} align="start" pl={4}>
          <Text color={textColor}>
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
  const modalBg = useColorModeValue("white", "#0b1437");
  const headingColor = useColorModeValue("gray.800", "white");
  const footerTextColor = useColorModeValue("gray.700", "gray.300");
  const tabOptionTitleColor = useColorModeValue("gray.900", "gray.100");
  const descBoxBg = useColorModeValue("gray.50", "whiteAlpha.200");
  const descTextColor = useColorModeValue("gray.700", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const tabBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const activeTabBg = useColorModeValue("white", "whiteAlpha.200");
  const serviceTypes = ProviderServiceTypesList.services.map((service: { title: string }) => service.title);

  return (
    <Box>
      <Text color={footerTextColor} fontWeight="400" fontSize="14px">
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
        <ModalContent p={5} bg={modalBg}>
        <ModalCloseButton />
          <ModalBody>
            <Flex
              direction="column"
              maxW="100%"
              borderRadius="20px"
              p={6}
            >
              <Box mb={8}>
                <Heading
                  color={headingColor}
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
                      titleColor={tabOptionTitleColor}
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
                      titleColor={tabOptionTitleColor}
                    />
                  </Tab>
                </TabList>

                <Box mb={6}>
                  {tabIndex === 0 ? (
                    <AccountTypeDescription type="customer" boxBg={descBoxBg} textColor={descTextColor} />
                  ) : (
                    <AccountTypeDescription type="provider" boxBg={descBoxBg} textColor={descTextColor} />
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
                <Text color={footerTextColor} fontWeight="400" fontSize="14px">
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
