import { useState } from "react";
import { uploadBytesResumable, getDownloadURL, ref as firebaseRef } from "firebase/storage";
import { firebaseStorage } from "~/common/utils/firebaseConfig";
import { api } from "@suleigolden/co-renting-api-client";
import { CustomToast } from "~/hooks/CustomToast";
import { PhotoGallery } from "@suleigolden/co-renting-api-client";

export const usePhotoUpload = (listingId: string | undefined, photos: PhotoGallery[], setPhotos: (photos: PhotoGallery[]) => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const showToast = CustomToast();

  const uploadPhoto = async (file: File) => {
    if (!photos || !listingId) return;

    setIsUploading(true);
    const timestamp = Date.now();
    const storageRef = firebaseRef(
      firebaseStorage,
      `co-renting/${listingId}/gallery/${timestamp}_${file.name}`
    );

    try {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error);
          showToast("Error", "Failed to upload photo.", "error");
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const newPhoto = {
            url: downloadURL,
            is_cover_photo: false,
          };
          const updatedPhotos = [...photos, newPhoto];
          setPhotos(updatedPhotos);

          const response = await api
            .service("listing")
            .updateListing(listingId, {
              photo_galleries: updatedPhotos,
            });

          if (
            JSON.stringify(response.photo_galleries) !==
            JSON.stringify(updatedPhotos)
          ) {
            setPhotos(response.photo_galleries || []);
          }

          showToast("Success", "Photo uploaded successfully!", "success");
          setIsUploading(false);
        }
      );
    } catch (error) {
      console.error("Upload error:", error);
      showToast("Error", "Failed to upload photo.", "error");
      setIsUploading(false);
    }
  };

  return { isUploading, uploadPhoto };
}; 