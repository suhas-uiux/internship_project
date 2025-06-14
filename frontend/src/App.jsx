// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Roadmap from './pages/Roadmap';
import TopicPage from './pages/TopicPage';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import QuizSetup from './pages/QuizSetup';
import Quiz from "./pages/Quiz";

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/topic/:topicName" element={<TopicPage />} />
          <Route path="/quiz/setup" element={<QuizSetup />} />
          <Route path="/quiz" element={<Quiz />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
