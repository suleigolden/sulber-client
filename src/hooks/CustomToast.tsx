import { useToast } from "@chakra-ui/react";

export const CustomToast = () => {
  const toast = useToast();

  const showToast = (
    title: string,
    description: string,
    status: "info" | "warning" | "success" | "error",
    options = {},
  ) => {
    if (!toast.isActive("custom-toast")) {
      toast({
        id: "custom-toast",
        title,
        description,
        status,
        duration: 9000,
        isClosable: true,
        position: "top-right",
        ...options,
      });
    }
  };

  return showToast;
};
