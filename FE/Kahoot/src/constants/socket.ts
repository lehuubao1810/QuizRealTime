// const serverUrl = {
//   local: "http://localhost:5000/",
//   deploy: "https://quizrealtime.onrender.com/"
// }

import { io } from "socket.io-client";

const socket = io("https://quizrealtime.onrender.com/"); 

export { socket };