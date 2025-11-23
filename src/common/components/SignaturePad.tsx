
import { Box, Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { FC, useRef, useState } from "react";
import { useController } from "react-hook-form";
import ReactSignatureCanvas from "react-signature-canvas";
import { useSignature } from "~/hooks/use-signature";

type Props = {
  fieldName: string;
  signatureFile: string | undefined;
};

export const SignaturePad: FC<Props> = ({ fieldName, signatureFile }) => {
  let signCanvas = useRef<ReactSignatureCanvas | null>(null);
  const { field } = useController({ name: fieldName });
  const getSignature = useSignature(signatureFile);
  const [signature, setSignature] = useState<string | undefined>(getSignature);

  // Update signature state when user draws
  const onChange = () => {
    if (signCanvas.current) {
      // Get the signature as a data URL
      const dataUrl = signCanvas.current.toDataURL();
      setSignature(dataUrl);

      signCanvas.current.getCanvas().toBlob((blob) => {
        const fd = new FormData();
        if (blob) {
          fd.append("file", blob);
          field.onChange(fd);
        }
      });
    }
  };

  const clear = () => {
    signCanvas.current?.clear();
    field.onChange(null);
    setSignature("");
  };

  return (
    <Stack>
      <Flex justify="space-between" w="full" align="center">
        <Text fontSize="14px" fontWeight="bold">
          Please sign below{" "}
          <Text as="span" textColor="red">
            *
          </Text>
        </Text>
        {signature && (
          <Button variant="link" colorScheme="brand" onClick={clear}>
            Clear
          </Button>
        )}
      </Flex>
      <Box border="1px" rounded="md" w="full" h="200">
        {signature ? (
          <Image src={signature} w="full" h="full" />
        ) : (
          <ReactSignatureCanvas
            ref={signCanvas}
            onEnd={onChange}
            penColor="black"
            canvasProps={{
              style: {
                width: "100%",
                height: "100%",
              },
            }}
          />
        )}
      </Box>
    </Stack>
  );
};
