import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Landing from "./Pages/Landing";
import AskQuestions from "./Pages/AskQuestions";
import QuestionDetail from "./Pages/QuestionDetialAndAnswer";
import NotFound from "./Pages/NotFound";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/ask-questions" element={<AskQuestions />} />
        <Route path="/question-detail" element={<QuestionDetail />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />

        {/*<Route path="/profile" element={<Profile />} />
        <Route path="/reset-password" element={<ResetPassword />} /> */}
      </Routes>
    </>
  );
}

export default App;
