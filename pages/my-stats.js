import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  Box,
  Center,
  Heading,
  Text,
  Button,
  ChakraProvider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";

export default function MyStats() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          setSession(session);
        }
        setIsLoading(false);
      }
    }
    getInitialSession();
    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (!session) {
    return (
      <ChakraProvider>
        <Center h="100vh">
          <Box textAlign="center">
            <Heading mb={4}>Você precisa estar logado para ver suas estatísticas</Heading>
            <Button colorScheme="blue" onClick={() => window.location.href = "/"}>
              Voltar para o início
            </Button>
          </Box>
        </Center>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Center minH="100vh" py={10}>
        <Box maxW="800px" w="full" px={4}>
          <Heading mb={6} textAlign="center">
            Minhas Estatísticas
          </Heading>
          
          <Center>
            <Box textAlign="center">
              <Text fontSize="xl" mb={4}>
                Estatísticas não disponíveis no momento
              </Text>
              <Button colorScheme="blue" onClick={() => window.location.href = "/"}>
                Voltar para o jogo
              </Button>
            </Box>
          </Center>
        </Box>
      </Center>
    </ChakraProvider>
  );
}
