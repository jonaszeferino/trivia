import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Reservations() {
  const [answers, setAnswers] = useState({ questions: [] });
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [resultsAnswer, setResultsAnswer] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [resultado, setResultado] = useState("");

  const apiCall = () => {
    const url = `https://the-trivia-api.com/api/questions?limit=1&categories=science,history`;
    setResultsAnswer("");
    setSelectedAnswer("");
    setResultado("");

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

  function getResultAnswer() {
    let resultAnswer = "";
    if (answers.questions[0]?.correctAnswer) {
      switch (shuffledAnswers.indexOf(answers.questions[0]?.correctAnswer)) {
        case 0:
          resultAnswer = "Correta Letra A";
          setResultado("A");
          break;
        case 1:
          resultAnswer = "Correta Letra B";
          setResultado("B");
          break;
        case 2:
          resultAnswer = "Correta Letra C";
          setResultado("C");
          break;
        case 3:
          resultAnswer = "Correta Letra D";
          setResultado("D");
          break;
        default:
          resultAnswer = "";
      }
    }
    setResultsAnswer(resultAnswer);
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
        </div>
        <br />
        <div>
          <span> Resultado: {resultsAnswer}</span>
        </div>
      </h2>

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
                      onClick={() => getResultAnswer(shuffledAnswers[0], "A")}
                      style={{
                        backgroundColor:
                          resultado === "A"
                            ? "green"
                            : resultado !== null
                            ? "red"
                            : "initial",

                        backgroundColor:
                          resultado === null ? "blue" : "initial",
                      }}
                    >
                      A
                    </button>{" "}
                    {shuffledAnswers[0]}
                  </span>
                  <br />
                  <span>
                    <button
                      onClick={() => getResultAnswer(shuffledAnswers[1], "B")}
                      style={{
                        backgroundColor:
                          resultsAnswer === "Correta Letra B"
                            ? "green"
                            : resultsAnswer === "Letra B"
                            ? "red"
                            : "initial",
                      }}
                    >
                      B
                    </button>{" "}
                    {shuffledAnswers[1]}
                  </span>
                  <br />
                  <span>
                    <button
                      onClick={() => getResultAnswer(shuffledAnswers[2], "C")}
                      style={{
                        backgroundColor:
                          resultsAnswer === "Correta Letra C"
                            ? "green"
                            : resultsAnswer === "Letra C"
                            ? "red"
                            : "initial",
                      }}
                    >
                      C
                    </button>{" "}
                    {shuffledAnswers[2]}
                  </span>
                  <br />
                  <span>
                    <button
                      onClick={() => getResultAnswer(shuffledAnswers[3], "D")}
                      style={{
                        backgroundColor:
                          resultsAnswer === "Correta Letra D"
                            ? "green"
                            : resultsAnswer === "Letra D"
                            ? "red"
                            : "initial",
                      }}
                    >
                      D
                    </button>{" "}
                    {shuffledAnswers[3]}
                  </span>
                  <br />

                  <span>Correta: {answers.questions[0]?.correctAnswer}</span>

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
