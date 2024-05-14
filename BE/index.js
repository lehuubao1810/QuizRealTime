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
      content: "What is the capital of Japan?",
      answers: [
        { content: "Tokyo", score: 1 },
        { content: "Seoul", score: 0 },
        { content: "Beijing", score: 0 },
        { content: "Bangkok", score: 0 },
      ],
    },
    {
      id: "2",
      content: "Who painted the Mona Lisa?",
      answers: [
        { content: "Leonardo da Vinci", score: 1 },
        { content: "Pablo Picasso", score: 0 },
        { content: "Vincent van Gogh", score: 0 },
        { content: "Michelangelo", score: 0 },
      ],
    },
    {
      id: "3",
      content: "In which country did the tango dance originate?",
      answers: [
        { content: "Argentina", score: 1 },
        { content: "Brazil", score: 0 },
        { content: "Spain", score: 0 },
        { content: "Italy", score: 0 },
      ],
    },
    {
      id: "4",
      content: "What is the main language spoken in Brazil?",
      answers: [
        { content: "Portuguese", score: 1 },
        { content: "Spanish", score: 0 },
        { content: "French", score: 0 },
        { content: "Italian", score: 0 },
      ],
    },
    {
      id: "5",
      content: "Who wrote 'Romeo and Juliet'?",
      answers: [
        { content: "William Shakespeare", score: 1 },
        { content: "Jane Austen", score: 0 },
        { content: "Charles Dickens", score: 0 },
        { content: "F. Scott Fitzgerald", score: 0 },
      ],
    },
    {
      id: "6",
      content: "Which country is famous for its flamenco dance?",
      answers: [
        { content: "Spain", score: 1 },
        { content: "Mexico", score: 0 },
        { content: "Cuba", score: 0 },
        { content: "Portugal", score: 0 },
      ],
    },
    {
      id: "7",
      content: "What is the most widely spoken language in the world?",
      answers: [
        { content: "Mandarin Chinese", score: 1 },
        { content: "English", score: 0 },
        { content: "Spanish", score: 0 },
        { content: "Hindi", score: 0 },
      ],
    },
    {
      id: "8",
      content: "Who composed the famous piece 'Für Elise'?",
      answers: [
        { content: "Ludwig van Beethoven", score: 1 },
        { content: "Wolfgang Amadeus Mozart", score: 0 },
        { content: "Johann Sebastian Bach", score: 0 },
        { content: "Franz Schubert", score: 0 },
      ],
    },
    {
      id: "9",
      content: "What is the traditional attire of Scotland called for men?",
      answers: [
        { content: "Kilt", score: 1 },
        { content: "Kimono", score: 0 },
        { content: "Sari", score: 0 },
        { content: "Toga", score: 0 },
      ],
    },
    {
      id: "10",
      content: "Which city is famous for its Carnival celebration?",
      answers: [
        { content: "Rio de Janeiro", score: 1 },
        { content: "New Orleans", score: 0 },
        { content: "Venice", score: 0 },
        { content: "Sydney", score: 0 },
      ],
    },
    {
      id: "11",
      content: "Who wrote the novel '1984'?",
      answers: [
        { content: "George Orwell", score: 1 },
        { content: "Aldous Huxley", score: 0 },
        { content: "J.R.R. Tolkien", score: 0 },
        { content: "Ernest Hemingway", score: 0 },
      ],
    },
    {
      id: "12",
      content: "Which country is credited with inventing sushi?",
      answers: [
        { content: "Japan", score: 1 },
        { content: "China", score: 0 },
        { content: "Korea", score: 0 },
        { content: "Thailand", score: 0 },
      ],
    },
    {
      id: "13",
      content: "Who painted the ceiling of the Sistine Chapel?",
      answers: [
        { content: "Michelangelo", score: 1 },
        { content: "Leonardo da Vinci", score: 0 },
        { content: "Raphael", score: 0 },
        { content: "Donatello", score: 0 },
      ],
    },
    {
      id: "14",
      content: "What is the traditional music of Ireland called?",
      answers: [
        { content: "Irish folk music", score: 1 },
        { content: "Salsa", score: 0 },
        { content: "Flamenco", score: 0 },
        { content: "Reggae", score: 0 },
      ],
    },
    {
      id: "15",
      content: "Who wrote the play 'Hamlet'?",
      answers: [
        { content: "William Shakespeare", score: 1 },
        { content: "Arthur Miller", score: 0 },
        { content: "Tennessee Williams", score: 0 },
        { content: "Henrik Ibsen", score: 0 },
      ],
    },
    {
      id: "16",
      content: "What is the name of the traditional Japanese theater?",
      answers: [
        { content: "Kabuki", score: 1 },
        { content: "Noh", score: 0 },
        { content: "Bunraku", score: 0 },
        { content: "Taiko", score: 0 },
      ],
    },
    {
      id: "17",
      content: "Who is the author of 'The Great Gatsby'?",
      answers: [
        { content: "F. Scott Fitzgerald", score: 1 },
        { content: "Ernest Hemingway", score: 0 },
        { content: "Mark Twain", score: 0 },
        { content: "John Steinbeck", score: 0 },
      ],
    },
    {
      id: "18",
      content: "Which city is famous for its opera house, La Scala?",
      answers: [
        { content: "Milan", score: 1 },
        { content: "Rome", score: 0 },
        { content: "Florence", score: 0 },
        { content: "Venice", score: 0 },
      ],
    },
    {
      id: "19",
      content: "What is the traditional instrument of Japan called?",
      answers: [
        { content: "Shamisen", score: 1 },
        { content: "Sitar", score: 0 },
        { content: "Didgeridoo", score: 0 },
        { content: "Bagpipes", score: 0 },
      ],
    },
    {
      id: "20",
      content: "Who painted 'Starry Night'?",
      answers: [
        { content: "Vincent van Gogh", score: 1 },
        { content: "Pablo Picasso", score: 0 },
        { content: "Claude Monet", score: 0 },
        { content: "Salvador Dalí", score: 0 },
      ],
    },
  ],
};

let users = [];
let currentQuestionIndex = -1;
let currentQuestion = quiz.questions[currentQuestionIndex];
let timeLeft = quiz.timePerQuest;
let answerIndex;

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
    users.push({ username, socketId: socket.id, quizId: quiz.id, score: 0 });
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
    answerIndex = answerIndexClient;
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
    answerIndex = null;
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
        const user = users.find((u) => u.socketId === socket.id);
        if (!user) {
          socket.emit("answerError", "User not found");
          return;
        }
        // Emit score update to the user
        console.log("answerIndex: ", answerIndex);
        if (answerIndex === null || answerIndex === undefined) {
          console.log(`${user.username} answered ${answerIndex}: Wrong`);
          socket.emit("answerResult", { correct: false });
        } else {
          const answer = currentQuestion.answers[answerIndex].score === 1;
          if (answer) {
            console.log(`${user.username} answered ${answerIndex}: Right`);
            user.score += 1;
            socket.emit("answerResult", { correct: true });
          } else {
            console.log(`${user.username} answered ${answerIndex}: Wrong`);
            socket.emit("answerResult", { correct: false });
          }
        }

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
