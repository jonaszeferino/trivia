import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

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
  const [isEnabled,setIsEnabled] = useState(false);
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
    { name: "history", displayName: "Cinema & TV" },
    { name: "music", displayName: "History" },
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
      <h1 className={styles.grid}>Trivia</h1>
      <h2 className={styles.grid}>
        <br />
        <div>
          <button className={styles.button} onClick={apiCall}>
            Start
          </button>

          <button onClick={toggleCategoryOptions} className={styles.button}>
            Options
          </button>

          {showCategoryOptions && (
            <div className="teste">
              <span>Areas:</span>
              {categoryOptions.map((category, index) => (
                <div key={index}>
                  <input
                    className={styles.test}
                    type="checkbox"
                    id={category.name}
                    name={category.name}
                    checked={selectedCategories.includes(category.name)}
                    onChange={(event) => {
                      const isChecked = event.target.checked;
                      setSelectedCategories((prevState) =>
                        isChecked
                          ? [...prevState, category.name]
                          : prevState.filter((c) => c !== category.name)
                      );
                    }}
                  />
                  <label htmlFor={category.name}>{category.displayName}</label>
                </div>
              ))}
              <span>
                <span>Difficulty:</span>
                <div>
                  {difficultyOptions.map((difficulty, index) => (
                    <div key={index}>
                      <input
                        type="checkbox"
                        id={difficulty.name}
                        name={difficulty.name}
                        checked={selectedDifficulties.includes(difficulty.name)}
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
                    </div>
                  ))}
                </div>
              </span>
            </div>
          )}
        </div>
      </h2>

      <div className={styles.grid}>
        <span>{resultsAnswer}</span>
      </div>
      <div className={styles.grid}>
        <div>
          <div>
            {answers.questions.length > 0 && (
              <div>
                <div>
                  <h2>
                    <button className={styles.card_text} onClick={apiCall}>
                      Next Question
                    </button>
                  </h2>
                  <h2
                    className={styles.card_text}
                    style={{ backgroundColor: "white" }}
                  >
                    {answers.questions[0]?.question}
                  </h2>
                  <h5 style={{ textAlign: "center" }}>
                    <span>
                      Difficulty:
                      <strong> {answers.questions[0]?.difficulty} </strong>
                    </span>{" "}
                    <span>
                      Category:{" "}
                      <strong> {answers.questions[0]?.category}</strong>
                    </span>
                    <br />
                  </h5>

                  <span>
                    <button
                      className={styles.button}
                      style={{ backgroundColor: isClickedA }}
                      onClick={() => {
                      getResultAnswer(shuffledAnswers[0], "A");
                      setIsClickedA("#0070f3");}}
                      disabled={isEnabled}
                    >
                      A
                    </button>{" "}
                    <button
                      className={styles.button_text}
                      style={{ backgroundColor: isClickedA }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[0], "A");
                        setIsClickedA("#0070f3");}}
                      disabled={isEnabled}
                    >
                      {shuffledAnswers[0]}
                    </button>{" "}
                  </span>
                  <br />
                  <span>
                    <button
                      className={styles.button}
                      style={{ backgroundColor: isClickedB }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[1], "B");
                        setIsClickedB("#0070f3");}}
                      
                      disabled={isEnabled}
                    >
                      B
                    </button>{" "}
                    <button
                      className={styles.button_text}
                      style={{ backgroundColor: isClickedB }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[1], "B");
                        setIsClickedB("#0070f3");}}
                      disabled={isEnabled}
                    >
                      {shuffledAnswers[1]}
                    </button>{" "}
                    {/* <span className={styles.card}>{shuffledAnswers[1]}</span> */}
                  </span>
                  <br />
                  <span>
                    <button
                      className={styles.button}
                      style={{ backgroundColor: isClickedC }}
                      onClick={() => {getResultAnswer(shuffledAnswers[2], "C");
                      setIsClickedC("#0070f3")}}
                      disabled={isEnabled}
                    >
                      C
                    </button>{" "}
                    <button
                      className={styles.button_text}
                      style={{ backgroundColor: isClickedC }}
                      onClick={() => {getResultAnswer(shuffledAnswers[2], "C");
                      setIsClickedC("#0070f3")}}
                      disabled={isEnabled}
                    >
                      {shuffledAnswers[2]}
                    </button>{" "}
                    {/* <span className={styles.card}>{shuffledAnswers[2]}</span> */}
                  </span>
                  <br />
                  <span>
                    <button
                      className={styles.button}
                      style={{ backgroundColor: isClickedD }}
                      onClick={() => {getResultAnswer(shuffledAnswers[3], "D");
                      setIsClickedD("#0070f3")}}
                      disabled={isEnabled}
                    >
                      D
                    </button>{" "}
                    <button
                      className={styles.button_text}
                      style={{ backgroundColor: isClickedD }}
                      onClick={() => {getResultAnswer(shuffledAnswers[3], "D");
                      setIsClickedD("#0070f3")}}
                      disabled={isEnabled}
                    >
                      {shuffledAnswers[3]}
                    </button>{" "}
                  </span>
                  <br />



                  <h5 style={{ textAlign: "center" }}>
                    <span>
                      Total: {totalQuestions} Corrects: {totalCorrectQuestions}{" "}
                      Wrong: {totalWrongQuestions}
                    </span>
                  </h5>
                  <br />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
