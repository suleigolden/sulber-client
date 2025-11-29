import { useState } from "react";
import { uploadBytesResumable, getDownloadURL, ref as firebaseRef } from "firebase/storage";
import { firebaseStorage } from "~/common/utils/firebaseConfig";
import { api } from "@suleigolden/sulber-api-client";
import { CustomToast } from "~/hooks/CustomToast";
import { useUser } from "./use-user";

export const useAvatarUpload = (
  onUploadComplete?: (url: string) => void
) => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useUser();
  const showToast = CustomToast();

  const uploadAvatar = async (file: File) => {
    if (!user?.id) {
      showToast("Error", "User not found. Please log in again.", "error");
      return;
    }

    setIsUploading(true);
    const timestamp = Date.now();
    const storageRef = firebaseRef(
      firebaseStorage,
      `user-profiles/${user.id}/avatar/${timestamp}_${file.name}`
    );

    try {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error);
          showToast("Error", "Failed to upload avatar.", "error");
          setIsUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Update user profile with new avatar URL
            await api.service("user-profile").update(user.id, {
              avatarUrl: downloadURL,
            });

            showToast("Success", "Avatar uploaded successfully!", "success");
            onUploadComplete?.(downloadURL);
            setIsUploading(false);
          } catch (error) {
            console.error("Error updating profile:", error);
            showToast("Error", "Failed to update profile with avatar.", "error");
            setIsUploading(false);
          }
        }
      );
    } catch (error) {
      console.error("Upload error:", error);
      showToast("Error", "Failed to upload avatar.", "error");
      setIsUploading(false);
    }
  };

  return { isUploading, uploadAvatar };
};

