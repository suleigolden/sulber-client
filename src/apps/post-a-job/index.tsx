import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
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
  type ProviderJobServiceStatus,
  ProviderJobServiceStatuses,
} from "@suleigolden/sulber-api-client";
import { useUser } from "~/hooks/use-user";
import { CustomToast } from "~/hooks/CustomToast";
import { useNavigate } from "react-router-dom";

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

export const PostAJob = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const showToast = CustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardBg = useColorModeValue("white", "whiteAlpha.50");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const headingColor = useColorModeValue("gray.800", "white");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const otherLocations = watch("otherLocations");
  const daysOfWeekAvailable = watch("daysOfWeekAvailable");

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
    if (!user?.id) {
      showToast("Error", "You must be logged in to post a job.", "error");
      return;
    }
    if (user?.role !== "provider") {
      showToast("Error", "Only providers can post job services.", "error");
      return;
    }

    const priceCents = Math.round(parseFloat(data.priceDollars || "0") * 100);
    if (priceCents < 0) {
      showToast("Error", "Price must be a positive number.", "error");
      return;
    }

    const payload: CreateProviderJobServiceRequest = {
      providerId: user.id,
      serviceType: data.serviceType as CreateProviderJobServiceRequest["serviceType"],
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
      const providerJobServiceApi = api.service("provider-job-service" as any);
      if (typeof providerJobServiceApi?.create !== "function") {
        showToast(
          "Error",
          "Provider job service API is not available. Please update the API client.",
          "error"
        );
        setIsSubmitting(false);
        return;
      }
      await providerJobServiceApi.create(payload);
      showToast("Success", "Your service has been posted successfully.", "success");
      navigate(`/provider/${user.id}/dashboard`);
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

  if (!user) {
    return (
      <Container maxW="900px" px={{ base: 4, md: 8 }} py={8}>
        <Text color={mutedColor}>Please sign in to post a job.</Text>
      </Container>
    );
  }

  if (user.role !== "provider") {
    return (
      <Container maxW="900px" px={{ base: 4, md: 8 }} py={8}>
        <Text color={mutedColor}>Only providers can post job services.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="900px" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
      <VStack align="stretch" spacing={8}>
        <Box>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="brand.500"
            letterSpacing="wider"
            textTransform="uppercase"
            mb={1}
          >
            Provider
          </Text>
          <Heading size="xl" color={headingColor} letterSpacing="tight">
            Post a service
          </Heading>
          <Text color={mutedColor} mt={2} fontSize="sm">
            Add a new service offering so customers can find and book you.
          </Text>
        </Box>

        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          bg={cardBg}
          borderRadius="2xl"
          borderWidth="1px"
          borderColor={borderColor}
          p={{ base: 5, md: 8 }}
          shadow="sm"
        >
          <VStack align="stretch" spacing={6}>
            <FormControl isInvalid={!!errors.serviceType} isRequired>
              <FormLabel fontWeight="600">Service type</FormLabel>
              <Select
                placeholder="Select service type"
                {...register("serviceType", { required: "Select a service type" })}
                size="lg"
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
                size="lg"
                borderRadius="lg"
              />
              <FormHelperText color={mutedColor}>
                Enter the base price in dollars. Customers may see add-ons later.
              </FormHelperText>
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
                size="lg"
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
              <Text fontSize="sm" color={mutedColor} mb={2}>
                Add more addresses where you offer this service.
              </Text>
              <VStack align="stretch" spacing={2}>
                {(otherLocations ?? []).map((_, index) => (
                  <HStack key={index}>
                    <Input
                      placeholder="Address"
                      {...register(`otherLocations.${index}`)}
                      size="md"
                      borderRadius="lg"
                    />
                    <IconButton
                      aria-label="Remove location"
                      icon={<MdDelete />}
                      size="md"
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
                placeholder="Describe what’s included and what customers can expect."
                {...register("description")}
                rows={4}
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
              <Select {...register("status")} size="lg" borderRadius="lg">
                {ProviderJobServiceStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </Select>
              <FormHelperText color={mutedColor}>
                &quot;Pending&quot; until reviewed; set to &quot;Active&quot; when ready to receive bookings.
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600">Availability (optional)</FormLabel>
              <Text fontSize="sm" color={mutedColor} mb={2}>
                e.g. &quot;Monday 10:00-12:00&quot;, &quot;Tuesday 14:00-18:00&quot;
              </Text>
              <VStack align="stretch" spacing={2}>
                {(daysOfWeekAvailable ?? []).map((_, index) => (
                  <HStack key={index}>
                    <Input
                      placeholder="e.g. Monday 10:00-12:00"
                      {...register(`daysOfWeekAvailable.${index}`)}
                      size="md"
                      borderRadius="lg"
                    />
                    <IconButton
                      aria-label="Remove slot"
                      icon={<MdDelete />}
                      size="md"
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

            <HStack pt={4} spacing={4} justify="flex-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
                borderRadius="lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="brand"
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                isLoading={isSubmitting}
                loadingText="Posting..."
                borderRadius="lg"
                size="lg"
              >
                Post service
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
