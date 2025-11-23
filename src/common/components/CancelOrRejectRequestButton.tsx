import {
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
} from "@chakra-ui/react";
import { api } from "@suleigolden/co-renting-api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaThumbsDown } from "react-icons/fa";
import { useState, useRef } from "react";

type CancelOrRejectRequestButtonProps = {
  type: "cancel" | "reject";
  requestId: string;
  userId: string;
  isLoading?: boolean;
}

export const CancelOrRejectRequestButton = ({ 
  type,
  requestId, 
  userId, 
  isLoading = false 
}: CancelOrRejectRequestButtonProps) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
 
  const cancelRequestMutation = useMutation({
    mutationFn: (requestId: string) =>
      api.service("listingRequest").rejectListingRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listingRequests", userId] });
      toast({
        title: "Request canceled successfully",
        description: "Your listing request has been removed.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      setIsCancelDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error canceling request",
        description: "Please try again. If the problem persists, contact support.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  const handleCancelRequest = () => {
    setIsCancelDialogOpen(true);
  };

  const confirmCancelRequest = () => {
    cancelRequestMutation.mutate(requestId);
  };

  const handleCloseDialog = () => {
    setIsCancelDialogOpen(false);
  };

  return (
    <>
      <Button
        colorScheme={'brand'}
        variant="outline"
        size="md"
        onClick={handleCancelRequest}
        isLoading={cancelRequestMutation.isPending || isLoading}
      > <FaThumbsDown /> <Text as="span" ml={2} >{type === "cancel" ? "Cancel" : "Reject"}</Text></Button>

      <AlertDialog
        isOpen={isCancelDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCloseDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {type === "cancel" ? "Cancel Listing Request" : "Reject Listing Request"}
            </AlertDialogHeader>

            <AlertDialogBody>
              {type === "cancel" ? "Are you sure you want to cancel this listing request? This action cannot be undone." : "Are you sure you want to reject this listing request? This action cannot be undone."}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={handleCloseDialog}
                variant="ghost"
              >
                {type === "cancel" ? "Keep Request" : "Keep Request"}
              </Button> 
              <Button
                colorScheme="red"
                onClick={confirmCancelRequest}
                ml={3}
                isLoading={cancelRequestMutation.isPending}
                loadingText="Canceling..."
              >
                {type === "cancel" ? "Cancel Request" : "Reject Request"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}; 