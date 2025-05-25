import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userPayload = JSON.parse(atob(token.split(".")[1]));
        setRole(userPayload.role);
        setTasks(res.data);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchTasks();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {(role === "admin" || role === "manager") && (
          <button
            onClick={() => navigate("/create-task")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Task
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{task.title}</h2>
                <p className="text-sm text-gray-600">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Assigned to: {task.assignedTo?.name || "Unassigned"}
                </p>
              </div>
              {(role === "admin" || role === "manager" || task.assignedTo?._id === JSON.parse(atob(localStorage.getItem("token").split(".")[1])).userId) && (
                <button
                  onClick={() => navigate(`/edit-task/${task._id}`)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
