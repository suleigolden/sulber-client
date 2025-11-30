import {
  Container,
  Heading,
  Box,
  VStack,
  Text,
  Button,
  Avatar,
  Flex,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
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

type AvatarUploadSectionProps = {
  userProfile: UserProfile;
};

const AvatarUploadSection = ({ userProfile }: AvatarUploadSectionProps) => {
  const { watch, setValue } = useFormContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const avatarUrl = watch("avatar_url") || userProfile?.avatarUrl || "";
  const { uploadAvatar, isUploading } = useAvatarUpload((url) => {
    setValue("avatar_url", url);
  });

  const handleFileSelect = (file: File) => {
    uploadAvatar(file);
    onClose();
  };

  return (
    <FormControl>
      <FormLabel>Profile Photo</FormLabel>
      <Flex align="center" gap={4}>
        <Avatar size="xl" src={avatarUrl || undefined} name="User" />
        <VStack align="start" spacing={2}>
          <Button size="sm" onClick={onOpen} isLoading={isUploading}>
            {avatarUrl ? "Change Photo" : "Upload Photo"}
          </Button>
          <Text fontSize="xs" color="gray.500">
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

  // Initialize form with existing user profile data
  useEffect(() => {
    if (userProfile) {
      setValue("first_name", userProfile.firstName || "");
      setValue("last_name", userProfile.lastName || "");
      setValue("phone_number", userProfile.phoneNumber || "");
      // Format date for input field (YYYY-MM-DD)
      const dateOfBirth = userProfile.dateOfBirth
        ? new Date(userProfile.dateOfBirth).toISOString().split('T')[0]
        : "";
      setValue("date_of_birth", dateOfBirth);
      setValue("gender", userProfile.gender || "");
      setValue("bio", userProfile.bio || "");
      setValue("avatar_url", userProfile.avatarUrl || "");

      // Set address fields
      if (userProfile.address) {
        setValue("address.street", userProfile.address.street || "");
        setValue("address.city", userProfile.address.city || "");
        setValue("address.state", userProfile.address.state || "");
        setValue("address.country", userProfile.address.country || "");
        setValue("address.postal_code", userProfile.address.postalCode || "");
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
        userId: user.id,
        firstName: data.first_name,
        lastName: data.last_name,
        dateOfBirth: data.date_of_birth && data.date_of_birth.trim() !== '' ? data.date_of_birth : null,
        phoneNumber: data.phone_number,
        gender: data.gender as Gender,
        bio: data.bio,
        address: {
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          country: data.address?.country || "",
          postalCode: data.address?.postal_code || "",
        },
      };

      await api.service('user-profile').update(userProfile.id as string, userProfilePayload as UserProfile);
      showToast('Success', 'Profile updated successfully', 'success');
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'An unexpected error occurred. Please try again.';
      showToast('Error', errorMessage, 'error');
    }
  };


  if (isLoading) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <Text>Loading profile...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        <Box w="full">
          <Heading size="lg" mb={2}>
            Customer Profile Settings
          </Heading>
          <Text color="gray.600" mb={6}>
            Manage your profile information and vehicles.
          </Text>

          <Tabs colorScheme="brand" variant="enclosed" w="full">
            <TabList
              mb={6}
              overflowX={{ base: "auto", md: "visible" }}
            >
              <Tab
                _selected={{
                  bg: "brand.500",
                  color: "white",
                  borderRadius: "lg",
                  boxShadow: "0 4px 12px rgba(242, 107, 58, 0.3)",
                  transform: "translateY(-2px)",
                }}
                _hover={{
                  bg: useColorModeValue("gray.50", "gray.900"),
                  color: "brand.500",
                  borderRadius: "lg",
                  transform: "translateY(-1px)",
                }}
                transition="all 0.3s ease"
                fontWeight="semibold"
                w="full"
                borderRadius="lg"
                color={useColorModeValue("gray.600", "gray.300")}
              >
                <VStack spacing={1}>
                  <Text fontSize="sm" fontWeight="inherit">
                    Profile
                  </Text>
                </VStack>
              </Tab>
              <Tab
                _selected={{
                  bg: "brand.500",
                  color: "white",
                  borderRadius: "lg",
                  boxShadow: "0 4px 12px rgba(242, 107, 58, 0.3)",
                  transform: "translateY(-2px)",
                }}
                _hover={{
                  bg: useColorModeValue("gray.50", "gray.900"),
                  color: "brand.500",
                  borderRadius: "lg",
                  transform: "translateY(-1px)",
                }}
                transition="all 0.3s ease"
                fontWeight="semibold"
                w="full"
                borderRadius="lg"
                color={useColorModeValue("gray.600", "gray.300")}
              >
                <VStack spacing={1}>
                  <Text fontSize="sm" fontWeight="inherit">
                    Vehicles
                  </Text>
                </VStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* Profile Tab */}
              <TabPanel px={0}>
                <FormProvider {...methods}>
                  <Box
                    w="full"
                    maxW="720px"
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="lg"
                    p={{ base: 4, sm: 6, md: 8 }}
                  >
                    <VStack spacing={6} align="stretch">
                      {/* Email (Read-only) */}
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                          Email
                        </Text>
                        <Input
                          type="text"
                          value={user?.email || ""}
                          isDisabled={true}
                          placeholder="Email address"
                          bg="gray.50"
                          borderColor="gray.200"
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
                        <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
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
                                userProfile.address.postalCode,
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
                        size="lg"
                        w="full"
                        onClick={handleSubmit(onSubmit)}
                        isLoading={isSubmitting}
                        isDisabled={!isFormValid}
                        mt={4}
                      >
                        Save Changes
                      </Button>
                    </VStack>
                  </Box>
                </FormProvider>
              </TabPanel>

              {/* Vehicles Tab */}
              <TabPanel px={0}>
                <Vehicles />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Container>
  );
};
