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

  const [showCategoryOptions, setShowCategoryOptions] = useState(true);

  const toggleCategoryOptions = () => setShowCategoryOptions((prev) => !prev);

  const apiCall = () => {
    setIsEnabled(false);
    setIsClickedA("");
    setIsClickedB("");
    setIsClickedC("");
    setIsClickedD("");
    let choice;
    if (selectedDifficulties === "easy") {
      choice = "&difficulty=easy";
    } else if (selectedDifficulties === "medium") {
      choice = "&difficulty=medium";
    } else if (selectedDifficulties === "hard") {
      choice = "&difficulty=hard";
    } else {
      choice = "";
    }

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
            <Button onClick={apiCall}>Start</Button>
            <Button onClick={toggleCategoryOptions}>Options</Button>
            {showCategoryOptions && (
              <VStack spacing={2} align="start">
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
                <HStack>
                  <Text>Difficulty:</Text>
                  <VStack spacing={2} align="start">
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
                            setSelectedDifficulties((prevState) =>
                              isChecked
                                ? [...prevState, difficulty.name]
                                : prevState.filter((d) => d !== difficulty.name)
                            );
                          }}
                        />
                        <label htmlFor={difficulty.name}>
                          {difficulty.displayName}
                        </label>
                      </HStack>
                    ))}
                  </VStack>
                </HStack>
              </VStack>
            )}
          </HStack>
        </Center>
      </ChakraProvider>
      <br/>

      <ChakraProvider>
        <Stack spacing={4} align="center">
          {answers.questions.length > 0 && (
            <Box>
              <Box>
                <Center>
                  <Button onClick={apiCall} colorScheme="blue">
                    Next Question
                  </Button>
                </Center>
                <br />
              </Box>
              <Text>{answers.questions[0]?.question}</Text>
              <Text textAlign="center">
                <span>
                  Difficulty:
                  <strong> {answers.questions[0]?.difficulty} </strong>
                </span>{" "}
                <span>
                  Category: <strong> {answers.questions[0]?.category}</strong>
                </span>
              </Text>
              <br />
              <Center>
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
              </Center>
              <br />
              <Center>
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
              </Center>
              <br />
              <Center>
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
              </Center>
              <br />
              <Center>
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
              </Center>
              <br />
              <Text textAlign="center">
                <span>{resultsAnswer}</span>
                <br />
                <br />
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
