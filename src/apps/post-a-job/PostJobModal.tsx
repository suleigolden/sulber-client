import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { MdAdd, MdDelete } from "react-icons/md";
import {
  api,
  ProviderServiceTypesList,
  type CreateProviderJobServiceRequest,
} from "@suleigolden/sulber-api-client";
import { CustomToast } from "~/hooks/CustomToast";
import { LocationSearchInput } from "~/apps/provider-onboard/components/LocationSearchInput";
import {
  DAYS_OF_WEEK,
  emptyLocation,
  locationFromSearch,
  slotsToDaysOfWeekAvailable,
  type AvailabilitySlot,
  type ProviderJobServiceLocation,
} from "./location-utils";

type FormValues = {
  serviceType: string;
  priceDollars: string;
  primaryLocation: ProviderJobServiceLocation | null;
  otherLocations: ProviderJobServiceLocation[];
  description: string;
  notes: string;
  availabilitySlots: AvailabilitySlot[];
};

const defaultSlots: AvailabilitySlot[] = DAYS_OF_WEEK.map((day) => ({
  day,
  startTime: "",
  endTime: "",
}));

const defaultValues: FormValues = {
  serviceType: "",
  priceDollars: "",
  primaryLocation: null,
  otherLocations: [],
  description: "",
  notes: "",
  availabilitySlots: defaultSlots,
};

type PostJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  providerId: string;
};

