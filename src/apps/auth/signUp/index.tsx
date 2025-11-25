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
  type: "customer" | "provider";
}) => {
  const descriptions = {
    customer: (
      <VStack spacing={3} align="start" p={4} bg="gray.50" borderRadius="md">
        <Text fontSize="md" fontWeight="medium" color="gray.700">
          As a SulBer Customer you'll be able to:
        </Text>
        <VStack spacing={2} align="start" pl={4}>
          <Text color="gray.700">• Request trusted DRIVEWAY_CAR_WASH, SNOW_SHOVELING, or PARKING_LOT_CLEANING services</Text>
          <Text color="gray.700">• Compare providers, pricing, and availability in real time</Text>
          <Text color="gray.700">• Track service progress and communicate with your provider</Text>
          <Text color="gray.700">• Manage bookings, payments, and service history from one dashboard</Text>
        </VStack>
      </VStack>
    ),
    provider: (
      <VStack spacing={3} align="start" p={4} bg="gray.50" borderRadius="md">
        <Text fontSize="md" fontWeight="medium" color="gray.700">
          As a SulBer Provider you'll be able to:
        </Text>
        <VStack spacing={2} align="start" pl={4}>
          <Text color="gray.700">• Offer driveway car wash, snow shoveling, and parking lot cleaning services</Text>
          <Text color="gray.700">• Receive qualified job requests from nearby customers</Text>
          <Text color="gray.700">• Manage schedules, dispatch crews, and confirm completion</Text>
          <Text color="gray.700">• Get paid faster with built-in invoicing and payment tracking</Text>
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
                  Sign up to SulBer 
                </Heading>
                <Text color="gray.700" fontSize="md">
                 Connect customers with reliable outdoor service providers
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
                      title="Customer Account"
                      description="Request driveway car washes, snow shoveling, or parking lot cleaning in minutes"
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
                      description="Grow your service business by fulfilling SulBer customer requests"
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
