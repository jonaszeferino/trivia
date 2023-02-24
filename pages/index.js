import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Reservations() {
  const [answers, setAnswers] = useState({ questions: [] });
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [resultsAnswer, setResultsAnswer] = useState("");
  const [categories, setCategories] = useState("");
  const [difficulty, setDifficult] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [resultado, setResultado] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalWrongQuestions, setTotalWrongQuestions] = useState(0);
  const [totalCorrectQuestions, setTotalCorrectQuestions] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const apiCall = () => {
    const url = `https://the-trivia-api.com/api/questions?limit=1&categories=${selectedCategories.join(
      ","
    )}&difficulty=easy`;
    setResultsAnswer("");
    setSelectedAnswer("");
    setResultado("");
    setTotalQuestions(totalQuestions + 1);

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
    { name: "history", displayName: "Cinema e TV" },
    { name: "music", displayName: "History" },
    { name: "science", displayName: "Science" },
    { name: "society_and_culture", displayName: "Society & Culture" },
    { name: "sport_and_leisure", displayName: "Sport & Leisure" },
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

          <div>
            {categoryOptions.map((category, index) => (
              <div key={index}>
                <input
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
          </div>
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
                  <button className={styles.card} onClick={apiCall}>
                    Next Question
                  </button>
                  <h2>{answers.questions[0]?.question}</h2>

                  <span>
                    <button
                      className={styles.button}
                      onClick={() => getResultAnswer(shuffledAnswers[0], "A")}
                    >
                      A
                    </button>{" "}
                    <span className={styles.card}> {shuffledAnswers[0]}</span>
                  </span>
                  <br />
                  <span>
                    <button
                      className={styles.button}
                      onClick={() => getResultAnswer(shuffledAnswers[1], "B")}
                    >
                      B
                    </button>{" "}
                    <span className={styles.card}>{shuffledAnswers[1]}</span>
                  </span>
                  <br />
                  <span>
                    <button
                      className={styles.button}
                      onClick={() => getResultAnswer(shuffledAnswers[2], "C")}
                    >
                      C
                    </button>{" "}
                    <span className={styles.card}>{shuffledAnswers[2]}</span>
                  </span>
                  <br />
                  <span>
                    <button
                      className={styles.button}
                      onClick={() => getResultAnswer(shuffledAnswers[3], "D")}
                    >
                      D
                    </button>{" "}
                    <span className={styles.card}> {shuffledAnswers[3]} </span>
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
