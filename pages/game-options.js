import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Center,
  Heading,
  Text,
  Button,
  ChakraProvider,
  VStack,
  HStack,
  SimpleGrid,
  Checkbox,
  useColorModeValue,
  Container,
} from "@chakra-ui/react";
import { supabase } from "../utils/supabaseClient";
import Navbar from "../components/Navbar";

export default function GameOptions({ 
  selectedCategories, 
  setSelectedCategories, 
  selectedDifficulties, 
  setSelectedDifficulties 
}) {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  const categoryOptions = [
    { name: "arts_and_literature", displayName: "Arts & Literature" },
    { name: "film_and_tv", displayName: "Cinema & TV" },
    { name: "food_and_drink", displayName: "Food & Drink" },
    { name: "general_knowledge", displayName: "General Knowledge" },
    { name: "geography", displayName: "Geography" },
    { name: "history", displayName: "History" },
    { name: "music", displayName: "Music" },
    { name: "science", displayName: "Science" },
    { name: "society_and_culture", displayName: "Society & Culture" },
    { name: "sport_and_leisure", displayName: "Sport & Leisure" },
  ];

  const difficultyOptions = [
    { name: "easy", displayName: "Easy" },
    { name: "medium", displayName: "Medium" },
    { name: "hard", displayName: "Hard" },
  ];

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

  const handleStartGame = () => {
    router.push('/');
  };

  return (
    <Box minH="100vh">
      <Navbar 
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedDifficulties={selectedDifficulties}
        setSelectedDifficulties={setSelectedDifficulties}
      />
      <Box 
        minH="calc(100vh - 64px)" 
        bgGradient="linear(to-b, blue.100, white)"
        py={8}
      >
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Categories
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {categoryOptions.map((category, index) => (
                  <Box
                    key={index}
                    p={3}
                    borderRadius="md"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ bg: hoverBg }}
                  >
                    <HStack>
                      <Checkbox
                        id={category.name}
                        name={category.name}
                        isChecked={selectedCategories.includes(category.name)}
                        onChange={(event) => {
                          const isChecked = event.target.checked;
                          setSelectedCategories((prevState) =>
                            isChecked
                              ? [...prevState, category.name]
                              : prevState.filter((c) => c !== category.name)
                          );
                        }}
                      />
                      <Text as="label" htmlFor={category.name}>
                        {category.displayName}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Difficulty
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {difficultyOptions.map((difficulty, index) => (
                  <Box
                    key={index}
                    p={3}
                    borderRadius="md"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ bg: hoverBg }}
                  >
                    <HStack>
                      <Checkbox
                        id={difficulty.name}
                        name={difficulty.name}
                        isChecked={selectedDifficulties.includes(difficulty.name)}
                        onChange={(event) => {
                          const isChecked = event.target.checked;
                          if (isChecked) {
                            setSelectedDifficulties([difficulty.name]);
                          } else {
                            setSelectedDifficulties((prevState) =>
                              prevState.filter((d) => d !== difficulty.name)
                            );
                          }
                        }}
                      />
                      <Text as="label" htmlFor={difficulty.name}>
                        {difficulty.displayName}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            <Center>
              <Button
                colorScheme="blue"
                onClick={handleStartGame}
              >
                Start Game
              </Button>
            </Center>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
} 