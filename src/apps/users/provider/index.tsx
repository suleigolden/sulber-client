import {
  Container,
  Heading,
  VStack,
  Box,
  Flex,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Spinner,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiMapPin, FiUser } from "react-icons/fi";
import { useRef, useState } from "react";
import { useUserProfile } from "~/hooks/use-user-profile";
import { useProviderProfile } from "~/hooks/use-provider-profile";
import { ProviderLocation } from "~/apps/provider-onboard/ProviderLocation";
import { UserInformation } from "~/apps/provider-onboard/UserInformation";
import { useSystemColor } from "~/hooks/use-system-color";

export const ProviderProfileSettings = () => {
  const { isLoading: isLoadingUserProfile } = useUserProfile();
  const { isLoading: isLoadingProviderProfile } = useProviderProfile();
  const [tabIndex, setTabIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locationFormRef = useRef<{ submitForm: () => Promise<void> }>(null);
  const userInfoFormRef = useRef<{ submitForm: () => Promise<void> }>(null);
  const tabOrientation = useBreakpointValue<"horizontal" | "vertical">({
    base: "horizontal",
    md: "vertical",
  });
  const {
    borderColor,
    labelColor,
    menuItemHover,
    brandColor,
    mutedTextColor,
    headingColor,
  } = useSystemColor();

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Only submit the form for the currently active tab
      // tabIndex 0 = Location, 1 = Personal Information (Services tab is commented out)
      if (tabIndex === 0 && locationFormRef.current) {
        await locationFormRef.current.submitForm();
      } else if (tabIndex === 1 && userInfoFormRef.current) {
        await userInfoFormRef.current.submitForm();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingUserProfile || isLoadingProviderProfile;

  if (isLoading) {
    return (
      <Container maxW="1500px" px={{ base: 4, sm: 6, md: 8 }} py={{ base: 6, md: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minH={{ base: "300px", md: "400px" }}>
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color={mutedTextColor} fontSize={{ base: "sm", md: "md" }}>
              Loading profile...
            </Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="1500px" px={{ base: 4, sm: 6, md: 8 }} py={{ base: 4, sm: 5, md: 6 }}>
      <VStack
        align="start"
        spacing={{ base: 4, sm: 6, md: 8 }}
        w="full"
        mt={{ base: 2, md: 0 }}
        pl={{ base: 0, md: 6 }}
      >
        <Heading size={{ base: "sm", sm: "md" }} fontWeight="bold" color={headingColor}>
          Account Settings
        </Heading>

        <Box
          w="full"
          borderRadius={{ base: "lg", md: "xl" }}
          boxShadow={{ base: "md", md: "xl" }}
          p={{ base: 4, sm: 5, md: 6 }}
          overflow="hidden"
        >
          <Tabs
            colorScheme="brand"
            variant="enclosed"
            index={tabIndex}
            onChange={setTabIndex}
            w="full"
            orientation={tabOrientation}
            display={{ base: "block", md: "flex" }}
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: 0, md: 6 }}
            alignItems={{ md: "stretch" }}
          >
            <TabList
              flexDirection={{ base: "row", md: "column" }}
              flexShrink={0}
              w={{ base: "full", md: "220px" }}
              mb={{ base: 4, md: 0 }}
              gap={{ base: 2, md: 0 }}
              overflowX={{ base: "auto", md: "visible" }}
              overflowY="hidden"
              borderRightWidth={{ base: 0, md: "1px" }}
              borderColor={{ md: borderColor }}
              pr={{ md: 4 }}
              pb={{ base: 1, md: 0 }}
              sx={{ WebkitOverflowScrolling: "touch" }}
            >
              <Tab
                _selected={{
                  bg: "brand.500",
                  color: "white",
                  borderRadius: "lg",
                  transform: { base: "translateY(-2px)", md: "translateX(4px)" },
                }}
                _hover={{
                  bg: menuItemHover,
                  color: brandColor,
                  borderRadius: "lg",
                  transform: { base: "translateY(-1px)", md: "translateX(2px)" },
                }}
                transition="all 0.3s ease"
                fontWeight="semibold"
                w={{ base: "auto", minW: "fit-content", md: "full" }}
                flexShrink={0}
                justifyContent={{ base: "center", md: "flex-start" }}
                borderRadius="lg"
                color={labelColor}
                py={{ base: 3, md: 2 }}
                px={{ base: 4, md: 3 }}
                mt={{ base: 0, md: 5 }}
              >
                <Flex align="center" gap={2}>
                  <Icon as={FiMapPin} boxSize={{ base: 4, md: 4 }} />
                  <Text fontSize={{ base: "sm", md: "sm" }} fontWeight="inherit" whiteSpace="nowrap">
                    Location
                  </Text>
                </Flex>
              </Tab>
              <Tab
                _selected={{
                  bg: "brand.500",
                  color: "white",
                  borderRadius: "lg",
                  transform: { base: "translateY(-2px)", md: "translateX(4px)" },
                }}
                _hover={{
                  bg: menuItemHover,
                  color: brandColor,
                  borderRadius: "lg",
                  transform: { base: "translateY(-1px)", md: "translateX(2px)" },
                }}
                transition="all 0.3s ease"
                fontWeight="semibold"
                w={{ base: "auto", minW: "fit-content", md: "full" }}
                flexShrink={0}
                justifyContent={{ base: "center", md: "flex-start" }}
                borderRadius="lg"
                color={labelColor}
                py={{ base: 3, md: 2 }}
                px={{ base: 4, md: 3 }}
                mt={{ base: 0, md: 5 }}
              >
                <Flex align="center" gap={2}>
                  <Icon as={FiUser} boxSize={{ base: 4, md: 4 }} />
                  <Text fontSize={{ base: "xs", sm: "sm", md: "sm" }} fontWeight="inherit" whiteSpace="nowrap">
                    Personal Info
                  </Text>
                </Flex>
              </Tab>
            </TabList>

            <TabPanels flex={1} minW={0} overflow="hidden">
              {/* Location Tab */}
              <TabPanel px={0} py={{ base: 4, sm: 5, md: 6 }}>
                <ProviderLocation
                  ref={locationFormRef}
                  activeStep={0}
                  steps={[{ title: "Location", Component: ProviderLocation }]}
                />
              </TabPanel>

              {/* Services Tab */}
              {/* <TabPanel px={0} py={6}>
                <ProviderServices
                  ref={servicesFormRef}
                  activeStep={0}
                  steps={[{ title: "Services", Component: ProviderServices }]}
                  onServicesSelectedChange={() => {}}
                  isProviderProfileSettings={true}
                />
              </TabPanel> */}

              {/* Personal Information Tab */}
              <TabPanel px={0} py={{ base: 4, sm: 5, md: 6 }}>
                <UserInformation
                  ref={userInfoFormRef}
                  activeStep={0}
                  steps={[{ title: "User", Component: UserInformation }]}
                  shouldDisplayStepper={false}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>

          {/* Save Button */}
          <Box
            mt={{ base: 4, sm: 6, md: 8 }}
            pt={{ base: 4, sm: 5, md: 6 }}
            borderTopWidth="1px"
            borderColor={borderColor}
          >
            <Button
              colorScheme="brand"
              size={{ base: "md", md: "lg" }}
              onClick={handleSave}
              isLoading={isSubmitting}
              loadingText="Saving..."
              w={{ base: "full", md: "auto" }}
              minH={{ base: "44px", md: "40px" }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
};
