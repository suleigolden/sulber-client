import {
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
  Textarea,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdAdd, MdDelete } from "react-icons/md";
import {
  api,
  ProviderServiceTypesList,
  type ProviderJobService,
  type ProviderJobServiceStatus,
  ProviderJobServiceStatuses,
  type UpdateProviderJobServiceRequest,
} from "@suleigolden/sulber-api-client";
import { CustomToast } from "~/hooks/CustomToast";

type FormValues = {
  serviceType: string;
  priceDollars: string;
  primaryLocation: string;
  otherLocations: string[];
  description: string;
  notes: string;
  status: ProviderJobServiceStatus;
  daysOfWeekAvailable: string[];
};

const defaultValues: FormValues = {
  serviceType: "",
  priceDollars: "",
  primaryLocation: "",
  otherLocations: [],
  description: "",
  notes: "",
  status: "pending",
  daysOfWeekAvailable: [],
};

function formValuesFromJob(job: ProviderJobService): FormValues {
  return {
    serviceType: job.serviceType,
    priceDollars: (job.priceCents / 100).toFixed(2),
    primaryLocation: job.primaryLocation ?? "",
    otherLocations: job.otherLocations ?? [],
    description: job.description ?? "",
    notes: job.notes ?? "",
    status: job.status,
    daysOfWeekAvailable: job.daysOfWeekAvailable ?? [],
  };
}

type EditProviderJobModalProps = {
  job: ProviderJobService | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditProviderJobModal({
  job,
  onClose,
  onSuccess,
}: EditProviderJobModalProps) {
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

  const otherLocations = watch("otherLocations");
  const daysOfWeekAvailable = watch("daysOfWeekAvailable");

  useEffect(() => {
    if (job) {
      reset(formValuesFromJob(job));
    }
  }, [job, reset]);

  const addOtherLocation = useCallback(() => {
    setValue("otherLocations", [...(otherLocations ?? []), ""]);
  }, [otherLocations, setValue]);

  const removeOtherLocation = useCallback(
    (index: number) => {
      const next = [...(otherLocations ?? [])];
      next.splice(index, 1);
      setValue("otherLocations", next);
    },
    [otherLocations, setValue]
  );

  const addDaySlot = useCallback(() => {
    setValue("daysOfWeekAvailable", [...(daysOfWeekAvailable ?? []), ""]);
  }, [daysOfWeekAvailable, setValue]);

  const removeDaySlot = useCallback(
    (index: number) => {
      const next = [...(daysOfWeekAvailable ?? [])];
      next.splice(index, 1);
      setValue("daysOfWeekAvailable", next);
    },
    [daysOfWeekAvailable, setValue]
  );

  const onSubmit = async (data: FormValues) => {
    if (!job) return;
    const priceCents = Math.round(parseFloat(data.priceDollars || "0") * 100);
    if (priceCents < 0) {
      showToast("Error", "Price must be a positive number.", "error");
      return;
    }

    const payload: UpdateProviderJobServiceRequest = {
      serviceType: data.serviceType as UpdateProviderJobServiceRequest["serviceType"],
      priceCents,
      primaryLocation: data.primaryLocation.trim(),
      otherLocations: data.otherLocations?.filter(Boolean) ?? [],
      description: data.description?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      status: data.status,
      daysOfWeekAvailable: data.daysOfWeekAvailable?.filter(Boolean) ?? [],
    };

    setIsSubmitting(true);
    try {
      const svc = api.service("provider-job-service" as never) as {
        update?: (id: string, data: UpdateProviderJobServiceRequest) => Promise<unknown>;
      };
      if (typeof svc?.update !== "function") {
        showToast("Error", "Provider job service API is not available.", "error");
        setIsSubmitting(false);
        return;
      }
      await svc.update(job.id, payload);
      showToast("Success", "Service updated.", "success");
      reset(defaultValues);
      onClose();
      onSuccess();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to update. Please try again.";
      showToast("Error", message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const isOpen = !!job;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" maxH="90vh">
        <ModalHeader>Edit service</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            align="stretch"
            spacing={5}
          >
            <FormControl isInvalid={!!errors.serviceType} isRequired>
              <FormLabel fontWeight="600">Service type</FormLabel>
              <Select
                placeholder="Select service type"
                {...register("serviceType", { required: "Select a service type" })}
                size="md"
                borderRadius="lg"
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
              <FormLabel fontWeight="600">Price (USD)</FormLabel>
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
              />
              {errors.priceDollars && (
                <FormHelperText color="red.500">
                  {errors.priceDollars.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.primaryLocation} isRequired>
              <FormLabel fontWeight="600">Primary location (address)</FormLabel>
              <Input
                placeholder="e.g. 123 Main St, City, State"
                {...register("primaryLocation", {
                  required: "Enter your primary service address",
                })}
                size="md"
                borderRadius="lg"
              />
              {errors.primaryLocation && (
                <FormHelperText color="red.500">
                  {errors.primaryLocation.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600">Other locations (optional)</FormLabel>
              <VStack align="stretch" spacing={2}>
                {(otherLocations ?? []).map((_, index) => (
                  <HStack key={index}>
                    <Input
                      placeholder="Address"
                      {...register(`otherLocations.${index}`)}
                      size="sm"
                      borderRadius="lg"
                    />
                    <IconButton
                      aria-label="Remove location"
                      icon={<MdDelete />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => removeOtherLocation(index)}
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
              <FormLabel fontWeight="600">Description (optional)</FormLabel>
              <Textarea
                placeholder="Describe what's included."
                {...register("description")}
                rows={3}
                borderRadius="lg"
                resize="vertical"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600">Internal notes (optional)</FormLabel>
              <Textarea
                placeholder="Notes for yourself (not shown to customers)."
                {...register("notes")}
                rows={2}
                borderRadius="lg"
                resize="vertical"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600">Status</FormLabel>
              <Select {...register("status")} size="md" borderRadius="lg">
                {ProviderJobServiceStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </Select>
              <FormHelperText color={mutedColor}>
                Set to Active when ready to receive bookings.
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600">Availability (optional)</FormLabel>
              <VStack align="stretch" spacing={2}>
                {(daysOfWeekAvailable ?? []).map((_, index) => (
                  <HStack key={index}>
                    <Input
                      placeholder="e.g. Monday 10:00-12:00"
                      {...register(`daysOfWeekAvailable.${index}`)}
                      size="sm"
                      borderRadius="lg"
                    />
                    <IconButton
                      aria-label="Remove slot"
                      icon={<MdDelete />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => removeDaySlot(index)}
                    />
                  </HStack>
                ))}
                <Button
                  type="button"
                  leftIcon={<MdAdd />}
                  variant="outline"
                  size="sm"
                  onClick={addDaySlot}
                  borderRadius="lg"
                >
                  Add availability slot
                </Button>
              </VStack>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} borderRadius="lg">
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
            loadingText="Saving..."
            borderRadius="lg"
          >
            Save changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
