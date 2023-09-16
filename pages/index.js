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
} from "@chakra-ui/react";

export default function Reservations() {
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
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isClickedA, setIsClickedA] = useState("");
  const [isClickedB, setIsClickedB] = useState("");
  const [isClickedC, setIsClickedC] = useState("");
  const [isClickedD, setIsClickedD] = useState("");

  const [firstTime, setFirstTime] = useState(true);

  const [showCategoryOptions, setShowCategoryOptions] = useState(true);

  const toggleCategoryOptions = () => setShowCategoryOptions((prev) => !prev);

  const apiCall = () => {
    setIsEnabled(false);
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
    if (recebido === answers.questions[0]?.correctAnswer) {
      setIsEnabled(true);
      setResultsAnswer(
        <span
          style={{
            color: "white",
            fontWeight: "bold",
            backgroundColor: "green",
            borderRadius: "7px",
            padding: "7px",
          }}
        >
          Correct!
        </span>
      );
      setTotalCorrectQuestions(totalCorrectQuestions + 1);
    } else {
      setIsEnabled(true);
      setResultsAnswer(
        <span
          style={{
            color: "white",
            fontWeight: "bold",
            backgroundColor: "red",
            borderRadius: "7px",
            padding: "7px",
          }}
        >
          {questao}: Is The Wrong Choice!. The correct answer is:{" "}
          {answers.questions[0]?.correctAnswer}
        </span>
      );
      setTotalWrongQuestions(totalWrongQuestions + 1);
    }
  }

  function handleSelectAnswer(answer) {
    setSelectedAnswer(answer);
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

  return (
    <div>
      <ChakraProvider>
        <Center>
          <HStack spacing={4} align="center">
            <Button onClick={toggleCategoryOptions}>Options</Button>
          </HStack>
        </Center>
        <Center>
          {showCategoryOptions && (
            <VStack align="start" spacing={4}>
              <Center>
                <Box>
                  <Text>Areas:</Text>
                  {categoryOptions.map((category, index) => (
                    <HStack key={index}>
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
                  ))}
                </Box>
              </Center>
              <Center>
                <Box>
                  <Text>Difficulty:</Text>

                  <HStack spacing={2}>
                    {difficultyOptions.map((difficulty, index) => (
                      <HStack key={index}>
                        <Checkbox
                          id={difficulty.name}
                          name={difficulty.name}
                          isChecked={selectedDifficulties.includes(
                            difficulty.name
                          )}
                          onChange={(event) => {
                            const isChecked = event.target.checked;
                            if (isChecked) {
                              // Se um novo é marcado, desmarque todos os outros
                              setSelectedDifficulties([difficulty.name]);
                            } else {
                              // Se for desmarcado, remova-o da lista
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
                    ))}
                  </HStack>
                </Box>
              </Center>
            </VStack>
          )}
        </Center>
      </ChakraProvider>
      <Center>
        <Text style={{ margin: "10px" }}>
          Without any selection, the questions will come randomly with all
          subjects and difficulties
        </Text>
      </Center>

      <br />

      <ChakraProvider>
        <Box>
          <Center>
            <Button
              onClick={() => {
                apiCall();
                setFirstTime(false);
                setTotalQuestions(0);
                setTotalCorrectQuestions(0);
                setTotalWrongQuestions(0);
              }}
            >
              Start
            </Button>
          </Center>
          <Center>
            {!firstTime && (
              <Button onClick={apiCall} colorScheme="blue" disabled={true}>
                Next Question
              </Button>
            )}
          </Center>
          <br />
        </Box>
        <Stack spacing={4} align="center">
          {answers.questions.length > 0 && (
            <Box>
              <Text style={{ margin: "10px" }}>
                {answers.questions[0]?.question}
              </Text>

              <br />
              <Center>
                <VStack spacing={2} align="start">
                  <HStack spacing={2} align="start">
                    <Button
                      style={{ backgroundColor: isClickedA }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[0], "A");
                        setIsClickedA("#0070f3");
                      }}
                      disabled={isEnabled}
                    >
                      A
                    </Button>{" "}
                    <Button
                      style={{ backgroundColor: isClickedA }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[0], "A");
                        setIsClickedA("#0070f3");
                      }}
                      disabled={isEnabled}
                    >
                      {shuffledAnswers[0]}
                    </Button>{" "}
                  </HStack>
                  <HStack spacing={2} align="start">
                    <Button
                      style={{ backgroundColor: isClickedB }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[1], "B");
                        setIsClickedB("#0070f3");
                      }}
                      disabled={isEnabled}
                    >
                      B
                    </Button>{" "}
                    <Button
                      style={{ backgroundColor: isClickedB }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[1], "B");
                        setIsClickedB("#0070f3");
                      }}
                      disabled={isEnabled}
                    >
                      {shuffledAnswers[1]}
                    </Button>{" "}
                  </HStack>
                  <HStack spacing={2} align="start">
                    <Button
                      style={{ backgroundColor: isClickedC }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[2], "C");
                        setIsClickedC("#0070f3");
                      }}
                      disabled={isEnabled}
                    >
                      C
                    </Button>{" "}
                    <Button
                      style={{ backgroundColor: isClickedC }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[2], "C");
                        setIsClickedC("#0070f3");
                      }}
                      disabled={isEnabled}
                    >
                      {shuffledAnswers[2]}
                    </Button>{" "}
                  </HStack>
                  <HStack spacing={2} align="start">
                    <Button
                      style={{ backgroundColor: isClickedD }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[3], "D");
                        setIsClickedD("#0070f3");
                      }}
                      disabled={isEnabled}
                    >
                      D
                    </Button>{" "}
                    <Button
                      style={{ backgroundColor: isClickedD }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[3], "D");
                        setIsClickedD("#0070f3");
                      }}
                      disabled={isEnabled}
                    >
                      {shuffledAnswers[3]}
                    </Button>{" "}
                  </HStack>
                </VStack>
              </Center>
              <br />
              <Text textAlign="center">
                <span>{resultsAnswer}</span>
                <br />
                <br />
                <Text textAlign="center">
                  <span>
                    Difficulty:
                    <strong> {answers.questions[0]?.difficulty} </strong>
                  </span>{" "}
                  <span>
                    Category: <strong> {answers.questions[0]?.category}</strong>
                  </span>
                </Text>
                <span>
                  Total: {totalQuestions} Corrects: {totalCorrectQuestions}{" "}
                  Wrong: {totalWrongQuestions}
                </span>
              </Text>
            </Box>
          )}
        </Stack>
      </ChakraProvider>
    </div>
  );
}
