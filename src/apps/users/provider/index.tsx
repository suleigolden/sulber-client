import {
  Container,
  Heading,
  VStack,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useUserProfile } from "~/hooks/use-user-profile";
import { useProviderProfile } from "~/hooks/use-provider-profile";
import { ProviderLocation } from "~/apps/provider-onboard/ProviderLocation";
import { ProviderServices } from "~/apps/provider-onboard/ProviderServices";
import { UserInformation } from "~/apps/provider-onboard/UserInformation";

export const ProviderProfileSettings = () => {
  const { isLoading: isLoadingUserProfile } = useUserProfile();
  const { isLoading: isLoadingProviderProfile } = useProviderProfile();
  const [tabIndex, setTabIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationFormRef = useRef<{ submitForm: () => Promise<void> }>(null);
  const servicesFormRef = useRef<{ submitForm: () => Promise<void> }>(null);
  const userInfoFormRef = useRef<{ submitForm: () => Promise<void> }>(null);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Only submit the form for the currently active tab
      // tabIndex 0 = Location, 1 = Services, 2 = Personal Information
      if (tabIndex === 0 && locationFormRef.current) {
        await locationFormRef.current.submitForm();
      } else if (tabIndex === 1 && servicesFormRef.current) {
        await servicesFormRef.current.submitForm();
      } else if (tabIndex === 2 && userInfoFormRef.current) {
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
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" thickness="4px" />
            <Text color="gray.600">Loading profile...</Text>
          </VStack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="1500px" px={[4, 0]} py={0}>
      <VStack align="start" spacing={8} w="full" mt={0} pl={6}>
        <Heading size="md" fontWeight="bold">
          Settings
        </Heading>

        <Box w="full" bg="white" borderRadius="xl" boxShadow="xl" p={6}>
          <Tabs colorScheme="brand" index={tabIndex} onChange={setTabIndex} w="full">
            <TabList>
              <Tab>Location</Tab>
              <Tab>Services</Tab>
              <Tab>Personal Information</Tab>
            </TabList>

            <TabPanels>
              {/* Location Tab */}
              <TabPanel px={0} py={6}>
                <ProviderLocation
                  ref={locationFormRef}
                  activeStep={0}
                  steps={[{ title: "Location", Component: ProviderLocation }]}
                />
              </TabPanel>

              {/* Services Tab */}
              <TabPanel px={0} py={6}>
                <ProviderServices
                  ref={servicesFormRef}
                  activeStep={0}
                  steps={[{ title: "Services", Component: ProviderServices }]}
                  onServicesSelectedChange={() => {}}
                  isProviderProfileSettings={true}
                />
              </TabPanel>

              {/* Personal Information Tab */}
              <TabPanel px={0} py={6}>
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
          <Box mt={8} pt={6} borderTopWidth="1px" borderColor="gray.200">
            <Button
              colorScheme="brand"
              size="lg"
              onClick={handleSave}
              isLoading={isSubmitting}
              loadingText="Saving..."
              w={{ base: "full", md: "auto" }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
};
