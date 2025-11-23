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
  import { FaCheck } from "react-icons/fa";
  import { useState, useRef } from "react";
  
  type AcceptListingRequestButtonProps = {
    requestId: string;
    userId: string;
    isLoading?: boolean;
  };
  
  export const AcceptListingRequestButton = ({
    requestId,
    userId,
    isLoading = false,
  }: AcceptListingRequestButtonProps) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const acceptRef = useRef<HTMLButtonElement>(null);
  
    const acceptRequestMutation = useMutation({
      mutationFn: (requestId: string) =>
        api.service("listingRequest").acceptListingRequest(requestId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["listingRequests", userId] });
        toast({
          title: "Request accepted successfully",
          description: "The listing request has been accepted.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        setIsDialogOpen(false);
      },
      onError: () => {
        toast({
          title: "Error accepting request",
          description: "Please try again. If the problem persists, contact support.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      },
    });
  
    const handleAcceptRequest = () => {
      setIsDialogOpen(true);
    };
  
    const confirmAcceptRequest = () => {
      acceptRequestMutation.mutate(requestId);
    };
  
    const handleCloseDialog = () => {
      setIsDialogOpen(false);
    };
  
    return (
      <>
        <Button
          colorScheme="green"
          variant="outline"
          size="md"
          onClick={handleAcceptRequest}
          isLoading={acceptRequestMutation.isPending || isLoading}
          ml={2}
        >
          <FaCheck /> <Text as="span" ml={2}>Accept</Text>
        </Button>
  
        <AlertDialog
          isOpen={isDialogOpen}
          leastDestructiveRef={acceptRef}
          onClose={handleCloseDialog}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Accept Listing Request
              </AlertDialogHeader>
  
              <AlertDialogBody>
                Are you sure you want to accept this listing request? This action cannot be undone.
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button
                  ref={acceptRef}
                  onClick={handleCloseDialog}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="green"
                  onClick={confirmAcceptRequest}
                  ml={3}
                  isLoading={acceptRequestMutation.isPending}
                  loadingText="Accepting..."
                >
                  Accept Request
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  };