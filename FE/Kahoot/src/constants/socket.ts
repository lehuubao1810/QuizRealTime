// const serverUrl = {
//   local: "http://localhost:5000/",
//   deploy: "https://quizrealtime.onrender.com/"
// }

import { io } from "socket.io-client";

const socket = io("http://localhost:5000/"); 

export { socket };