export function PostJobModal({
  isOpen,
  onClose,
  onSuccess,
  providerId,
}: PostJobModalProps) {
  const showToast = CustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const primaryLocation = watch("primaryLocation");
  const otherLocations = watch("otherLocations");
  const availabilitySlots = watch("availabilitySlots") ?? defaultSlots;

  const addOtherLocation = useCallback(() => {
    setValue("otherLocations", [...(otherLocations ?? []), emptyLocation()]);
  }, [otherLocations, setValue]);

  const removeOtherLocation = useCallback(
    (index: number) => {
      const next = [...(otherLocations ?? [])];
      next.splice(index, 1);
      setValue("otherLocations", next);
    },
    [otherLocations, setValue]
  );

  const updateSlot = useCallback(
    (index: number, field: "startTime" | "endTime", value: string) => {
      const next = [...(availabilitySlots ?? defaultSlots)];
      if (!next[index]) return;
      next[index] = { ...next[index], [field]: value };
      setValue("availabilitySlots", next);
    },
    [availabilitySlots, setValue]
  );

  const onSubmit = async (data: FormValues) => {
    if (!data.primaryLocation?.street?.trim()) {
      showToast("Error", "Select a primary location.", "error");
      return;
    }
    const priceCents = Math.round(parseFloat(data.priceDollars || "0") * 100);
    if (priceCents < 0) {
      showToast("Error", "Price must be a positive number.", "error");
      return;
    }

    const primary = data.primaryLocation!;
    const others = data.otherLocations?.filter((l) => l?.street?.trim()) ?? [];
    const payload = {
      providerId,
      serviceType: data.serviceType as CreateProviderJobServiceRequest["serviceType"],
      priceCents,
      primaryLocation: primary,
      otherLocations: others,
      description: data.description?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      status: "active" as const,
      daysOfWeekAvailable: slotsToDaysOfWeekAvailable(data.availabilitySlots ?? defaultSlots),
    };

    setIsSubmitting(true);
    try {
      const svc = api.service("provider-job-service" as never) as {
        create?: (p: CreateProviderJobServiceRequest) => Promise<unknown>;
      };
      if (typeof svc?.create !== "function") {
        showToast("Error", "Provider job service API is not available.", "error");
        setIsSubmitting(false);
        return;
      }
      await svc.create(payload as unknown as CreateProviderJobServiceRequest);
      showToast("Success", "Your service has been posted successfully.", "success");
      reset(defaultValues);
      onClose();
      onSuccess();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to post job. Please try again.";
      showToast("Error", message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" maxH="90vh">
        <ModalHeader fontWeight="600" fontSize="lg">
          Post a service
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            align="stretch"
            spacing={6}
          >
            <FormControl isInvalid={!!errors.serviceType} isRequired>
              <FormLabel fontWeight="600" fontSize="sm">
                Service type
              </FormLabel>
              <Select
                placeholder="Select service type"
                {...register("serviceType", { required: "Select a service type" })}
                size="md"
                borderRadius="lg"
                borderColor="gray.200"
                _dark={{ borderColor: "whiteAlpha.300" }}
              >
                {ProviderServiceTypesList.services.map((s) => (
                  <option key={s.type} value={s.type}>
                    {s.title}
                  </option>
                ))}
              </Select>
              {errors.serviceType && (
                <FormHelperText color="red.500">
                  {errors.serviceType.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.priceDollars} isRequired>
              <FormLabel fontWeight="600" fontSize="sm">
                Price (USD)
              </FormLabel>
              <Input
                type="number"
                step="0.01"
                min={0}
                placeholder="e.g. 25.00"
                {...register("priceDollars", {
                  required: "Enter a price",
                  min: { value: 0, message: "Price must be positive" },
                })}
                size="md"
                borderRadius="lg"
                borderColor="gray.200"
                _dark={{ borderColor: "whiteAlpha.300" }}
              />
              {errors.priceDollars && (
                <FormHelperText color="red.500">
                  {errors.priceDollars.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontWeight="600" fontSize="sm">
                Primary location
              </FormLabel>
              <Box mt={1}>
                <LocationSearchInput
                  initialValue={primaryLocation ? [primaryLocation.street, primaryLocation.city, primaryLocation.state].filter(Boolean).join(", ") : undefined}
                  onLocationSelect={(result) => {
                    if (result) setValue("primaryLocation", locationFromSearch(result));
                    else setValue("primaryLocation", null);
                  }}
                />
              </Box>
              {!primaryLocation?.street?.trim() && (
                <FormHelperText color={mutedColor}>
                  Search and select your main service address.
                </FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" fontSize="sm">
                Other locations (optional)
              </FormLabel>
              <VStack align="stretch" spacing={3} mt={2}>
                {(otherLocations ?? []).map((_, index) => (
                  <HStack key={index} align="flex-start" spacing={2}>
                    <Box flex={1}>
                      <LocationSearchInput
                        initialValue={otherLocations?.[index] ? [otherLocations[index].street, otherLocations[index].city, otherLocations[index].state].filter(Boolean).join(", ") : undefined}
                        onLocationSelect={(result) => {
                          if (result) {
                            const next = [...(otherLocations ?? [])];
                            next[index] = locationFromSearch(result);
                            setValue("otherLocations", next);
                          }
                        }}
                      />
                    </Box>
                    <IconButton
                      aria-label="Remove location"
                      icon={<MdDelete />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => removeOtherLocation(index)}
                      mt={1}
                    />
                  </HStack>
                ))}
                <Button
                  type="button"
                  leftIcon={<MdAdd />}
                  variant="outline"
                  size="sm"
                  onClick={addOtherLocation}
                  borderRadius="lg"
                >
                  Add location
                </Button>
              </VStack>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" fontSize="sm">
                Description (optional)
              </FormLabel>
              <Textarea
                placeholder="Describe what's included."
                {...register("description")}
                rows={3}
                borderRadius="lg"
                resize="vertical"
                borderColor="gray.200"
                _dark={{ borderColor: "whiteAlpha.300" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" fontSize="sm">
                Internal notes (optional)
              </FormLabel>
              <Textarea
                placeholder="Notes for yourself (not shown to customers)."
                {...register("notes")}
                rows={2}
                borderRadius="lg"
                resize="vertical"
                borderColor="gray.200"
                _dark={{ borderColor: "whiteAlpha.300" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" fontSize="sm">
                Availability
              </FormLabel>
              <FormHelperText color={mutedColor} mb={3}>
                Set your available time slots for each day.
              </FormHelperText>
              <VStack align="stretch" spacing={3}>
                {(availabilitySlots ?? defaultSlots).map((slot, index) => (
                  <SimpleGrid key={slot.day} columns={{ base: 1, sm: 3 }} gap={2} alignItems="center" w="full">
                    <Box fontWeight="500" fontSize="sm" minW="100px">
                      {slot.day}
                    </Box>
                    <HStack spacing={2} flex={1}>
                      <Input
                        type="time"
                        size="sm"
                        borderRadius="lg"
                        {...register(`availabilitySlots.${index}.startTime`)}
                        onChange={(e) => updateSlot(index, "startTime", e.target.value)}
                      />
                      <Text as="span" fontSize="sm" color={mutedColor}>
                        to
                      </Text>
                      <Input
                        type="time"
                        size="sm"
                        borderRadius="lg"
                        {...register(`availabilitySlots.${index}.endTime`)}
                        onChange={(e) => updateSlot(index, "endTime", e.target.value)}
                      />
                    </HStack>
                  </SimpleGrid>
                ))}
              </VStack>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={2}>
          <Button variant="ghost" onClick={handleClose} borderRadius="lg">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            colorScheme="brand"
            bg="brand.500"
            color="white"
            _hover={{ bg: "brand.600" }}
            isLoading={isSubmitting}
            loadingText="Posting..."
            borderRadius="lg"
          >
            Post service
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
