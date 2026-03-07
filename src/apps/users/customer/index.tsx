import {
  Container,
  Heading,
  Box,
  VStack,
  Text,
  Button,
  Avatar,
  Flex,
  Icon,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import { useEffect } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserProfileSchema, UserProfileSchemaType } from "../schema";
import { CustomInputField } from "~/components/fields/CustomInputField";
import { useUserProfile } from "~/hooks/use-user-profile";
import { useUser } from "~/hooks/use-user";
import { useAvatarUpload } from "~/hooks/useAvatarUpload";
import { Gender, UserProfile } from "@suleigolden/sulber-api-client";
import { AvatarUploadModal } from "~/apps/provider-onboard/components/AvatarUploadModal";
import { LocationSearchInput } from "~/apps/provider-onboard/components/LocationSearchInput";
import { api } from "@suleigolden/sulber-api-client";
import { CustomToast } from "~/hooks/CustomToast";
import { Vehicles } from "~/apps/vehicles";
import { useSystemColor } from "~/hooks/use-system-color";

type AvatarUploadSectionProps = {
  userProfile: UserProfile;
};

const AvatarUploadSection = ({ userProfile }: AvatarUploadSectionProps) => {
  const { watch, setValue } = useFormContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const avatarUrl = watch("avatar_url") || userProfile?.avatar_url || "";
  const { uploadAvatar, isUploading } = useAvatarUpload((url) => {
    setValue("avatar_url", url);
  });
  const { labelColor, mutedTextColor } = useSystemColor();

  const handleFileSelect = (file: File) => {
    uploadAvatar(file);
    onClose();
  };

  return (
    <FormControl>
      <FormLabel color={labelColor}>Profile Photo</FormLabel>
      <Flex align="center" gap={4}>
        <Avatar size="xl" src={avatarUrl || undefined} name="User" />
        <VStack align="start" spacing={2}>
          <Button size="sm" onClick={onOpen} isLoading={isUploading}>
            {avatarUrl ? "Change Photo" : "Upload Photo"}
          </Button>
          <Text fontSize="xs" color={mutedTextColor}>
            PNG, JPG or JPEG (max. 5MB)
          </Text>
        </VStack>
      </Flex>
      <AvatarUploadModal
        isOpen={isOpen}
        onClose={onClose}
        onFileSelect={handleFileSelect}
        isUploading={isUploading}
      />
    </FormControl>
  );
};

export const CustomerProfileSettings = () => {
  const { user } = useUser();
  const { userProfile, isLoading } = useUserProfile();
  const showToast = CustomToast();

  const methods = useForm<UserProfileSchemaType>({
    resolver: yupResolver<UserProfileSchemaType, any, any>(UserProfileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      date_of_birth: "",
      gender: "",
      bio: "",
      avatar_url: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
      },
    },
  });

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  // Watch required fields to determine if form is valid
  const firstName = watch("first_name");
  const lastName = watch("last_name");
  const phoneNumber = watch("phone_number");
  const dateOfBirth = watch("date_of_birth");
  const gender = watch("gender");
  const addressCity = watch("address.city");
  const addressState = watch("address.state");
  const addressCountry = watch("address.country");

  const isFormValid = !!(
    firstName &&
    lastName &&
    phoneNumber &&
    dateOfBirth &&
    gender &&
    (addressCity || addressState || addressCountry)
  );
