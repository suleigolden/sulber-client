import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Avatar,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useEffect } from "react";
import { FormProvider, useFormContext } from "react-hook-form";
import { useProviderOnboarding } from "~/hooks/use-provider-onboarding";
import { CustomInputField } from "~/components/fields/CustomInputField";
import { useAvatarUpload } from "~/hooks/useAvatarUpload";
import { useUserProfile } from "~/hooks/use-user-profile";
import { Gender, UserProfile } from "@suleigolden/sulber-api-client";
import { AvatarUploadModal } from "./components/AvatarUploadModal";
import { OnboardingStepper } from "./OnboardingStepper";

type UserInformationProps = {
  onNext?: () => void;
  activeStep: number;
  steps: any;
  shouldDisplayStepper?: boolean;
  onUserInfoValidChange?: (isValid: boolean) => void;
};

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

export const UserInformation = forwardRef<
  { submitForm: () => Promise<void> },
  UserInformationProps
>(({ onNext, activeStep, steps, shouldDisplayStepper = true, onUserInfoValidChange }, ref) => {
  const { methods, handleSubmit } = useProviderOnboarding();
  const { userProfile } = useUserProfile();
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  // Watch required fields to determine if user info is valid
  const firstName = watch("first_name");
  const lastName = watch("last_name");
  const avatarUrl = watch("avatar_url");
  const dateOfBirth = watch("date_of_birth");
  const phoneNumber = watch("phone_number");
  const gender = watch("gender");

  const isUserInfoValid = !!(
    firstName?.trim() &&
    lastName?.trim() &&
    avatarUrl &&
    dateOfBirth &&
    phoneNumber &&
    gender
  );

  // Notify parent component about validation state
  useEffect(() => {
    onUserInfoValidChange?.(isUserInfoValid);
  }, [isUserInfoValid, onUserInfoValidChange]);

  // Initialize form with existing user profile data
  useEffect(() => {
    if (userProfile) {
      const raw = userProfile as Record<string, unknown>;
      setValue("first_name", (raw.first_name ?? raw.firstName ?? "") as string);
      setValue("last_name", (raw.last_name ?? raw.lastName ?? "") as string);
      setValue("avatar_url", (userProfile.avatar_url ?? (raw.avatar_url as string)) || "");
      // Format date for input field (YYYY-MM-DD)
      const dob = userProfile.date_of_birth ?? (raw.date_of_birth as string);
      const dateOfBirth = dob
        ? new Date(dob).toISOString().split("T")[0]
        : "";
      setValue("date_of_birth", dateOfBirth);
      setValue("phone_number", String(userProfile.phone_number ?? raw.phone_number ?? "").trim() || "");
      setValue("gender", String(userProfile.gender ?? raw.gender ?? ""));
      setValue("bio", String(userProfile.bio ?? raw.bio ?? ""));
    }
  }, [userProfile, setValue]);

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit,
  }));


  return (
    <FormProvider {...methods}>
      <VStack spacing={8} align="center" w="full">
        <Box
          w="full"
          maxW="720px"
          borderRadius="2xl"
          boxShadow="lg"
        >
          {shouldDisplayStepper && <OnboardingStepper activeStep={activeStep} steps={steps} />}
          <Box
            w="full"
            bg="brand.500"
            color="white"
            borderRadius="8px 8px 0 0"
            boxShadow="lg"
            p={{ base: 6, md: 10 }}
          >
            <Heading size="lg" mb={2}>
              Hi {userProfile?.first_name}! Tell us about yourself
            </Heading>
            <Text fontSize="md">
              Share some information to help customers get to know you better.
            </Text>
          </Box>
          <VStack spacing={6} w="full" align="stretch" p={{ base: 6, md: 10 }} border="1px #333333 solid" borderRadius="0 0 8px 8px">
            <AvatarUploadSection userProfile={userProfile as UserProfile} />
            <CustomInputField
              type="text"
              label="First Name *"
              registerName="first_name"
              isError={errors?.first_name}
              placeholder="Enter your first name"
              autoComplete="given-name"
            />

            <CustomInputField
              type="text"
              label="Last Name *"
              registerName="last_name"
              isError={errors?.last_name}
              placeholder="Enter your last name"
              autoComplete="family-name"
            />
            <CustomInputField
              type="date"
              label="Date of Birth *"
              registerName="date_of_birth"
              isError={errors?.date_of_birth}
              placeholder="Select your date of birth"
            />

            <CustomInputField
              type="text"
              label="Phone Number *"
              registerName="phone_number"
              isError={errors?.phone_number}
              placeholder="Enter your phone number"
              autoComplete="tel"
            />

            <CustomInputField
              type="select"
              label="Gender *"
              registerName="gender"
              options={Gender.map((gender) => ({ label: gender, value: gender }))}
              isError={errors?.gender}
              placeholder="Select your gender"
            />

            <CustomInputField
              type="textarea"
              label="Bio"
              registerName="bio"
              isError={errors?.bio}
              placeholder="Tell customers about yourself, your experience, and what makes you a great service provider..."
            />
          </VStack>
        </Box>
      </VStack>
    </FormProvider>
  );
});
