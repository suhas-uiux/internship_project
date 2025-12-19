import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { FaArrowLeft, FaQuestionCircle, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

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
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('content'); // 'content' or 'quiz'

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
    setErrorMsg(null);
    if (!API_KEY) {
      setErrorMsg('API key not configured. Please set `VITE_GEMINI_API_KEY` in your frontend .env');
      setLoading(false);
      return;
    }

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

      const getGeneratedText = (data) => {
        return (
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          data?.candidates?.[0]?.content?.[0]?.text ||
          data?.candidates?.[0]?.content?.text ||
          data?.output?.[0]?.content?.text ||
          data?.output_text ||
          data?.generated_text ||
          null
        );
      };

      const text = getGeneratedText(res.data);

      if (!text || typeof text !== 'string') {
        setErrorMsg('No text returned from the generation API.');
        console.error('Generation response:', res.data);
        return;
      }

      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      if (start === -1 || end === -1) {
        setErrorMsg('Generated response was not valid JSON. See console for full response.');
        console.error('Unexpected generation text:', text);
        return;
      }

      const jsonText = text.slice(start, end + 1);
      try {
        const json = JSON.parse(jsonText);
        setQuiz(json);
        setActiveTab('quiz');
      } catch (parseErr) {
        setErrorMsg('Failed to parse generated JSON. See console for details.');
        console.error('JSON parse error:', parseErr, jsonText);
      }
    } catch (err) {
      const detail = err.response?.data || err.message || String(err);
      console.error('Quiz generation failed:', detail);
      setErrorMsg(typeof detail === 'string' ? detail : JSON.stringify(detail));
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
      setTimeout(() => navigate(-1), 3000);
    }
  };

  const handleRetry = () => {
    setQuiz([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setAllowRetry(false);
    setActiveTab('content');
  };

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <Link
              to="#"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition"
            >
              <FaArrowLeft /> Back
            </Link>
            <h1 className="text-4xl font-bold mb-2">{name}</h1>
            <p className="text-blue-100">Learn the fundamentals and test your knowledge</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 flex gap-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-2 font-medium border-b-2 transition ${
                activeTab === 'content'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📚 Content
            </button>
            <button
              onClick={() => quiz.length > 0 && setActiveTab('quiz')}
              className={`py-4 px-2 font-medium border-b-2 transition ${
                activeTab === 'quiz' && quiz.length > 0
                  ? 'border-blue-600 text-blue-600'
                  : quiz.length === 0
                  ? 'border-transparent text-gray-400 cursor-not-allowed'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaQuestionCircle className="inline mr-2" />
              Quiz {quiz.length > 0 && `(${quiz.length} questions)`}
            </button>
          </div>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-white prose-pre:overflow-x-auto">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {markdownContent}
                  </ReactMarkdown>
                </article>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Quiz Generator Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FaQuestionCircle className="text-blue-600" />
                      Test Your Knowledge
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Generate an AI-powered quiz based on this topic to test your understanding.
                    </p>
                    <button
                      onClick={generateQuiz}
                      disabled={loading}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Generating...
                        </>
                      ) : (
                        '🚀 Generate Quiz'
                      )}
                    </button>

                    {errorMsg && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        {errorMsg}
                      </div>
                    )}
                  </div>

                  {/* Info Card */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-3">💡 Learning Tips</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>✓ Read the content carefully</li>
                      <li>✓ Take notes while learning</li>
                      <li>✓ Score 6/10 to complete</li>
                      <li>✓ Retry if needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && quiz.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            {!submitted ? (
              <>
                {/* Quiz Progress */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-900">Progress</h3>
                    <span className="text-sm text-gray-600">
                      {Object.keys(answers).length} / {quiz.length} answered
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(Object.keys(answers).length / quiz.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                  {quiz.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                    >
                      <h4 className="font-bold text-gray-900 mb-4 flex items-start gap-3">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                          {idx + 1}
                        </span>
                        <span>{q.question}</span>
                      </h4>

                      <div className="grid gap-3 ml-11">
                        {q.options.map((opt, i) => {
                          const isSelected = answers[idx] === opt;

                          return (
                            <button
                              key={i}
                              onClick={() => handleAnswer(idx, opt)}
                              className={`px-4 py-3 text-left rounded-lg border-2 transition font-medium ${
                                isSelected
                                  ? 'bg-blue-50 border-blue-600 text-gray-900'
                                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <span
                                className={`inline-block w-5 h-5 rounded-full border-2 mr-3 ${
                                  isSelected
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-gray-300'
                                }`}
                              />
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="mt-10 flex gap-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-lg"
                  >
                    Submit Quiz
                  </button>
                  <button
                    onClick={handleRetry}
                    className="py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Clear Answers
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Results */}
                <div className={`rounded-lg p-8 mb-8 text-center border-2 ${
                  score >= 6
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="text-6xl font-bold mb-4">
                    {score >= 6 ? (
                      <FaCheckCircle className="mx-auto text-green-600" />
                    ) : (
                      <FaTimesCircle className="mx-auto text-red-600" />
                    )}
                  </div>
                  <h3 className={`text-3xl font-bold mb-2 ${
                    score >= 6 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    You scored {score} / {quiz.length}
                  </h3>
                  <p className={`text-lg ${
                    score >= 6 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {score >= 6
                      ? '🎉 Congratulations! You passed this topic.'
                      : '📚 Keep learning! Review the content and try again.'}
                  </p>
                </div>

                {/* Review Answers */}
                <div className="space-y-6 mb-8">
                  <h4 className="text-xl font-bold text-gray-900">Review Answers</h4>
                  {quiz.map((q, idx) => {
                    const isCorrect = answers[idx] === q.answer;
                    return (
                      <div
                        key={idx}
                        className={`border-2 rounded-lg p-6 ${
                          isCorrect
                            ? 'bg-green-50 border-green-300'
                            : 'bg-red-50 border-red-300'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {isCorrect ? (
                            <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                          ) : (
                            <FaTimesCircle className="text-red-600 mt-1 flex-shrink-0" />
                          )}
                          <div>
                            <h5 className="font-bold text-gray-900">{q.question}</h5>
                            <p className={`text-sm mt-1 ${
                              isCorrect ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {isCorrect ? 'Your answer: ' : 'Your answer: '}
                              <span className="font-semibold">{answers[idx]}</span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-700 mt-1">
                                Correct answer: <span className="font-semibold">{q.answer}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {allowRetry && (
                    <button
                      onClick={handleRetry}
                      className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
                    >
                      🔁 Retry Quiz
                    </button>
                  )}
                  <button
                    onClick={() => navigate(-1)}
                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Back to Roadmap
                  </button>
                </div>

                {!allowRetry && score < 6 && (
                  <p className="text-center text-gray-600 mt-4 text-sm">
                    Retry available in 3 seconds...
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TopicPage;
