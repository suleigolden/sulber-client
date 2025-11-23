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
import { RenterSignUp } from "./RenterSignUp";
import { useState } from "react";
import { LandlordSignUp } from "./LandlordSignUp";

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
    <Text color="gray.500" fontSize="sm" pl={10} maxW="400px">
      {description}
    </Text>
  </VStack>
);

const AccountTypeDescription = ({
  type,
}: {
  type: "owner" | "renter";
}) => {
  const descriptions = {
    owner: (
      <VStack spacing={3} align="start" p={4} bg="gray.50" borderRadius="md">
        <Text fontSize="md" fontWeight="medium" color="gray.700">
          As a owner, property manager or real estate professional you'll be able to:
        </Text>
        <VStack spacing={2} align="start" pl={4}>
          <Text color="gray.700">• List and manage your properties efficiently</Text>
          <Text color="gray.700">• Screen and communicate with potential co-owners and co-renters</Text>
          <Text color="gray.700">• Handle co-living and rental agreements and payments securely</Text>
          <Text color="gray.700">• Access detailed analytics and reporting tools</Text>
        </VStack>
      </VStack>
    ),
    renter: (
      <VStack spacing={3} align="start" p={4} bg="gray.50" borderRadius="md">
        <Text fontSize="md" fontWeight="medium" color="gray.700">
          As a Co-living Member, you'll be able to:
        </Text>
        <VStack spacing={2} align="start" pl={4}>
          <Text color="gray.700">• Find and connect with like-minded co-living partners</Text>
          <Text color="gray.700">• Share rental costs and responsibilities fairly</Text>
          <Text color="gray.700">• Access exclusive co-living properties and opportunities</Text>
          <Text color="gray.700">• Manage shared expenses and household arrangements</Text>
          <Text color="gray.700">• Build your co-living profile and references</Text>
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
                  Sign up to HomiShare 
                </Heading>
                <Text color="gray.700" fontSize="md">
                 Sign up and discover a better way to share living spaces
                </Text>
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
                      title="Co-living Member"
                      description="Perfect for individuals looking to share homes and split costs with compatible housemates"
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
                      title="Owner Account"
                      description="For owners, property managers, and real estate professionals"
                    />
                  </Tab>
                </TabList>

                <Box mb={6}>
                  {tabIndex === 0 ? (
                    <AccountTypeDescription type="owner" />
                  ) : (
                    <AccountTypeDescription type="renter" />
                  )}
                </Box>

                <TabPanels>
                  <TabPanel px={0}>
                  <RenterSignUp />
                  </TabPanel>
                  <TabPanel px={0}>
                  <LandlordSignUp />
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
