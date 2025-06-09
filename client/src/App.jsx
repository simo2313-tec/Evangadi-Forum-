import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Landing from "./Pages/Landing";
import AskQuestions from "./Pages/AskQuestions";
import QuestionDetail from "./Pages/QuestionDetailAndAnswer";
import NotFound from "./Pages/NotFound";
import "./App.css";
import SignUp from "./Components/SignUp";
import Footer from "./Components/Footer/Footer";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/ask-questions" element={<AskQuestions />} />
        <Route path="/question-detail" element={<QuestionDetail />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
