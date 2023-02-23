import { useState } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function Reservations() {
  let [answers, setAnswers] = useState({ questions: [] });
  let [isError, setError] = useState(false);
  let [selectedAnswer, setSelectedAnswer] = useState(null);
  let [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

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
        const shuffledAnswers = shuffle([
          result[0].correctAnswer,
          ...result[0].incorrectAnswers,
        ]);
        setAnswers({
          questions: [
            {
              id: result[0].id,
              question: result[0].question,
              correctAnswer: shuffledAnswers[Math.floor(Math.random() * 4)],
              incorrectAnswers: shuffledAnswers.filter(
                (answer) => answer !== result[0].correctAnswer
              ),
            },
          ],
        });
      })
      .catch((error) => setError(true));
    setSelectedAnswer(null);
    setIsCorrectAnswer(false);
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    setIsCorrectAnswer(answer === answers.questions[0].correctAnswer);
  };

  return (
    <>
      <div className={styles.grid}>
        <div>
          <div>
            <button className={styles.card} onClick={apiCall}>
              Gerar Questões
            </button>
          </div>

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
                      style={{
                        backgroundColor:
                          selectedAnswer === answers.questions[0]?.correctAnswer
                            ? isCorrectAnswer
                              ? "green"
                              : "red"
                            : null,
                      }}
                      onClick={() =>
                        handleAnswerClick(answers.questions[0]?.correctAnswer)
                      }
                    >
                      A
                    </button>{" "}
                    {answers.questions[0]?.correctAnswer}
                  </span>
                  <br />
                  <span>
                    <button
                      style={{
                        backgroundColor:
                          selectedAnswer ===
                          answers.questions[0]?.incorrectAnswers[0]
                            ? isCorrectAnswer
                              ? "green"
                              : "red"
                            : null,
                      }}
                      onClick={() =>
                        handleAnswerClick(
                          answers.questions[0]?.incorrectAnswers[0]
                        )
                      }
                    >
                      B
                    </button>{" "}
                    {answers.questions[0]?.incorrectAnswers[0]}
                  </span>
                  <br />
                  <span>
                    <button
                      style={{
                        backgroundColor:
                          selectedAnswer ===
                          answers.questions[0]?.incorrectAnswers[1]
                            ? isCorrectAnswer
                              ? "green"
                              : "red"
                            : null,
                      }}
                      onClick={() =>
                        handleAnswerClick(
                          answers.questions[0]?.incorrectAnswers[1]
                        )
                      }
                    >
                      C
                    </button>{" "}
                    {answers.questions[0]?.incorrectAnswers[1]}
                  </span>
                  <br />
                  <span>
                    <button
                      style={{
                        backgroundColor:
                          selectedAnswer ===
                          answers.questions[0]?.incorrectAnswers[2]
                            ? isCorrectAnswer
                              ? "green"
                              : "red"
                            : null,
                      }}
                      onClick={() =>
                        handleAnswerClick(
                          answers.questions[0]?.incorrectAnswers[2]
                        )
                      }
                    >
                      D
                    </button>{" "}
                    {answers.questions[0]?.incorrectAnswers[2]}
                  </span>
                  <br />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
