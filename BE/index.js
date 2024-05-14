import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

// socket.io
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(cors());

// Dummy data for quizzes (replace with database)
const quiz = {
  id: "1",
  title: "quiz1",
  timePerQuest: 10,
  questions: [
    {
      id: "1",
      content: "What is the chemical symbol for water?",
      answers: [
        { content: "H2O", score: 1 },
        { content: "O2", score: 0 },
        { content: "CO2", score: 0 },
        { content: "HO2", score: 0 },
      ],
    },
    {
      id: "2",
      content: "Who was the first President of the United States?",
      answers: [
        { content: "Thomas Jefferson", score: 0 },
        { content: "George Washington", score: 1 },
        { content: "Abraham Lincoln", score: 0 },
        { content: "John Adams", score: 0 },
      ],
    },
    {
      id: "3",
      content: "Which planet is known as the Red Planet?",
      answers: [
        { content: "Mars", score: 1 },
        { content: "Jupiter", score: 0 },
        { content: "Saturn", score: 0 },
        { content: "Venus", score: 0 },
      ],
    },
    {
      id: "4",
      content: "What is the longest river in the world?",
      answers: [
        { content: "Nile", score: 1 },
        { content: "Amazon", score: 0 },
        { content: "Yangtze", score: 0 },
        { content: "Mississippi", score: 0 },
      ],
    },
    {
      id: "5",
      content: "Who developed the theory of relativity?",
      answers: [
        { content: "Albert Einstein", score: 1 },
        { content: "Isaac Newton", score: 0 },
        { content: "Galileo Galilei", score: 0 },
        { content: "Nikola Tesla", score: 0 },
      ],
    },
    {
      id: "6",
      content: "What is the largest ocean on Earth?",
      answers: [
        { content: "Atlantic Ocean", score: 0 },
        { content: "Indian Ocean", score: 0 },
        { content: "Arctic Ocean", score: 0 },
        { content: "Pacific Ocean", score: 1 },
      ],
    },
    {
      id: "7",
      content: "Which element has the atomic number 1?",
      answers: [
        { content: "Oxygen", score: 0 },
        { content: "Hydrogen", score: 1 },
        { content: "Helium", score: 0 },
        { content: "Lithium", score: 0 },
      ],
    },
    {
      id: "8",
      content: "Who was the first man to step on the moon?",
      answers: [
        { content: "Buzz Aldrin", score: 0 },
        { content: "Neil Armstrong", score: 1 },
        { content: "Yuri Gagarin", score: 0 },
        { content: "Michael Collins", score: 0 },
      ],
    },
    {
      id: "9",
      content: "What is the smallest country in the world?",
      answers: [
        { content: "Monaco", score: 0 },
        { content: "Vatican City", score: 1 },
        { content: "San Marino", score: 0 },
        { content: "Liechtenstein", score: 0 },
      ],
    },
    {
      id: "10",
      content: "In which year did the Titanic sink?",
      answers: [
        { content: "1912", score: 1 },
        { content: "1905", score: 0 },
        { content: "1915", score: 0 },
        { content: "1920", score: 0 },
      ],
    },
  ],
};

let users = [];
let currentQuestionIndex = -1;
let currentQuestion = quiz.questions[currentQuestionIndex];
let timeLeft = quiz.timePerQuest;

// Socket.IO events
io.on("connection", (socket) => {
  console.log("New client connected");
  console.log("socket.id connected: ", socket.id);

  // Handle joining a quiz
  socket.on("joinQuiz", (username) => {
    if (!quiz) {
      socket.emit("quizError", "Quiz not found");
      return;
    }

    // Add the user to the quiz
    socket.join(quiz.id);
    socket.emit("quizJoined", { quizId: quiz.id, currentQuestion, timeLeft });
    // Add the user to the users array
    users.push({
      username,
      socketId: socket.id,
      quizId: quiz.id,
      score: 0,
      answerIndex: undefined,
    });
    console.log(`${username} joined quiz ${quiz.id}`);
  });

  // Handle receiving an answer from a user
  socket.on("answer", (answerIndexClient) => {
    console.log("socket.id: ", socket.id);
    const user = users.find((u) => u.socketId === socket.id);
    if (!user) {
      socket.emit("answerError", "User not found");
      return;
    }
    user.answerIndex = answerIndexClient;
    // Emit score update to the user
    socket.emit("scoreUpdate", user.username, user.score);
  });

  // Handle starting the quiz
  socket.on("start", () => {
    if (users.length === 0) {
      socket.emit("quizError", "No users in the quiz");
      return;
    }
    console.log("users: ", users);
    nextQuestion();
  });

  // Handle getting the current question and moving to the next question
  const nextQuestion = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex >= quiz.questions.length) {
      // sort users by score
      const sortedUsers = users.sort((a, b) => b.score - a.score);

      io.to(quiz.id).emit("quizEnd", {
        users: sortedUsers,
        quizEnd: true,
      });
      return;
    }

    currentQuestion = quiz.questions[currentQuestionIndex];
    timeLeft = quiz.timePerQuest;
    users.forEach((user) => {
      user.answerIndex = undefined;
    });
    io.to(quiz.id).emit("newQuestion", { currentQuestion, timeLeft });

    // Set interval for countdown
    const interval = setInterval(() => {
      timeLeft--;
      io.to(quiz.id).emit("timeUpdate", timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
        // Return the correct answer index
        const correctAnswerIndex = currentQuestion.answers.findIndex(
          (a) => a.score === 1
        );

        // Emit score update to the user
        io.to(quiz.id).emit("timeUp", correctAnswerIndex);

        // Check if the user answered correctly
        users.forEach((user) => {
          if (user.answerIndex === null || user.answerIndex === undefined) {
            console.log(`${user.username} answered ${user.answerIndex}: Wrong`);
          } else {
            const answer =
              currentQuestion.answers[user.answerIndex].score === 1;
            if (answer) {
              console.log(
                `${user.username} answered ${user.answerIndex}: Right`
              );
              user.score += 1;
            } else {
              console.log(
                `${user.username} answered ${user.answerIndex}: Wrong`
              );
            }
          }
        });

        // Emit score update to the user
        // console.log("answerIndex: ", answerIndex);
        // if (answerIndex === null || answerIndex === undefined) {
        //   console.log(`${user.username} answered ${answerIndex}: Wrong`);
        //   socket.emit("answerResult", { correct: false });
        // } else {
        //   const answer = currentQuestion.answers[answerIndex].score === 1;
        //   if (answer) {
        //     console.log(`${user.username} answered ${answerIndex}: Right`);
        //     user.score += 1;
        //     socket.emit("answerResult", { correct: true });
        //   } else {
        //     console.log(`${user.username} answered ${answerIndex}: Wrong`);
        //     socket.emit("answerResult", { correct: false });
        //   }
        // }

        // Delay next question by 2 second
        setTimeout(() => {
          nextQuestion();
        }, 2000);
      }
    }, 1000);
  };

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    users = users.filter((user) => user.username !== socket.id);
  });
});

// Routes
app.post("/createQuiz", (req, res) => {
  const quiz = req.body;
  quiz.id = Date.now().toString(); // Generate a unique ID
  quizzes.push(quiz);
  res.status(201).json({ id: quiz.id });
});

app.get("/quizzes", (req, res) => {
  res.json(quiz);
});

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
