import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaUser, FaLock, FaBook, FaQuestionCircle, FaChartLine, FaUsers } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username: username.trim(),
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Left: Login Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-600">
                  Login to continue your CrackIT journey
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your username"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg
                             hover:bg-blue-700 transition font-medium disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-sm text-center text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link
                    to="/register"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </form>
            </div>

            {/* Right: Benefits (Same as Register) */}
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 text-white h-full flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-6">
                  Why CrackIT?
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <FaBook />
                    </div>
                    <div>
                      <h3 className="font-bold">Structured Learning</h3>
                      <p className="text-blue-100 text-sm">
                        DSA, DBMS, OS & System Design
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <FaQuestionCircle />
                    </div>
                    <div>
                      <h3 className="font-bold">Practice & Quizzes</h3>
                      <p className="text-blue-100 text-sm">
                        Improve with interactive tests
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <FaChartLine />
                    </div>
                    <div>
                      <h3 className="font-bold">Track Progress</h3>
                      <p className="text-blue-100 text-sm">
                        See how far you’ve come
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <FaUsers />
                    </div>
                    <div>
                      <h3 className="font-bold">Community</h3>
                      <p className="text-blue-100 text-sm">
                        Learn with peers
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
