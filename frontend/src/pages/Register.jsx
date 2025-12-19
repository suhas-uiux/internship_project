import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaUser, FaLock, FaGraduationCap, FaBook, FaQuestionCircle, FaChartLine, FaUsers } from 'react-icons/fa';

const Register = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [degree, setDegree] = useState('');
  const [branch, setBranch] = useState('');
  const [semesterCompleted, setSemesterCompleted] = useState(6);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: username.trim(),
        fullName: fullName.trim(),
        password,
        degree,
        branch,
        semesterCompleted,
      });

      // Store token and username
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.user.username);

      // Redirect to home
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            {/* Left: Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600">Join CrackIT and master your technical skills</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Choose a username"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                    <input
                      type="text"
                      placeholder="e.g., B.Tech, BE"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                    <input
                      type="text"
                      placeholder="e.g., CSE, ECE"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester Completed</label>
                  <div className="relative">
                    <FaGraduationCap className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="number"
                      placeholder="1 - 8"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={semesterCompleted}
                      onChange={(e) => setSemesterCompleted(Number(e.target.value))}
                      required
                      min={1}
                      max={8}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="text-sm text-center text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 font-medium hover:underline">
                    Sign In
                  </Link>
                </p>
              </form>
            </div>

            {/* Right: Benefits */}
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 text-white h-full flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-6">Why Join CrackIT?</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <FaBook className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold">Structured Courses</h3>
                      <p className="text-blue-100 text-sm">Learn DSA, DBMS, OS & System Design</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <FaQuestionCircle className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold">Interactive Quizzes</h3>
                      <p className="text-blue-100 text-sm">Test your knowledge with 100+ quizzes</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <FaChartLine className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold">Track Progress</h3>
                      <p className="text-blue-100 text-sm">Monitor your learning journey</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <FaUsers className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold">Community Chat</h3>
                      <p className="text-blue-100 text-sm">Connect and learn with peers</p>
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

export default Register;