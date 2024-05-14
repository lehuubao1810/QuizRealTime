import "./App.css";
import { QuizPage } from "./pages/QuizPage";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JoinRoom } from "./pages/JoinRoom";
import { ResultPage } from "./pages/ResutlPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JoinRoom />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
