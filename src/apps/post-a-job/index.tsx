import { Container, Heading, VStack } from "@chakra-ui/react"


export const PostAJob = () => {
    return (
        <Container maxW="1500px" px={[4, 8]} py={8}>
            <VStack align="start" spacing={8} w="full" mt={10}>
                <Heading size="lg" mb={2}>Post a Job</Heading>
            </VStack>
        </Container>
    )
}