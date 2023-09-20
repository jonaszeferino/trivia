import { useState, useEffect, useMemo } from "react";
import styles from "../styles/Home.module.css";
import {
  Button,
  Checkbox,
  Stack,
  Text,
  VStack,
  HStack,
  Box,
  ChakraProvider,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Link,
} from "@chakra-ui/react";

import { supabase } from "../utils/supabaseClient";

export default function Reservations() {
  const [data, setData] = useState([]);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log(data);

  const getStatsTrivia = async () => {
    console.log("Chamou");
    try {
      const response = await fetch(`/api/v1/getStatsTrivia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: session.user.email,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setData(data);
        console.log("Cegou aqui 1");
      } else {
        console.error("Erro ao buscar os dados:", response.status);
        console.log("Cegou aqui 2");
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      console.log("Cegou aqui 3");
      console.log(error);
    }
  };

  let totalCount = 0;
  let totalCorrect_0 = 0;
  let totalCorrect_1 = 0;

  const mappedData = data.map((totals) => {
    totalCount +=
      parseInt(totals.correct_0_count) + parseInt(totals.correct_1_count);
    totalCorrect_0 += parseInt(totals.correct_0_count);
    totalCorrect_1 += parseInt(totals.correct_1_count);
  });

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

  return (
    <div>
      <br />
      <ChakraProvider>
        {session ? (
          <p>
            <Center>
              {session.user.email} <br />
              <Center>
                <Button
                  onClick={() => supabase.auth.signOut()}
                  colorScheme="red"
                  size="sm"
                >
                  Sair
                </Button>
              </Center>
            </Center>
          </p>
        ) : null}
      </ChakraProvider>
      <br />
      {session ? (
        <ChakraProvider>
          <Center>
            <HStack spacing={4} align="center">
              <Button onClick={() => getStatsTrivia()}>Ver Estatisticas</Button>
            </HStack>
          </Center>

          <Center>
            {data && (
              <div
                style={{
                  maxWidth: "700px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <ChakraProvider>
                  <Table variant="striped" colorScheme="blue">
                    <TableCaption>Estatisticas Por Dificuldades</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Dificuldade</Th>
                        <Th>Erradas</Th>
                        <Th>Corretas</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.map((search) => (
                        <Tr key={search._id}>
                          <Td>
                            {search._id === "hard"
                              ? "Difícil"
                              : search._id === "medium"
                              ? "Médio"
                              : search._id === "easy"
                              ? "Fácil"
                              : "Tradução não encontrada"}
                          </Td>
                          <Td>{search.correct_0_count}</Td>
                          <Td>{search.correct_1_count}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  <Table variant="striped" colorScheme="blue">
                    <TableCaption>Totais</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Total de Questões:</Th>
                        <Th>Total de Corretas:</Th>
                        <Th>Total de Erradas:</Th>
                        <Th>Percentual de Erradas:</Th>
                        <Th>Percentual de Certas:</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>{totalCount}</Td>
                        <Td>{totalCorrect_1}</Td>
                        <Td>{totalCorrect_0}</Td>
                        <Td>
                          {((100 * totalCorrect_0) / totalCount).toFixed(2)}%
                        </Td>
                        <Td>
                          {((100 * totalCorrect_1) / totalCount).toFixed(2)}%
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </ChakraProvider>
              </div>
            )}
          </Center>
        </ChakraProvider>
      ) : (
        <ChakraProvider>
          <Center>
            <Text>Faça o Login pra ver suas Estatisticas</Text>
          </Center>
          <br />
          <Center>
            <Text>
              <Link href="/signUp">
                <Button>Login</Button>
              </Link>
            </Text>
          </Center>
        </ChakraProvider>
      )}
    </div>
  );
}
