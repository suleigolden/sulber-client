import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  useToast,
  Heading,
  Select,
  Textarea,
  Text,
  VStack,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TheLastSpellingBeeReCaptcha } from "the-last-spelling-bee-re-captcha";
import { ContactUsValidationSchema, ContactUsSchema } from "./schema";
import { api } from "@suleigolden/sulber-api-client";
import Footer from "~/components/footer/FooterAuth";
import SystemThemeToggle from "~/components/SystemThemeToggle";
import { Navbar } from "../Navbar";

export const ContactUs = () => {
  const [isCaptchaVerify, setIsCaptchaVerify] = useState<boolean>(true);
  const toast = useToast();
  const theLastSpellingBeeReCaptchaKey = import.meta.env.VITE_THE_LAST_SPELLING_BEE_RE_CAPTCHA_KEY;

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const inputBg = useColorModeValue("white", "gray.700");
  const boxShadow = useColorModeValue("md", "dark-lg");
  const pageBgColor = useColorModeValue("gray.50", "#0b1437");

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ContactUsSchema>({
    resolver: yupResolver(ContactUsValidationSchema),
    defaultValues: {
      subject: "",
      fullName: "",
      email: "",
      message: "",
    },
    mode: "onBlur"
  });

  useEffect(() => {
    setIsCaptchaVerify(isCaptchaVerify);
  }, [isCaptchaVerify]);

  const onSubmitHandler = async (data: ContactUsSchema) => {
    try {
        const response = await api.service("email").sendContactUs({
            email: data.email,
            fullName: data.fullName,
            subject: data.subject,
            message: data.message,
        });
      if(response) {
        setIsCaptchaVerify(true);
        toast({
          title: "Message Sent Successfully",
          description: "We'll get back to you as soon as possible.",
          status: "success",
          position: "top-right",
          duration: 5000,
          isClosable: true,
        });
        reset();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error: any) {
      toast({
        title: "Message Not Sent",
        description: "There was an error sending your message. Please try again.",
        status: "error",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });
    }
  };


  return (
    <Box bg={pageBgColor}>
       <Navbar />
       <SystemThemeToggle />
      <Container maxW="6xl" py={30}>
        <VStack align="stretch" spacing={8} mt={20}>
          <Box bg={bgColor} rounded="lg" p={8} shadow={boxShadow}>
            <Heading fontSize="4xl" textAlign="center" color={textColor} mb={4}>
              Contact Us
            </Heading>
            <Heading fontSize="2xl" color={textColor} mb={4}>
              Business Hours
            </Heading>
            <VStack align="stretch" spacing={2}>
              <Text color={textColor}>Monday - Friday: 9:00 AM - 6:00 PM</Text>
              <Text color={textColor}>Saturday: 10:00 AM - 4:00 PM</Text>
              <Text color={textColor}>Sunday: Closed</Text>
            </VStack>
          </Box>
          <VStack 
            align="stretch" 
            spacing={8} 
            bg={bgColor} 
            mt={4} 
            rounded="lg" 
            p={8} 
            shadow={boxShadow}
          >
            <Heading fontSize="2xl" color={textColor}>
              Send Us a Message
            </Heading>
            <Box as="form" onSubmit={handleSubmit(onSubmitHandler)}>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.subject}>
                  <FormLabel color={textColor}>How can we help you?</FormLabel>
                  <Select
                    {...register("subject")}
                    placeholder="Select a topic"
                    bg={inputBg}
                    color={textColor}
                    borderColor={borderColor}
                    {...(errors.subject && { borderColor: "red.500" })}
                    required
                  >
                    <option value="Report a bug">Report a Bug</option>
                    <option value="Partnership">Partnership Inquiry</option>
                    <option value="Support">Technical Support</option>
                    <option value="Others">Other Inquiry</option>
                  </Select>
                </FormControl>

                <FormControl isInvalid={!!errors.fullName}>
                  <FormLabel color={textColor}>Full Name</FormLabel>
                  <Input
                    {...register("fullName")}
                    placeholder="Enter your full name"
                    bg={inputBg}
                    color={textColor}
                    borderColor={borderColor}
                    {...(errors.fullName && { borderColor: "red.500" })}
                    required
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel color={textColor}>Email Address</FormLabel>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email address"
                    bg={inputBg}
                    color={textColor}
                    borderColor={borderColor}
                    {...(errors.email && { borderColor: "red.500" })}
                    required
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.message}>
                  <FormLabel color={textColor}>Message</FormLabel>
                  <Textarea
                    {...register("message")}
                    placeholder="Type your message here..."
                    rows={5}
                    bg={inputBg}
                    color={textColor}
                    borderColor={borderColor}
                    {...(errors.message && { borderColor: "red.500" })}
                    required
                  />
                </FormControl>

                <Box mt={4}>
                  <TheLastSpellingBeeReCaptcha
                    reCaptchaKey={theLastSpellingBeeReCaptchaKey}
                    questionType="RANDOM"
                    onVerifyCaptcha={(result: any) => {
                      setIsCaptchaVerify(!result);
                    }}
                  />
                </Box>

                {!isCaptchaVerify && (
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    width="100%"
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                  >
                    Send Message
                  </Button>
                )}
              </Stack>
            </Box>
          </VStack>
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
};
