import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  useColorModeValue,
  Flex,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { usePropertyOnboarding } from "~/hooks/use-property-onboarding";
import { AddIcon } from "@chakra-ui/icons";
import {  Listing } from "@suleigolden/co-renting-api-client";
import { CustomToast } from "~/hooks/CustomToast";
import { useDropzone } from "react-dropzone";
import { MdUpload } from "react-icons/md";
import { PhotoGalleryManager } from "./PhotoGalleryManager";
import { usePhotoUpload } from "../../hooks/usePhotoUpload";

type PropertyPhotosProps = {
  onNext?: () => void;
};

export const PropertyPhotos = forwardRef(
  (
    props: PropertyPhotosProps,
    ref: React.ForwardedRef<{ submitForm: () => Promise<void> }>,
  ) => {
    const { handleSubmit, photos, setPhotos, stepsNotCompleted } =
      usePropertyOnboarding();
    const { isUploading, uploadPhoto } = usePhotoUpload(
      stepsNotCompleted?.id,
      photos || [],
      setPhotos
    );
    const showToast = CustomToast();
    const bgColor = useColorModeValue("gray.50", "gray.700");

    useEffect(() => {
      if (stepsNotCompleted) {
        setPhotos(
          stepsNotCompleted?.photo_galleries?.map((photo) => ({
            url: photo.url,
            is_cover_photo: photo.is_cover_photo,
          })),
        );
      }
    }, [setPhotos, stepsNotCompleted]);

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit,
    }));

    const onDrop = useCallback(
      (acceptedFiles: File[]) => {
        if (!photos) {
          showToast(
            "Error",
            "Please complete previous steps before uploading photos.",
            "error",
          );
          return;
        }

        acceptedFiles.forEach((file) => {
          if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
            showToast(
              "Error",
              "Only PNG, JPG, and JPEG files are allowed.",
              "error",
            );
            return;
          }
          uploadPhoto(file);
        });
      },
      [photos, uploadPhoto, showToast],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
      },
      multiple: true,
    });

    return photos?.length ? (
      <PhotoGalleryManager
        photos={photos}
        setPhotos={setPhotos}
        stepsNotCompleted={stepsNotCompleted as Listing}
      />
    ) : (
      <Box
        w="full"
        maxW="900px"
        p={{ base: 6, md: 10 }}
        bg={bgColor}
        borderRadius="xl"
      >
        <VStack align="start" spacing={6} w="full">
          <Heading size="lg">
            Add some photos of your house for co-owners or tenants
          </Heading>

          <Box>
            <Text fontSize="md" color="gray.700" mt={2}>
              Add at least 7 photos, but we recommend adding more.
            </Text>
            <Text fontSize="sm" color="gray.700" mt={2}>
              You should show co-owners or tenants where they'll eat, sleep, and
              hang out. Don't forget to showcase your property's unique
              features, outdoor spaces, or nearby landmarks.
            </Text>
          </Box>

          <Box
            {...getRootProps()}
            border="2px dashed"
            borderColor={isDragActive ? "gray.300" : "gray.200"}
            textAlign="center"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ borderColor: "gray.300" }}
            w="full"
            borderRadius="md"
            p={10}
          >
            <input {...getInputProps()} />
            <Icon as={MdUpload} w={8} h={8} color="gray.500" mb={3} />
            <Text fontWeight="medium">
              {isDragActive
                ? "Drop the files here..."
                : "Drag & drop photos here, or click to select"}
            </Text>
            <Button colorScheme="brand" leftIcon={<AddIcon />} mt={4}>
              Add photos
            </Button>
            <Text fontSize="sm" color="gray.500" mt={2}>
              PNG, JPG or JPEG (max. 5MB each)
            </Text>
          </Box>

          {isUploading && (
            <Flex justify="center" mt={4} w="full">
              <Spinner />
            </Flex>
          )}

        </VStack>
      </Box>
    );
  },
);
