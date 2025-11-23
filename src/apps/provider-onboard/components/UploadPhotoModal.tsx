import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  Icon,
  Button,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { MdUpload } from "react-icons/md";
import { AddIcon } from "@chakra-ui/icons";
import { CustomToast } from "~/hooks/CustomToast";
import { usePhotoUpload } from "~/hooks/usePhotoUpload";
import { PhotoGallery } from "@suleigolden/co-renting-api-client";

type UploadPhotoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  photos: PhotoGallery[];
  setPhotos: (photos: PhotoGallery[]) => void;
};

export const UploadPhotoModal = ({ isOpen, onClose, listingId, photos, setPhotos }: UploadPhotoModalProps) => {
  const { isUploading, uploadPhoto } = usePhotoUpload(listingId, photos, setPhotos);
  const showToast = CustomToast();
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBorderColor = useColorModeValue("gray.300", "gray.500");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
          showToast("Error", "Only PNG, JPG, and JPEG files are allowed.", "error");
          return;
        }
        uploadPhoto(file);
      });
      if (acceptedFiles.length > 0) {
        onClose();
      }
    },
    [uploadPhoto, showToast, onClose]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    multiple: true,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Photos</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box
            {...getRootProps()}
            border="2px dashed"
            borderColor={isDragActive ? hoverBorderColor : borderColor}
            borderRadius="md"
            p={10}
            textAlign="center"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ borderColor: hoverBorderColor }}
          >
            <input {...getInputProps()} />
            <VStack spacing={4}>
              <Icon as={MdUpload} w={8} h={8} color="gray.500" />
              <Text fontWeight="medium">
                {isDragActive ? "Drop the files here..." : "Drag & drop photos here, or click to select"}
              </Text>
              <Button colorScheme="brand" leftIcon={<AddIcon />} isLoading={isUploading}>
                Add photos
              </Button>
              <Text fontSize="sm" color="gray.500">
                PNG, JPG or JPEG (max. 5MB each)
              </Text>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 