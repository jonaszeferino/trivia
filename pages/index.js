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

  const [showCategoryOptions, setShowCategoryOptions] = useState(true);
  const toggleCategoryOptions = () => setShowCategoryOptions((prev) => !prev);

  const apiCall = () => {
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
      setResultsAnswer("Correct!");
      setTotalCorrectQuestions(totalCorrectQuestions + 1);
    } else {
      setResultsAnswer(
        ` ${questao} Is The Wrong Choise!. The correct answer is: ${answers.questions[0]?.correctAnswer}`
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
          <button className={styles.card} onClick={apiCall}>
            Start
          </button>

          <button onClick={toggleCategoryOptions} className={styles.card}>
            Options
          </button>
          {showCategoryOptions && (
            <div className="teste">
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
          <br />
          <div>
            <br />
            {answers.questions.length > 0 && (
              <div>
                <br />
                <div>
                  <br />
                  <h2>
                    <button className={styles.card_text} onClick={apiCall}>
                      Next Question
                    </button>
                  </h2>
                  <h2 className={styles.card_text}>
                    {answers.questions[0]?.question}
                  </h2>
                  <span>
                    Difficulty:
                    <strong> {answers.questions[0]?.difficulty} </strong>
                  </span>{" "}
                  <span>
                    Category: <strong> {answers.questions[0]?.category}</strong>
                  </span>
                  <br />
                  <span>
                    <button
                      className={styles.button}
                      onClick={() => getResultAnswer(shuffledAnswers[0], "A")}
                    >
                      A
                    </button>{" "}
                    <button
                      className={styles.button_text}
                      onClick={() => getResultAnswer(shuffledAnswers[0], "A")}
                    >
                      {shuffledAnswers[0]}
                    </button>{" "}
                    {/* <span className={styles.card}> {shuffledAnswers[0]}</span> */}
                  </span>
                  <br />
                  <span>
                    <button
                      className={styles.button}
                      onClick={() => getResultAnswer(shuffledAnswers[1], "B")}
                    >
                      B
                    </button>{" "}
                    <button
                      className={styles.button_text}
                      onClick={() => getResultAnswer(shuffledAnswers[1], "B")}
                    >
                      {shuffledAnswers[1]}
                    </button>{" "}
                    {/* <span className={styles.card}>{shuffledAnswers[1]}</span> */}
                  </span>
                  <br />
                  <span>
                    <button
                      className={styles.button}
                      onClick={() => getResultAnswer(shuffledAnswers[2], "C")}
                    >
                      C
                    </button>{" "}
                    <button
                      className={styles.button_text}
                      onClick={() => getResultAnswer(shuffledAnswers[2], "C")}
                    >
                      {shuffledAnswers[2]}
                    </button>{" "}
                    {/* <span className={styles.card}>{shuffledAnswers[2]}</span> */}
                  </span>
                  <br />
                  <span>
                    <button
                      className={styles.button}
                      onClick={() => getResultAnswer(shuffledAnswers[3], "D")}
                    >
                      D
                    </button>{" "}
                    <button
                      className={styles.button_text}
                      onClick={() => getResultAnswer(shuffledAnswers[3], "D")}
                    >
                      {shuffledAnswers[3]}
                    </button>{" "}
                    {/* <span className={styles.card}> {shuffledAnswers[3]} </span> */}
                  </span>
                  <br />
                  {/* <span>Correta: {answers.questions[0]?.correctAnswer}</span> */}
                  <span>
                    Total: {totalQuestions} Corrects: {totalCorrectQuestions}{" "}
                    Wrong: {totalWrongQuestions}
                  </span>
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
