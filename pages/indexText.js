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
  const [elapsedTime, setElapsedTime] = useState(0);
  let [intervalId, setIntervalID] = useState();

  function startTimer() {
    intervalId = setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(intervalId);
  }

  const apiCall = () => {
    const url = `https://the-trivia-api.com/api/questions?limit=1&categories=science,history,&difficulty=easy`;
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
    startTimer();
  }, []);

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
      setResultsAnswer("Você escolheu a resposta correta!");
      setTotalCorrectQuestions(totalCorrectQuestions + 1);
    } else {
      setResultsAnswer(
        `Você escolheu a resposta errada: ${questao}. A resposta correta é ${answers.questions[0]?.correctAnswer}`
      );
      setTotalWrongQuestions(totalWrongQuestions + 1);
    }
  }

  function handleSelectAnswer(answer) {
    setSelectedAnswer(answer);
  }

  return (
    <div>
      <h1 className={styles.grid}>Trivia</h1>
      <h2 className={styles.grid}>
        <br />
        <div>
          <button className={styles.card} onClick={apiCall}>
            Gerar Questões
          </button>
          <br />
        </div>
        <br />
      </h2>
      <div className={styles.grid}>
        <span> Resultado: {resultsAnswer}</span>
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
                    Wrong: {totalWrongQuestions}{" "}
                  </span>
                  <span>Tempo: {elapsedTime}</span>

                  <span>
                    <button
                      className={styles.button}
                      onClick={() => stopTimer()}
                    >
                      Parar o tempo
                    </button>{" "}
                    <span className={styles.card}> {shuffledAnswers[3]} </span>
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
