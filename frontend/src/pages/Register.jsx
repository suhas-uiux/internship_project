import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [degree, setDegree] = useState('');
  const [branch, setBranch] = useState('');
  const [semesterCompleted, setSemesterCompleted] = useState(6); // Default to 6th sem

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username: username.trim(),
        fullName: fullName.trim(),
        password,
        degree,
        branch,
        semesterCompleted,
      });

      alert('Registered successfully. Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Student Registration</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Degree (e.g., BE, B.Tech)"
          className="w-full p-2 border rounded"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Branch (e.g., CSE, ECE)"
          className="w-full p-2 border rounded"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Semester Completed"
          className="w-full p-2 border rounded"
          value={semesterCompleted}
          onChange={(e) => setSemesterCompleted(Number(e.target.value))}
          required
          min={1}
          max={8}
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
