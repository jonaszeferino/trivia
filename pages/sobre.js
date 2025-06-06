import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Link,
  Center,
  ChakraProvider,
  Icon,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export default function Sobre() {
  return (
    <ChakraProvider>
      <Container maxW="container.md" py={10}>
        <VStack spacing={8} align="stretch">
          <Center>
            <Heading as="h1" size="xl" color="teal.500">
              About Trivia Game
            </Heading>
          </Center>

          <Box p={6} borderRadius="lg" boxShadow="lg" bg="white">
            <VStack spacing={4} align="stretch">
              <Text fontSize="lg">
                This is a test project developed by Jonas Zeferino de Oliveira,
                using the public API{" "}
                <Link
                  href="https://the-trivia-api.com/"
                  color="teal.500"
                  isExternal
                >
                  The Trivia API
                </Link>
                .
              </Text>

              <Text fontSize="lg">
                The game was created as a demonstration of public API integration
                and interactive interface development using Next.js and Chakra UI.
              </Text>

              <Text fontSize="lg">
                Project features:
              </Text>

              <Box pl={4}>
                <ul>
                  <li>Random questions from different categories</li>
                  <li>Multiple difficulty levels</li>
                  <li>Responsive and modern interface</li>
                  <li>Clean and intuitive design</li>
                </ul>
              </Box>

              <Text fontSize="lg" mt={4}>
                Technologies used:
              </Text>

              <Box pl={4}>
                <ul>
                  <li>Next.js</li>
                  <li>Chakra UI</li>
                  <li>The Trivia API</li>
                  <li>React Hooks</li>
                </ul>
              </Box>

              <Text fontSize="lg" mt={4}>
                Project Repository:
              </Text>

              <Box pl={4}>
                <Link
                  href="https://github.com/jonaszeferino/trivia"
                  color="teal.500"
                  isExternal
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                >
                  <Icon as={FaGithub} w={6} h={6} />
                  GitHub Repository
                </Link>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}
