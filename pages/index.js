import { useState } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";

export default function Reservations() {
  // let [quotes, setQuotes] = useState();
  let [answers, setAnswers] = useState({ questions: [] });
  let [isError, setError] = useState(false);

  const apiCall = (event) => {
    const url = `https://the-trivia-api.com/api/questions?limit=1&categories=science,history`;
    setError(false);

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

  return (
    <div>
      <h1 className={styles.grid}>Trivia</h1>
      <h2 className={styles.grid}>
        <br />
        <button className={styles.card} onClick={apiCall}>
          Gerar Questões
        </button>
      </h2>

      {/* {isError === true ? (
        <ErrorPage message={`Verifique as Credenciais`}></ErrorPage>
      ) : ( */}
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
                    <button>A</button> {answers.questions[0]?.correctAnswer}
                  </span>
                  <br />
                  <span>
                    <button>B</button>{" "}
                    {answers.questions[0]?.incorrectAnswers[0]}
                  </span>
                  <br />
                  <span>
                    <button>C</button>{" "}
                    {answers.questions[0]?.incorrectAnswers[1]}
                  </span>
                  <br />
                  <span>
                    <button>D</button>{" "}
                    {answers.questions[0]?.incorrectAnswers[2]}
                  </span>
                  <br />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
}
