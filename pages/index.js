import { useState, useEffect, useMemo } from "react";
import styles from "../styles/Home.module.css";
import {
  Button,
  Checkbox,
  Center,
  Text,
  VStack,
  HStack,
  Box,
  ChakraProvider,
  SimpleGrid,
  Collapse,
  useDisclosure,
  IconButton,
  Heading,
  Container,
  Circle,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
} from "@chakra-ui/react";
import { Alert, Space } from "antd";
import { supabase } from "../utils/supabaseClient";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FaLightbulb } from "react-icons/fa";
import AdSense from "../components/AdSense";

export default function Reservations() {
  const { isOpen, onToggle } = useDisclosure();
  const [answers, setAnswers] = useState({ questions: [] });
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [resultsAnswer, setResultsAnswer] = useState("");
  const [categories, setCategories] = useState("");

  const [selectedDifficulties, setSelectedDifficulties] = useState([]);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [resultado, setResultado] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalWrongQuestions, setTotalWrongQuestions] = useState(0);
  const [totalCorrectQuestions, setTotalCorrectQuestions] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDisabled, setisDisabled] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isClickedA, setIsClickedA] = useState("");
  const [isClickedB, setIsClickedB] = useState("");
  const [isClickedC, setIsClickedC] = useState("");
  const [isClickedD, setIsClickedD] = useState("");

  const [firstTime, setFirstTime] = useState(true);

  const [showCategoryOptions, setShowCategoryOptions] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [correct, setCorrect] = useState(0);

  const toggleCategoryOptions = () => setShowCategoryOptions((prev) => !prev);

  const apiCall = () => {
    setIsClickedA("");
    setIsClickedB("");
    setIsClickedC("");
    setIsClickedD("");

    let choice = "";

    if (selectedDifficulties.includes("easy")) {
      choice = "&difficulty=easy";
    } else if (selectedDifficulties.includes("medium")) {
      choice = "&difficulty=medium";
    } else if (selectedDifficulties.includes("hard")) {
      choice = "&difficulty=hard";
    }

    console.log(selectedDifficulties);
    console.log(choice);

    const url = `https://the-trivia-api.com/api/questions?limit=1&categories=${selectedCategories.join(
      ","
    )}${choice}`;
    setResultsAnswer("");
    setSelectedAnswer("");
    setResultado("");
    setTotalQuestions(totalQuestions + 1);

    console.log("o que chamou: " + url);

    fetch(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Dados Incorretos");
        }
      })
      .then((result) => {
        setAnswers({
          questions: result.map((question) => ({
            id: question.id,
            question: question.question,
            correctAnswer: question.correctAnswer,
            incorrectAnswers: question.incorrectAnswers,
            difficulty: question.difficulty,
            category: question.category,
          })),
        });
      })
      .catch((error) => setError(true));
  };

  useEffect(() => {
    const allAnswers = [
      answers.questions[0]?.incorrectAnswers[0],
      answers.questions[0]?.incorrectAnswers[1],
      answers.questions[0]?.incorrectAnswers[2],
      answers.questions[0]?.correctAnswer,
    ];
    const newShuffledAnswers = allAnswers
      .slice()
      .sort(() => Math.random() - 0.5);
    setShuffledAnswers(newShuffledAnswers);
  }, [answers]);

  function getResultAnswer(recebido, questao) {
    setisDisabled(true);
    if (recebido === answers.questions[0]?.correctAnswer) {
      setResultsAnswer(
        <Box 
          bg="green.500" 
          color="white" 
          p={4} 
          borderRadius="md" 
          textAlign="center"
          fontWeight="bold"
          fontSize="xl"
          boxShadow="lg"
        >
          Correct Answer! 🎉
        </Box>
      );
      setTotalCorrectQuestions(totalCorrectQuestions + 1);
      setCorrect(1);
    } else {
      setResultsAnswer(
        <Box 
          bg="red.500" 
          color="white" 
          p={4} 
          borderRadius="md" 
          textAlign="center"
          fontWeight="bold"
          fontSize="xl"
          boxShadow="lg"
        >
          Wrong Answer! The correct answer is: {answers.questions[0]?.correctAnswer}
        </Box>
      );
      setTotalWrongQuestions(totalWrongQuestions + 1);
      setCorrect(0);
    }
  }

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

  // verificar as sessões
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

  //Enviar stats

  const insertStats = async () => {
    try {
      const response = await fetch("/api/v1/postStatsTrivia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: session.user.email || "not logged in",
          questionId: answers.questions[0].id,
          correct: correct,
          difficulty: answers.questions[0].difficulty,
        }),
      });
      return;
    } catch (error) {
      console.error(error);
    }
  };

  console.log(correct);

  return (
    <div>
      <ChakraProvider>
        <Box 
          minH="100vh" 
          bgGradient="linear(to-b, blue.100, white)"
          py={8}
        >
          <Container maxW="container.xl">
            <VStack spacing={8}>
              <Box 
                w="full" 
                bg="white" 
                p={6} 
                borderRadius="xl" 
                boxShadow="lg"
                position="relative"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  bgGradient: "linear(to-r, blue.500, blue.600)",
                  borderTopRadius: "xl"
                }}
              >
                <Center>
                  <HStack spacing={4}>
                    <Button
                      onClick={() => {
                        apiCall();
                        setFirstTime(false);
                        setTotalQuestions(0);
                        setTotalCorrectQuestions(0);
                        setTotalWrongQuestions(0);
                        setisDisabled(false);
                      }}
                      colorScheme="blue"
                      size="lg"
                      px={8}
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg"
                      }}
                      transition="all 0.2s"
                    >
                      Start Game
                    </Button>
                    <Button
                      onClick={onToggle}
                      colorScheme="blue"
                      size="lg"
                      px={8}
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg"
                      }}
                      transition="all 0.2s"
                    >
                      {isOpen ? "Close Options" : "Options"}
                    </Button>
                  </HStack>
                </Center>
              </Box>

              <Collapse in={isOpen} animateOpacity>
                <Box 
                  w="full" 
                  bg="white" 
                  p={6} 
                  borderRadius="xl" 
                  boxShadow="lg"
                  mb={4}
                >
                  <VStack spacing={6} align="stretch">
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
                            _hover={{ bg: "gray.50" }}
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
                              <label htmlFor={category.name}>
                                {category.displayName}
                              </label>
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
                            _hover={{ bg: "gray.50" }}
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
                              <label htmlFor={difficulty.name}>
                                {difficulty.displayName}
                              </label>
                            </HStack>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </Box>
              </Collapse>

              {/* AdSense Banner Superior */}
              <Box w="full" bg="white" p={4} borderRadius="xl" boxShadow="md">
                <AdSense adSlot="1234567890" format="banner" />
              </Box>

              {firstTime && (
                <VStack spacing={6} align="stretch" w="full">
                  <Heading 
                    as="h1" 
                    size="xl" 
                    bgGradient="linear(to-r, blue.400, blue.800)"
                    bgClip="text"
                    textAlign="center"
                    fontWeight="extrabold"
                  >
                    Welcome to Trivia Game!
                  </Heading>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box 
                      p={6} 
                      borderRadius="xl" 
                      boxShadow="lg" 
                      bg="white"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "xl"
                      }}
                      transition="all 0.2s"
                    >
                      <VStack spacing={4} align="stretch">
                        <Heading as="h2" size="md" color="blue.300">
                          Did You Know?
                        </Heading>
                        <Text fontSize="lg" color="gray.600">
                          The word &quot;trivia&quot; comes from the Latin &quot;trivium,&quot; meaning &quot;the place where three roads meet.&quot; 
                          In ancient times, this was where people would gather to share knowledge and stories.
                        </Text>
                        <Text fontSize="lg" color="gray.600">
                          Modern trivia games became popular in the 1960s with the board game &quot;Trivial Pursuit,&quot; 
                          which has sold over 100 million copies worldwide.
                        </Text>
                      </VStack>
                    </Box>

                    <Box 
                      p={6} 
                      borderRadius="xl" 
                      boxShadow="lg" 
                      bg="white"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "xl"
                      }}
                      transition="all 0.2s"
                    >
                      <VStack spacing={4} align="stretch">
                        <Heading as="h2" size="md" color="blue.300">
                          How to Play
                        </Heading>
                        <VStack spacing={3} align="stretch">
                          {[
                            "Choose your preferred categories and difficulty level",
                            "Click \"Start Game\" to begin",
                            "Read each question carefully and select your answer",
                            "Get immediate feedback on your answer",
                            "Track your score as you play"
                          ].map((step, index) => (
                            <HStack key={index} spacing={3}>
                              <Circle size="6" bg="blue.500" color="white">
                                {index + 1}
                              </Circle>
                              <Text fontSize="lg" color="gray.600">{step}</Text>
                            </HStack>
                          ))}
                        </VStack>
                      </VStack>
                    </Box>
                  </SimpleGrid>

                  <Box 
                    p={6} 
                    borderRadius="xl" 
                    boxShadow="lg" 
                    bg="white"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "xl"
                    }}
                    transition="all 0.2s"
                  >
                    <VStack spacing={4} align="stretch">
                      <Heading as="h2" size="md" color="blue.300">
                        Fun Facts About Trivia
                      </Heading>
                      <VStack spacing={3} align="stretch">
                        {[
                          "The world's largest trivia contest is held annually in Wisconsin, USA, lasting 54 hours straight!",
                          "The first known trivia game was created in 1964 by Canadian journalists Scott Abbott and Chris Haney.",
                          "Trivia games are proven to help improve memory and cognitive function."
                        ].map((fact, index) => (
                          <HStack key={index} spacing={3}>
                            <Icon as={FaLightbulb} color="blue.500" />
                            <Text fontSize="lg" color="gray.600">{fact}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    </VStack>
                  </Box>
                </VStack>
              )}

              <Box 
                w="full" 
                bg="white" 
                p={4} 
                borderRadius="xl" 
                boxShadow="md"
              >
                <Alert
                  message="Without any selection, the questions will come randomly with all subjects and difficulties"
                  type="success"
                  showIcon
                  closable
                />
              </Box>

              {!firstTime && (
                <Center>
                  <Button
                    onClick={() => {
                      apiCall();
                      setisDisabled(false);
                    }}
                    colorScheme="blue"
                    size="lg"
                    px={8}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg"
                    }}
                    transition="all 0.2s"
                  >
                    Next Question
                  </Button>
                </Center>
              )}

              {!firstTime && answers.questions.length > 0 && (
                <VStack spacing={6}>
                  <Box 
                    w="full" 
                    bg="white" 
                    p={6} 
                    borderRadius="xl" 
                    boxShadow="lg"
                  >
                    <VStack spacing={4}>
                      <Heading as="h2" size="lg" color="black">
                        {answers.questions[0]?.question}
                      </Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                        <Button
                          style={{ backgroundColor: isClickedA }}
                          onClick={() => {
                            getResultAnswer(shuffledAnswers[0], "A");
                            setIsClickedA("#0070f3");
                            insertStats();
                          }}
                          isDisabled={isDisabled}
                          colorScheme={isClickedA ? "teal" : "gray"}
                          size="lg"
                          h="auto"
                          py={4}
                          whiteSpace="normal"
                          textAlign="left"
                          _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "lg"
                          }}
                          transition="all 0.2s"
                        >
                          A: {shuffledAnswers[0]}
                        </Button>
                        <Button
                          style={{ backgroundColor: isClickedB }}
                          onClick={() => {
                            getResultAnswer(shuffledAnswers[1], "B");
                            setIsClickedB("#0070f3");
                            insertStats();
                          }}
                          isDisabled={isDisabled}
                          colorScheme={isClickedB ? "teal" : "gray"}
                          size="lg"
                          h="auto"
                          py={4}
                          whiteSpace="normal"
                          textAlign="left"
                          _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "lg"
                          }}
                          transition="all 0.2s"
                        >
                          B: {shuffledAnswers[1]}
                        </Button>
                        <Button
                          style={{ backgroundColor: isClickedC }}
                          onClick={() => {
                            getResultAnswer(shuffledAnswers[2], "C");
                            setIsClickedC("#0070f3");
                            insertStats();
                          }}
                          isDisabled={isDisabled}
                          colorScheme={isClickedC ? "teal" : "gray"}
                          size="lg"
                          h="auto"
                          py={4}
                          whiteSpace="normal"
                          textAlign="left"
                          _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "lg"
                          }}
                          transition="all 0.2s"
                        >
                          C: {shuffledAnswers[2]}
                        </Button>
                        <Button
                          style={{ backgroundColor: isClickedD }}
                          onClick={() => {
                            getResultAnswer(shuffledAnswers[3], "D");
                            setIsClickedD("#0070f3");
                            insertStats();
                          }}
                          isDisabled={isDisabled}
                          colorScheme={isClickedD ? "teal" : "gray"}
                          size="lg"
                          h="auto"
                          py={4}
                          whiteSpace="normal"
                          textAlign="left"
                          _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "lg"
                          }}
                          transition="all 0.2s"
                        >
                          D: {shuffledAnswers[3]}
                        </Button>
                      </SimpleGrid>
                    </VStack>
                  </Box>

                  
                  {resultsAnswer && (
                    <Box w="full">
                      {resultsAnswer}
                    </Box>
                  )}

            

                  <Box w="full" bg="white" p={4} borderRadius="xl" boxShadow="md">
                    <AdSense adSlot="9876543210" format="rectangle" />
                  </Box>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
                    <Stat
                      px={6}
                      py={4}
                      shadow="lg"
                      border="1px"
                      borderColor="gray.200"
                      rounded="lg"
                      bg="white"
                    >
                      <StatLabel color="gray.500">Total Questions</StatLabel>
                      <StatNumber color="teal.500">{totalQuestions}</StatNumber>
                    </Stat>
                    <Stat
                      px={6}
                      py={4}
                      shadow="lg"
                      border="1px"
                      borderColor="gray.200"
                      rounded="lg"
                      bg="white"
                    >
                      <StatLabel color="gray.500">Correct Answers</StatLabel>
                      <StatNumber color="green.500">{totalCorrectQuestions}</StatNumber>
                    </Stat>
                    <Stat
                      px={6}
                      py={4}
                      shadow="lg"
                      border="1px"
                      borderColor="gray.200"
                      rounded="lg"
                      bg="white"
                    >
                      <StatLabel color="gray.500">Wrong Answers</StatLabel>
                      <StatNumber color="red.500">{totalWrongQuestions}</StatNumber>
                    </Stat>
                  </SimpleGrid>
                </VStack>
              )}
            </VStack>
          </Container>
        </Box>
      </ChakraProvider>
    </div>
  );
}
