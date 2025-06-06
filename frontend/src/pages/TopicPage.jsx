import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
const API_KEY = 'AIzaSyBfsdrS22wfY_G8lHVBVFnU8ZQyHw00pec'; // Replace with env var in prod

const getCompletedTopics = () => JSON.parse(sessionStorage.getItem('completedTopics') || '[]');
const saveCompletedTopic = (name) => {
  const completed = getCompletedTopics();
  if (!completed.includes(name)) {
    sessionStorage.setItem('completedTopics', JSON.stringify([...completed, name]));
  }
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
      saveCompletedTopic(name);
      setTimeout(() => navigate('/roadmap'), 2500);
    }
  };

  const handleRetry = () => {
    setQuiz([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-slate-100">
      <h1 className="text-4xl font-semibold mb-6">{name}</h1>
      <Link
        to="/roadmap"
        className="inline-block mb-8 text-blue-500 hover:text-blue-600 transition-colors duration-200"
      >
        ← Back to Roadmap
      </Link>

      <article className="prose prose-invert max-w-none bg-slate-800 rounded-lg p-6 mb-10 shadow-md prose-code:text-green-400 prose-pre:bg-slate-900 prose-pre:rounded-md">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{markdownContent}</ReactMarkdown>
      </article>

      {/* Generate Quiz Button */}
      {quiz.length === 0 && !loading && (
        <button
          onClick={generateQuiz}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold transition-colors duration-200"
        >
          Generate Quiz
        </button>
      )}

      {/* Loading Indicator */}
      {loading && <p className="text-center text-gray-300 mt-4">Generating quiz...</p>}

      {/* Quiz Section */}
      {quiz.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-yellow-400 mb-6">Quiz</h2>
          {quiz.map((q, idx) => (
            <div
              key={idx}
              className="bg-slate-700 rounded-lg p-5 shadow-sm"
            >
              <p className="font-semibold mb-3 text-lg">
                {idx + 1}. {q.question}
              </p>
              <div className="flex flex-col gap-3">
                {q.options.map((opt, i) => {
                  const isSelected = answers[idx] === opt;
                  const isCorrect = submitted && opt === q.answer;
                  const isWrong = submitted && isSelected && opt !== q.answer;

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(idx, opt)}
                      disabled={submitted}
                      className={`w-full text-left px-4 py-2 rounded-md border transition-colors duration-200
                        ${
                          submitted
                            ? isCorrect
                              ? 'bg-green-600 border-green-500 text-white'
                              : isWrong
                              ? 'bg-red-600 border-red-500 text-white'
                              : 'bg-slate-700 border-slate-600 text-gray-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-purple-600 border-purple-500 text-white'
                            : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                        }
                      `}
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
                    ? 'Correct!'
                    : `Wrong. Correct answer: ${q.answer}`}
                </p>
              )}
            </div>
          ))}

          {/* Buttons for submit or retry */}
          <div className="mt-6 flex gap-4">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md font-semibold transition-colors duration-200"
              >
                Submit Quiz
              </button>
            ) : (
              <>
                <div className="text-xl font-bold flex-1 self-center">
                  You scored {score} / 10.
                  {score >= 6 ? (
                    <p className="text-green-400 mt-2">
                      ✅ Great! Topic marked as completed. Redirecting...
                    </p>
                  ) : (
                    <p className="text-red-400 mt-2">❌ Try again to unlock the next topic.</p>
                  )}
                </div>
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-md font-semibold transition-colors duration-200"
                >
                  Retry Quiz
                </button>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default TopicPage;
