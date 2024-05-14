// QuizApp.tsx

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";

type Answer = {
  content: string;
  score: 0 | 1;
};

type Question = {
  id: string;
  content: string;
  answers: Answer[];
};

type Quiz = {
  id: string;
  title: string;
  timePerQuest: number;
  question: Question[];
};

const socket = io("http://localhost:5000"); // Connect to the backend server

export const QuizPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [username, setUsername] = useState<string>("");
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [score, setScore] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  const notify = (message: string, type: string) => {
    if (type === "error") {
      toast.error(message);
    }
    if (type === "success") {
      toast.success(message);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("http://localhost:5000/quizzes");
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  useEffect(() => {
    // Fetch the list of quizzes from the server
    fetchQuizzes();
  }, []);

  useEffect(() => {
    console.log("Setting up event listeners...");

    // Nghe sự kiện "scoreUpdated" từ máy chủ
    socket.on("scoreUpdated", (newScore) => {
      console.log("Score updated:", newScore);
      setScore(newScore);
    });

    // Nghe sự kiện "answerSubmitted" từ máy chủ
    socket.on("answerSubmitted", (answerResult) => {
      console.log("Answer submitted:", answerResult);
      if (answerResult === "correct") {
        notify("Correct answer!", "success");
      } else {
        notify("Wrong answer!", "error");
      }
    });

    // Xóa bỏ các trình nghe khi component unmount
    return () => {
      console.log("Cleaning up event listeners...");
      socket.off("scoreUpdated");
      socket.off("answerSubmitted");
    };
  }, []);

  const handleJoinQuiz = (quizId: string) => {
    // Join the selected quiz
    console.log("quiz id", quizId);
    socket.emit("joinQuiz", quizId, username);
    setSelectedQuiz(quizzes.find((quiz: Quiz) => quiz.id === quizId) || null);
  };

  const handleSubmitAnswer = async (
    answerIndex: number,
    questionId: string
  ) => {
    console.log(
      "submitAnswer",
      selectedQuiz?.id,
      "bao",
      answerIndex,
      questionId
    );
    // Submit the answer to the server
    if (selectedQuiz !== null && answerIndex !== null) {
      console.log(
        "submitAnswer",
        selectedQuiz.id,
        "bao",
        answerIndex,
        questionId
      );
      socket.emit(
        "submitAnswer",
        selectedQuiz.id,
        "bao",
        answerIndex,
        questionId
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      {selectedQuiz === null ? (
        <div className="w-1/3 p-4 bg-white shadow-xl rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-4 text-blue-500">
            Quiz App
          </h1>
          <input
            className="w-full p-2 border border-gray-400 mb-4 rounded"
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">
            Select a Quiz
          </h2>
          <ul>
            {quizzes.map((quiz) => (
              <li
                key={quiz.id}
                className="flex items-center justify-between border-b border-gray-400 p-2"
              >
                <p className="text-lg font-bold text-blue-500 cursor-pointer hover:underline">
                  {quiz.title}
                </p>

                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleJoinQuiz(quiz.id)}
                >
                  Join
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 bg-white rounded shadow-md w-96">
          <div className="flex justify-between items-center mb-4">
            <div
              className="cursor-pointer text-blue-500"
              onClick={() => window.history.back()}
            >
              Back
            </div>
            <h2 className="text-xl font-bold">Quiz: {selectedQuiz?.title}</h2>
            <div className="flex items-center">
              <p className="text-lg font-bold mr-2 text-blue-500">{score}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-lg font-semibold">
              {selectedQuiz.question[currentQuestion].content}
            </p>
            <ul>
              {selectedQuiz.question[currentQuestion].answers.map(
                (answer, index) => (
                  <li
                    className="cursor-pointer rounded p-2 mt-2 transition-colors duration-200 bg-slate-200 hover:bg-slate-300"
                    key={index}
                    onClick={() => {
                      handleSubmitAnswer(
                        index,
                        selectedQuiz.question[currentQuestion].id
                      ).then(() => {
                        if (
                          currentQuestion <
                          selectedQuiz.question.length - 1
                        ) {
                          setCurrentQuestion(currentQuestion + 1);
                        } else {
                          notify("Quiz completed!", "success");
                        }
                      });
                    }}
                  >
                    {answer.content}{" "}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
