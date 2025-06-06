import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    onLogout(); // Trigger re-render in Home
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 border border-white rounded text-white hover:bg-white hover:text-[#1a1a2e] transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
