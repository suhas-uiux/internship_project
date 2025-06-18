import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
const API_KEY = 'AIzaSyBfsdrS22wfY_G8lHVBVFnU8ZQyHw00pec';

const getCurrentUsername = () => localStorage.getItem('username') || null;

const getCompletedTopics = () => {
  const username = getCurrentUsername();
  if (!username) return {};
  const data = JSON.parse(localStorage.getItem(`completedTopics_${username}`) || '{}');
  return typeof data === 'object' && !Array.isArray(data) ? data : {};
};

const saveCompletedTopic = (name, score) => {
  const username = getCurrentUsername();
  if (!username) return;
  const completed = getCompletedTopics();
  completed[name] = score;
  localStorage.setItem(`completedTopics_${username}`, JSON.stringify(completed));
};

const TopicPage = () => {
  const { topicName } = useParams();
  const name = decodeURIComponent(topicName);
  const navigate = useNavigate();

  const [markdownContent, setMarkdownContent] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allowRetry, setAllowRetry] = useState(false);

  useEffect(() => {
    const filename = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    fetch(`/${filename}`)
      .then((res) => res.text())
      .then((text) => {
        setMarkdownContent(text);
        setQuiz([]);
        setAnswers({});
        setSubmitted(false);
        setScore(0);
      })
      .catch(() => setMarkdownContent('# Content not found'));
  }, [name]);

  useEffect(() => {
    if (submitted && score < 6) {
      const timer = setTimeout(() => setAllowRetry(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setAllowRetry(false);
    }
  }, [submitted, score]);

  const generateQuiz = async () => {
    setLoading(true);
    const prompt = `
You are a quiz generator. Read the following learning material and generate 10 multiple-choice quiz questions.
Each question should have:
- "question"
- "options": [list of 4 options]
- "answer": the correct option

Respond in JSON format:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "answer": "..."
  }
]

Content:
"""${markdownContent}"""
`;

    try {
      const res = await axios.post(
        `${GEMINI_API_URL}?key=${API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonText = text.slice(text.indexOf('['), text.lastIndexOf(']') + 1);
      const json = JSON.parse(jsonText);
      setQuiz(json);
    } catch (err) {
      console.error('Quiz generation failed:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qIdx, option) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.forEach((q, idx) => {
      if (answers[idx] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);

    if (correct >= 6) {
      saveCompletedTopic(name, correct);
      setTimeout(() => navigate('/roadmap'), 2500);
    }
  };

  const handleRetry = () => {
    setQuiz([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setAllowRetry(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-white relative font-sans">
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-95 backdrop-blur-lg" />
      
      <div className="relative z-10">
        <h1 className="text-5xl font-bold mb-6 text-cyan-300 drop-shadow-lg">{name}</h1>
        <Link
          to="/roadmap"
          className="inline-block mb-8 text-blue-400 hover:text-blue-500 underline underline-offset-4 transition"
        >
          ← Back to Roadmap
        </Link>

        <article className="prose prose-invert max-w-none bg-white/5 backdrop-blur-md rounded-xl p-6 mb-12 shadow-2xl prose-code:text-green-400 prose-pre:bg-slate-900 prose-pre:rounded-md">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{markdownContent}</ReactMarkdown>
        </article>

        {quiz.length === 0 && !loading && (
          <button
            onClick={generateQuiz}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 rounded-xl text-white font-semibold shadow-lg transition duration-200"
          >
            🚀 Generate Quiz
          </button>
        )}

        {loading && <p className="text-center text-yellow-300 mt-4 text-lg animate-pulse">Generating quiz...</p>}

        {quiz.length > 0 && (
          <section className="mt-10 space-y-10">
            <h2 className="text-4xl font-semibold text-yellow-300 mb-4">📝 Quiz</h2>
            {quiz.map((q, idx) => (
              <div key={idx} className="bg-slate-800/60 border border-slate-600 rounded-xl p-6 shadow-md transition-all">
                <p className="font-medium text-lg mb-3">
                  {idx + 1}. {q.question}
                </p>
                <div className="grid gap-3">
                  {q.options.map((opt, i) => {
                    const isSelected = answers[idx] === opt;
                    const isCorrect = submitted && opt === q.answer;
                    const isWrong = submitted && isSelected && opt !== q.answer;

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(idx, opt)}
                        disabled={submitted}
                        className={`px-5 py-3 text-left rounded-lg border text-white font-medium transition
                          ${
                            submitted
                              ? isCorrect
                                ? 'bg-green-600 border-green-500'
                                : isWrong
                                ? 'bg-red-600 border-red-500'
                                : 'bg-slate-700 border-slate-600 cursor-not-allowed'
                              : isSelected
                              ? 'bg-purple-600 border-purple-500'
                              : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                          }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <p
                    className={`mt-3 font-semibold ${
                      answers[idx] === q.answer ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {answers[idx] === q.answer
                      ? '✅ Correct!'
                      : `❌ Wrong. Correct: ${q.answer}`}
                  </p>
                )}
              </div>
            ))}

            <div className="mt-10 flex flex-col md:flex-row items-center gap-6">
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition"
                >
                  Submit Quiz
                </button>
              ) : (
                <div className="flex-1">
                  <p className="text-xl mb-2">You scored {score} / 10</p>
                  <div className="w-full bg-slate-600 rounded-full h-4 mb-3">
                    <div
                      className={`h-4 rounded-full ${
                        score >= 6 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(score / 10) * 100}%` }}
                    />
                  </div>
                  {score >= 6 ? (
                    <p className="text-green-400">🎉 Topic completed. Redirecting...</p>
                  ) : (
                    <>
                      <p className="text-red-400">❌ Try again to unlock next topic.</p>
                      {!allowRetry && (
                        <p className="text-yellow-300 text-sm mt-1">
                          Retry available in 3 seconds...
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {allowRetry && (
                <button
                  onClick={handleRetry}
                  className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-semibold transition"
                >
                  🔁 Retry Quiz
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TopicPage;
