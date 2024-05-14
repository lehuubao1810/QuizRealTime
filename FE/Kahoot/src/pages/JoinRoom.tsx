// QuizApp.tsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
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

// const serverUrl = {
//   local: "http://localhost:5000/",
//   deploy: "https://quizrealtime.onrender.com/"
// }

const socket = io("https://quizrealtime.onrender.com/"); // Connect to the backend server

export const JoinRoom: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [username, setUsername] = useState<string>("");
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  // const [score, setScore] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isJoin, setIsJoin] = useState<boolean>(false);
  const [timeUp, setTimeUp] = useState<{
    isTimeUp: boolean;
    answerCorrectIndex?: number;
  }>({
    isTimeUp: false,
    answerCorrectIndex: undefined,
  });
  const [answerIndex, setAnswerIndex] = useState<number>();
  // const [isQuizEnd, setIsQuizEnd] = useState<boolean>(false);

  const navigate = useNavigate();

  // const notify = (message: string, type: string) => {
  //   if (type === "error") {
  //     toast.error(message);
  //   }
  //   if (type === "success") {
  //     toast.success(message);
  //   }
  // };

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`https://quizrealtime.onrender.com/quizzes`);
      const data = await response.json();
      setQuizzes([data]);
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
    // socket.on("scoreUpdate", (newScore) => {
    //   console.log("Score updated:", newScore);
    //   setScore(newScore);
    // });

    // Nghe sự kiện "answerSubmitted" từ máy chủ
    // socket.on("answerResult", (correct) => {
    //   console.log("Answer submitted: ", correct);
    // });

    // get current question
    socket.on("newQuestion", (data) => {
      // console.log("New question:", data);
      setCurrentQuestion(data.currentQuestion);
      setTimeLeft(data.timeLeft);
      setTimeUp({
        isTimeUp: false,
        answerCorrectIndex: undefined,
      });
      setAnswerIndex(undefined);
    });

    // get time left
    socket.on("timeUpdate", (time) => {
      console.log("Time left:", time);
      setTimeLeft(time);
    });

    // get status of time up
    socket.on("timeUp", (data) => {
      console.log("Time up:", data);
      setTimeUp({
        isTimeUp: true,
        answerCorrectIndex: data,
      });
    });

    // End quiz
    socket.on("quizEnd", (result) => {
      console.log("Quiz ended", result);
      // setIsQuizEnd(true);
      navigate("/result", { state: { users: result.users } });
    });

    // Xóa bỏ các trình nghe khi component unmount
    return () => {
      console.log("Cleaning up event listeners...");
      // socket.off("scoreUpdate");
      // socket.off("answerResult");
      socket.off("newQuestion");
      socket.off("timeUpdate");
      socket.off("timeUp");
      socket.off("quizEnd");
    };
  }, []);

  const handleJoinQuiz = (quizId: string) => {
    // Join the selected quiz
    console.log("quiz id", quizId);
    socket.emit("joinQuiz", username);
    setSelectedQuiz(quizzes.find((quiz: Quiz) => quiz.id === quizId) || null);
    setIsJoin(true);
  };

  const bgQuestion = useCallback(
    (index: number) => {
      console.table({
        isTimeUp: timeUp.isTimeUp,
        answerIndex,
        answerCorrectIndex: timeUp.answerCorrectIndex,
      });
      if (timeUp.isTimeUp) {
        if (answerIndex) {
          if (answerIndex === timeUp.answerCorrectIndex) {
            if (answerIndex === index) {
              return "bg-green-500 text-white";
            } else {
              return "bg-slate-200";
            }
          } else {
            if (answerIndex === index) {
              return "bg-red-500 text-white";
            } else if (timeUp.answerCorrectIndex === index) {
              return "bg-green-500 text-white";
            } else {
              return "bg-slate-200";
            }
          }
        } else {
          if (timeUp.answerCorrectIndex === index) {
            return "bg-green-500 text-white";
          } else {
            return "bg-slate-200";
          }
        }
      } else {
        if (answerIndex === index) {
          return "bg-blue-500 text-white";
        } else {
          return "bg-slate-200";
        }
      }
    },
    [answerIndex, timeUp]
  );

  const handleStartQuiz = () => {
    socket.emit("start");
    console.log("start quiz");
  };

  const handleSubmitAnswer = async (
    answerIndex: number,
    questionId: string
  ) => {
    console.log(
      "submitAnswer",
      selectedQuiz?.id,
      username,
      answerIndex,
      questionId
    );
    // Submit the answer to the server
    if (selectedQuiz !== null && answerIndex !== null) {
      console.log(
        "submitAnswer",
        selectedQuiz.id,
        username,
        answerIndex,
        questionId
      );
      socket.emit(
        "answer",
        // selectedQuiz.id,
        // username,
        answerIndex
        // questionId
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      {currentQuestion === undefined ? (
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

                {!isJoin ? (
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleJoinQuiz(quiz.id)}
                  >
                    Join
                  </button>
                ) : (
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleStartQuiz()}
                  >
                    Start
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 bg-white rounded shadow-md w-96">
          <div
            className="
          fixed top-10 right-10 w-10 h-10 flex items-center justify-center text-bold text-lg
           bg-blue-500 text-white rounded-full
           "
          >
            {timeLeft}
          </div>
          <div className="flex justify-center items-center mb-4">
            {/* <div
              className="cursor-pointer text-blue-500"
              onClick={() => window.history.back()}
            >
              Back
            </div> */}
            <h2 className="text-xl font-bold">Quiz: {selectedQuiz?.title}</h2>
            {/* <div className="flex items-center">
              <p className="text-lg font-bold mr-2 text-blue-500">{score}</p>
            </div> */}
          </div>

          <div className="mt-4">
            <p className="text-lg font-semibold">{currentQuestion.content}</p>
            <ul>
              {currentQuestion.answers.map((answer, index) => (
                <li
                  className={`cursor-pointer rounded p-2 mt-2 transition-colors duration-200 hover:bg-blue-400
                  ${bgQuestion(index)} 
                  ${timeUp.isTimeUp && "pointer-events-none opacity-60"}
                  
                  `}
                  key={index}
                  onClick={() => {
                    setAnswerIndex(index);
                    handleSubmitAnswer(index, currentQuestion.id);
                  }}
                >
                  {answer.content}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