const {
  modalBg,
  headingColor,
  bodyColor,
  labelColor,
  menuItemHover,
  brandColor,
  mutedTextColor,
  borderColor,
} = useSystemColor();

  const tabOrientation = useBreakpointValue<
    "horizontal" | "vertical"
  >({ base: "horizontal", md: "vertical" });

  // Initialize form with existing user profile data
  useEffect(() => {
    if (userProfile) {
      setValue("first_name", userProfile.first_name || "");
      setValue("last_name", userProfile.last_name || "");
      setValue("phone_number", userProfile.phone_number || "");
      // Format date for input field (YYYY-MM-DD)
      const dateOfBirth = userProfile.date_of_birth
        ? new Date(userProfile.date_of_birth).toISOString().split('T')[0]
        : "";
      setValue("date_of_birth", dateOfBirth);
      setValue("gender", userProfile.gender || "");
      setValue("bio", userProfile.bio || "");
      setValue("avatar_url", userProfile.avatar_url || "");

      // Set address fields
      if (userProfile.address) {
        setValue("address.street", userProfile.address.street || "");
        setValue("address.city", userProfile.address.city || "");
        setValue("address.state", userProfile.address.state || "");
        setValue("address.country", userProfile.address.country || "");
        setValue("address.postal_code", userProfile.address.postal_code || "");
      }
    }
  }, [userProfile, setValue]);

  const onSubmit = async (data: UserProfileSchemaType) => {
    try {
      if (!userProfile?.id || !user?.id) {
        showToast('Error', 'Missing required user or user profile information', 'error');
        return;
      }

      const userProfilePayload = {
        user_id: user.id,
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth && data.date_of_birth.trim() !== '' ? data.date_of_birth : null,
        phone_number: data.phone_number,
        gender: data.gender as Gender,
        bio: data.bio,
        address: {
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          country: data.address?.country || "",
          postal_code: data.address?.postal_code || "",
        },
      };

      await api.service('user-profile').update(userProfile.id as string, userProfilePayload as unknown as UserProfile);
      showToast('Success', 'Profile updated successfully', 'success');
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'An unexpected error occurred. Please try again.';
      showToast('Error', errorMessage, 'error');
    }
  };


  if (isLoading) {
    return (
      <Container maxW="1500px" px={{ base: 4, sm: 6, md: 8 }} py={{ base: 6, md: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minH={{ base: "300px", md: "400px" }}>
          <Text color={mutedTextColor} fontSize={{ base: "sm", md: "md" }}>
            Loading profile...
          </Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="1500px" px={{ base: 4, sm: 6, md: 8 }} py={{ base: 4, sm: 5, md: 8 }}>
      <VStack
        align="start"
        spacing={{ base: 4, sm: 6, md: 8 }}
        w="full"
        mt={{ base: 4, sm: 6, md: 10 }}
      >
        <Box w="full">
          <Heading size={{ base: "sm", sm: "md", md: "lg" }} mb={{ base: 1, md: 2 }} color={headingColor}>
            Account Settings
          </Heading>
          <Text color={bodyColor} mb={{ base: 4, md: 6 }} fontSize={{ base: "sm", md: "md" }}>
            Manage your profile information and vehicles.
          </Text>

          <Tabs
            colorScheme="brand"
            variant="enclosed"
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
              w={{ base: "full", md: "200px" }}
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
                  <Icon as={FiUser} boxSize={4} />
                  <Text fontSize="sm" fontWeight="inherit" whiteSpace="nowrap">
                    Profile
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
                  <Icon as={FaCar} boxSize={4} />
                  <Text fontSize="sm" fontWeight="inherit" whiteSpace="nowrap">
                    Vehicles
                  </Text>
                </Flex>
              </Tab>
            </TabList>

            <TabPanels flex={1} minW={0} overflow="hidden">
              {/* Profile Tab */}
              <TabPanel px={0} py={{ base: 4, sm: 5, md: 0 }}>
                <FormProvider {...methods}>
                  <Box
                    w="full"
                    maxW="720px"
                    bg={modalBg}
                    borderRadius={{ base: "xl", md: "2xl" }}
                    boxShadow={{ base: "md", md: "lg" }}
                    p={{ base: 4, sm: 6, md: 8 }}
                    overflow="hidden"
                  >
                    <VStack spacing={{ base: 4, sm: 5, md: 6 }} align="stretch">
                      {/* Email (Read-only) */}
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={2} color={labelColor}>
                          Email
                        </Text>
                        <Input
                          type="text"
                          value={user?.email || ""}
                          isDisabled={true}
                          placeholder="Email address"
                          bg={modalBg}
                          borderColor={borderColor}
                          _disabled={{
                            opacity: 0.7,
                            cursor: "not-allowed",
                          }}
                        />
                      </Box>

                      {/* Profile Photo */}
                      <AvatarUploadSection userProfile={userProfile as UserProfile} />

                      {/* First Name */}
                      <CustomInputField
                        type="text"
                        label="First Name"
                        registerName="first_name"
                        isError={errors?.first_name}
                        placeholder="Enter your first name"
                        isRequired={true}
                      />

                      {/* Last Name */}
                      <CustomInputField
                        type="text"
                        label="Last Name"
                        registerName="last_name"
                        isError={errors?.last_name}
                        placeholder="Enter your last name"
                        isRequired={true}
                      />

                      {/* Phone Number */}
                      <CustomInputField
                        type="text"
                        label="Phone Number"
                        registerName="phone_number"
                        isError={errors?.phone_number}
                        placeholder="Enter your phone number"
                        autoComplete="tel"
                        isRequired={true}
                      />

                      {/* Date of Birth */}
                      <CustomInputField
                        type="date"
                        label="Date of Birth"
                        registerName="date_of_birth"
                        isError={errors?.date_of_birth}
                        placeholder="Select your date of birth"
                        isRequired={true}
                      />

                      {/* Gender */}
                      <CustomInputField
                        type="select"
                        label="Gender"
                        registerName="gender"
                        options={Gender.map((gender) => ({ label: gender, value: gender }))}
                        isError={errors?.gender}
                        placeholder="Select your gender"
                        isRequired={true}
                      />

                      {/* Address */}
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={2} color={labelColor}>
                          Address <Text as="span" fontSize="sm" color="red">*</Text>
                        </Text>
                        <LocationSearchInput
                          onLocationSelect={(location) => {
                            if (location) {
                              setValue("address.street", location.address || "");
                              if (location.city) setValue("address.city", location.city);
                              if (location.state) setValue("address.state", location.state);
                              if (location.country) setValue("address.country", location.country);
                              if (location.postalCode) setValue("address.postal_code", location.postalCode);
                            }
                          }}
                          initialValue={
                            userProfile?.address
                              ? [
                                userProfile.address.street,
                                userProfile.address.city,
                                userProfile.address.state,
                                userProfile.address.country,
                                userProfile.address.postal_code,
                              ]
                                .filter(Boolean)
                                .join(", ")
                              : ""
                          }
                        />
                      </Box>

                      {/* Bio */}
                      <CustomInputField
                        type="textarea"
                        label="Bio"
                        registerName="bio"
                        isError={errors?.bio}
                        placeholder="Tell us about yourself..."
                        isOptional={true}
                      />

                      {/* Submit Button */}
                      <Button
                        colorScheme="brand"
                        size={{ base: "md", md: "lg" }}
                        w="full"
                        minH={{ base: "44px", md: "40px" }}
                        onClick={handleSubmit(onSubmit)}
                        isLoading={isSubmitting}
                        isDisabled={!isFormValid}
                        mt={{ base: 2, md: 4 }}
                      >
                        Save Changes
                      </Button>
                    </VStack>
                  </Box>
                </FormProvider>
              </TabPanel>

              {/* Vehicles Tab */}
              <TabPanel px={0} py={{ base: 4, sm: 5, md: 0 }}>
                <Vehicles />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Container>
  );
};
