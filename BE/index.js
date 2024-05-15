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
  title: "Quiz",
  timePerQuest: 10,
  questions: [
    {
      id: "1",
      content: "HTML là viết tắt của gì?",
      answers: [
        { content: "HyperText Markup Language", score: 1 },
        { content: "HyperText Markdown Language", score: 0 },
        { content: "HyperText Machine Language", score: 0 },
        { content: "HyperTool Markup Language", score: 0 },
      ],
    },
    {
      id: "2",
      content: "Thẻ nào dùng để tạo một liên kết trong HTML?",
      answers: [
        { content: "<a>", score: 1 },
        { content: "<link>", score: 0 },
        { content: "<href>", score: 0 },
        { content: "<url>", score: 0 },
      ],
    },
    {
      id: "3",
      content: "Ngôn ngữ nào được dùng để tạo kiểu dáng cho trang web?",
      answers: [
        { content: "CSS", score: 1 },
        { content: "HTML", score: 0 },
        { content: "JavaScript", score: 0 },
        { content: "PHP", score: 0 },
      ],
    },
    {
      id: "4",
      content: "Thư viện JavaScript nào phổ biến để tương tác với DOM?",
      answers: [
        { content: "jQuery", score: 1 },
        { content: "React", score: 0 },
        { content: "Vue", score: 0 },
        { content: "Angular", score: 0 },
      ],
    },
    {
      id: "5",
      content: "Thẻ nào được dùng để nhúng một đoạn script trong HTML?",
      answers: [
        { content: "<script>", score: 1 },
        { content: "<style>", score: 0 },
        { content: "<link>", score: 0 },
        { content: "<meta>", score: 0 },
      ],
    },
    {
      id: "6",
      content: "Cú pháp CSS nào sau đây là đúng để đổi màu chữ thành màu đỏ?",
      answers: [
        { content: "color: red;", score: 1 },
        { content: "text-color: red;", score: 0 },
        { content: "font-color: red;", score: 0 },
        { content: "text-style: red;", score: 0 },
      ],
    },
    {
      id: "7",
      content: "Trong JavaScript, hàm nào được dùng để in một thông điệp ra console?",
      answers: [
        { content: "console.log()", score: 1 },
        { content: "print()", score: 0 },
        { content: "echo()", score: 0 },
        { content: "write()", score: 0 },
      ],
    },
    {
      id: "8",
      content: "Thẻ HTML nào dùng để tạo một bảng?",
      answers: [
        { content: "<table>", score: 1 },
        { content: "<tr>", score: 0 },
        { content: "<td>", score: 0 },
        { content: "<th>", score: 0 },
      ],
    },
    {
      id: "9",
      content: "Framework nào sau đây là của PHP?",
      answers: [
        { content: "Laravel", score: 1 },
        { content: "Django", score: 0 },
        { content: "Spring", score: 0 },
        { content: "Ruby on Rails", score: 0 },
      ],
    },
    {
      id: "10",
      content: "Ngôn ngữ nào sau đây là bất đồng bộ theo mặc định?",
      answers: [
        { content: "JavaScript", score: 1 },
        { content: "Python", score: 0 },
        { content: "Ruby", score: 0 },
        { content: "Java", score: 0 },
      ],
    },
  ],
  isPublished: false,
};


let users = [];
let currentQuestionIndex = -1;
let currentQuestion = quiz.questions[currentQuestionIndex];
let timeLeft = quiz.timePerQuest;

// Socket.IO events
io.on("connection", (socket) => {
  console.log("New client connected");
  console.log("socket.id connected: ", socket.id);

  // Handle creating a quiz
  socket.on("publish", () => {
    quiz.isPublished = true;
    socket.join(quiz.id);
    console.log("Quiz published");
    socket.emit("quizPublished", quiz);
  });

  // Handle joining a quiz
  socket.on("joinQuiz", (username) => {
    if (!quiz) {
      socket.emit("quizError", "Quiz not found");
      return;
    }

    // Add the user to the quiz
    // Add the user to the users array
    users.push({
      username,
      socketId: socket.id,
      quizId: quiz.id,
      score: 0,
      answerIndex: undefined,
    });
    socket.join(quiz.id);

    console.log('users: ', users); 
    getUsersJoined(users);
    
    console.log(`${username} joined quiz ${quiz.id}`);
  });

  const getUsersJoined = (users) => {
    if (users.length === 0) {
      return;
    }
    io.to(quiz.id).emit("usersJoined", users);
  };

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
    users = users.filter((user) => user.socketId !== socket.id);
  });
});

// Routes
app.post("/updateQues", (req, res) => {
  const { ques } = req.body;
  quiz.questions = ques;
  res.json(quiz.questions);
});

app.get("/getQuiz", (req, res) => {
  res.json(quiz);
});

// Reset all the data
app.get("/reset", (req, res) => {
  users = [];
  currentQuestionIndex = -1;
  currentQuestion = quiz.questions[currentQuestionIndex];
  timeLeft = quiz.timePerQuest;
  quiz.isPublished = false;
  res.json({ message: "Data reset" });
});

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
