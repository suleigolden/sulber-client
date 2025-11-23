import {
  Box,
  Heading,
  Text,
  VStack,
  Image,
  Grid,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  AspectRatio,
  Spinner,
  ListItem,
  UnorderedList,
  Flex,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";
import { api, Listing, PhotoGallery } from "@suleigolden/co-renting-api-client";
import { AddIcon } from "@chakra-ui/icons";
import { firebaseStorage } from "~/common/utils/firebaseConfig";
import { ref as firebaseRef, deleteObject } from "firebase/storage";
import { CustomToast } from "~/hooks/CustomToast";
import { UploadPhotoModal } from "./components/UploadPhotoModal";
import { useState } from "react";

type PhotoGalleryManagerProps = {
  photos: PhotoGallery[];
  setPhotos: (photos: PhotoGallery[]) => void;
  stepsNotCompleted: Listing;
};

export const PhotoGalleryManager: React.FC<PhotoGalleryManagerProps> = ({
  photos: initialPhotos,
  stepsNotCompleted,
}) => {
  const [photos, setPhotos] = useState<PhotoGallery[]>(initialPhotos);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = CustomToast();

  const handleCoverChange = async (url: string) => {
    if (!photos || !stepsNotCompleted?.id) return;

    try {
      // If there's no cover photo, use the first photo as cover
      const updatedPhotos = photos.map((photo) => ({
        ...photo,
        is_cover_photo: photo.url === url,
      }));

      // Update local state
      setPhotos(updatedPhotos);

      // Update the listing with the cover photo
      const response = await api
        .service("listing")
        .updateListing(stepsNotCompleted.id, {
          photo_galleries: updatedPhotos,
        });
      // If server response differs from local state, update with server state
      if (
        JSON.stringify(response.photo_galleries) !==
        JSON.stringify(updatedPhotos)
      ) {
        setPhotos(response.photo_galleries || []);
      }

      showToast("Success", "Cover photo updated successfully!", "success");
    } catch (error) {
      // Revert local state on error
      setPhotos(photos);
      console.error("Cover photo update error:", error);
      showToast("Error", "Failed to update cover photo.", "error");
    }
  };

  const getCoverPhoto = () => {
    const coverPhoto = photos?.find((photo) => photo.is_cover_photo)?.url;
    return coverPhoto ?? photos?.[0]?.url;
  };

  const getOtherPhotos = () => {
    return photos?.filter((photo) => !photo.is_cover_photo);
  };

  const deletePhoto = async (photoUrl: string) => {
    if (!photos || !stepsNotCompleted?.id) return;

    try {
      // Update local state immediately
      const updatedPhotos = photos.filter((photo) => photo.url !== photoUrl);
      setPhotos(updatedPhotos);

      // Delete from storage
      const storagePath = decodeURIComponent(
        photoUrl.split("/o/")[1]?.split("?")[0] ?? "",
      );
      const storageRef = firebaseRef(firebaseStorage, storagePath);
      await deleteObject(storageRef);

      // Update the listing with the new photo galleries
      const response = await api
        .service("listing")
        .updateListing(stepsNotCompleted.id, {
          photo_galleries: updatedPhotos,
        });

      // If the server response is different from our local state, update with server state
      if (
        JSON.stringify(response.photo_galleries) !==
        JSON.stringify(updatedPhotos)
      ) {
        setPhotos(response.photo_galleries || []);
      }

      showToast("Success", "Photo deleted successfully!", "success");
    } catch (error) {
      // Revert local state on error
      setPhotos(photos);
      console.error("Delete error:", error);
      showToast("Error", "Failed to delete photo.", "error");
    }
  };

  if (!photos) return <Spinner />;

  return (
    <VStack align="start" spacing={6} w="full" maxW="800px" p={6}>
      <Flex
        px="25px"
        mb="8px"
        justifyContent="space-between"
        align="center"
        width="100%"
      >
        <Heading size="lg">Property photo gallery</Heading>
        <Button colorScheme="brand" size="sm" onClick={onOpen}>
          <AddIcon fontSize={14} />
          <Text ml={1} mr={1}>
            Add new photo
          </Text>
        </Button>
      </Flex>
      <Box>
        <UnorderedList>
          <ListItem>
            <Text fontSize="sm">
              You can add up to 20 photos to your property gallery.
            </Text>
          </ListItem>
          <ListItem>
            <Text fontSize="sm">
              Click on the image to set the cover photo or remove it.
            </Text>
          </ListItem>
        </UnorderedList>
      </Box>

      {/* cover photo */}
      <Box
        position="relative"
        borderRadius="md"
        overflow="hidden"
        boxShadow="sm"
        width="750px"
        height="400px"
      >
        <AspectRatio ratio={4 / 3}>
          <Image
            src={getCoverPhoto()}
            alt="Uploaded"
            objectFit="cover"
            w="full"
            borderRadius="md"
          />
        </AspectRatio>

        {getCoverPhoto() && (
          <Badge
            position="absolute"
            top={2}
            left={2}
            px={2}
            py={1}
            borderRadius="md"
            fontSize="xs"
          >
            Cover Photo
          </Badge>
        )}

        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiMoreVertical />}
            position="absolute"
            top={2}
            right={2}
            aria-label="Actions"
            size="lg"
          />
          <MenuList>
            <MenuItem onClick={() => handleCoverChange(getCoverPhoto())}>
              Make cover photo
            </MenuItem>
            <MenuItem
              color="red.500"
              onClick={() => deletePhoto(getCoverPhoto())}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      {/* other photos */}
      <Grid
        templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
        gap={4}
        w="full"
      >
        {getOtherPhotos()?.map((photo) => (
          <Box
            key={photo.url}
            position="relative"
            borderRadius="md"
            overflow="hidden"
            boxShadow="sm"
          >
            <AspectRatio ratio={4 / 3}>
              <Image
                src={photo?.url}
                alt="Uploaded"
                objectFit="cover"
                w="full"
              />
            </AspectRatio>

            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                position="absolute"
                top={2}
                right={2}
                aria-label="Actions"
                size="lg"
              />
              <MenuList>
                <MenuItem onClick={() => handleCoverChange(photo.url)}>
                  Make cover photo
                </MenuItem>
                <MenuItem
                  color="red.500"
                  onClick={() => deletePhoto(photo.url)}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        ))}
      </Grid>

      <UploadPhotoModal
        isOpen={isOpen}
        onClose={onClose}
        listingId={stepsNotCompleted.id as string}
        photos={photos}
        setPhotos={setPhotos}
      />
    </VStack>
  );
};
