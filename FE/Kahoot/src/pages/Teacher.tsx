// QuizApp.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { socket } from "../constants/socket";

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
  isPublished: boolean;
};

type User = {
  username: string;
  socketId: string;
  quizId: string;
  score: number;
};

// Connect to the backend server

export const Teacher: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [key, setKey] = useState<string>("");

  // const [isQuizEnd, setIsQuizEnd] = useState<boolean>(false);

  const navigate = useNavigate();

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
      const response = await fetch(`http://localhost:5000/getQuiz`);
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
    // get current users in the room
    socket.on("usersJoined", (data) => {
      console.log("usersJoined", data);
      setUsers(data);
    });

    // Update isPublished status
    socket.on("quizPublished", (data) => {
      console.log("quizPublished", data);
      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id === data.id ? { ...quiz, isPublished: true } : quiz
        )
      );
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

  const handleStartQuiz = () => {
    if (key === "") {
      notify("Please enter the key", "error");
      return;
    }
    if (key === "29092002") {
      socket.emit("start");
      console.log("start quiz");
      return;
    } else {
      notify("Wrong key", "error");
    }
    return;
  };

  const handlePublishQuiz = () => {
    if (key === "") {
      notify("Please enter the key", "error");
      return;
    }
    if (key === "29092002") {
      socket.emit("publish");
      console.log("publish quiz");
      return;
    } else {
      notify("Wrong key", "error");
    }
    return;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="w-1/3 p-4 bg-white shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-4 text-blue-500">
          Quiz App
        </h1>
        <input
          className="w-full p-2 border border-gray-400 mb-4 rounded"
          type="password"
          placeholder="Enter the key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">
          List Quiz
        </h2>
        <ul>
          {quizzes.map((quiz: Quiz) => (
            <li key={quiz.id} className="border-b border-gray-400 p-2">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-bold text-blue-500 cursor-pointer hover:underline">
                  {quiz.title}
                </p>

                {!quiz.isPublished ? (
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                    onClick={() => handlePublishQuiz()}
                  >
                    Publish
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
              </div>

              <ul className="">
                {users.map((user: User) => (
                  <li
                    key={user.socketId}
                    className="flex items-center justify-between w-full p-2 bg-white
                             rounded-lg my-2 border-2 border-cyan-500"
                  >
                    <h2 className="text-xl font-bold text-blue-500">
                      {user.username}
                    </h2>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
