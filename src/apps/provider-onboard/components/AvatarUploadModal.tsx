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
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { MdUpload } from "react-icons/md";
import { CustomToast } from "~/hooks/CustomToast";

type AvatarUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
};

export const AvatarUploadModal = ({ 
  isOpen, 
  onClose, 
  onFileSelect,
  isUploading = false 
}: AvatarUploadModalProps) => {
  const showToast = CustomToast();
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBorderColor = useColorModeValue("gray.300", "gray.500");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      
      const file = acceptedFiles[0];
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        showToast("Error", "Only PNG, JPG, and JPEG files are allowed.", "error");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showToast("Error", "File size must be less than 5MB.", "error");
        return;
      }
      
      onFileSelect(file);
    },
    [onFileSelect, showToast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    multiple: false,
    disabled: isUploading,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Profile Photo</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box
            {...getRootProps()}
            border="2px dashed"
            borderColor={isDragActive ? hoverBorderColor : borderColor}
            borderRadius="md"
            p={10}
            textAlign="center"
            cursor={isUploading ? "not-allowed" : "pointer"}
            transition="all 0.2s"
            opacity={isUploading ? 0.6 : 1}
            _hover={!isUploading ? { borderColor: hoverBorderColor } : {}}
          >
            <input {...getInputProps()} />
            <VStack spacing={4}>
              <Icon as={MdUpload} w={8} h={8} color="gray.500" />
              <Text fontWeight="medium">
                {isDragActive 
                  ? "Drop the file here..." 
                  : isUploading 
                  ? "Uploading..."
                  : "Drag & drop photo here, or click to select"}
              </Text>
              <Text fontSize="sm" color="gray.500">
                PNG, JPG or JPEG (max. 5MB)
              </Text>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

