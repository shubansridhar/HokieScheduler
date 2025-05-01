import React, { useEffect, useState } from "react";
import "./style.css"; // Add your custom styles here

const typeColors = {
  Coursework: "#FFF2CC", // soft yellow
  Work: "#DFF2BF",        // pale green
  Club: "#DDEEFF",        // soft blue
  Other: "#E8E8E8",       // neutral gray
};

export const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    task_name: "",
    task_type: "Coursework",
    date: "",
    time: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch("/api/tasks", { credentials: "include" })
      .then((res) => (res.status === 204 ? [] : res.json()))
      .then(setTasks)
      .catch((err) => console.error("Error loading tasks:", err));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...newTask,
        status: "Working",
        priority: "Medium",
      }),
    })
      .then((res) => res.json())
      .then((created) => {
        setTasks((prev) => [...prev, created]);
        setIsModalOpen(false);
        setNewTask({ task_name: "", task_type: "Coursework", date: "", time: "" });
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this task?")) return;
    fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => setTasks((prev) => prev.filter((t) => t.task_id !== id)))
      .catch((err) => alert("Failed to delete task."));
  };

  const formatDueDate = (rawDate) => {
    if (!rawDate) return "";
  
    const cleanDate = rawDate.split("T")[0]; // <-- fixes "Invalid Date"
    const [year, month, day] = cleanDate.split("-").map(Number);
    const localDate = new Date(year, month - 1, day); // Create local date
  
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const taskMidnight = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate());
    const diff = (taskMidnight - todayMidnight) / (1000 * 60 * 60 * 24);
  
    if (diff >= 0 && diff < 7) {
      return localDate.toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Friday"
    } else {
      return localDate.toLocaleDateString("en-US", { month: "long", day: "numeric" }); // e.g., "April 16"
    }
  };

  const parseDateTime = (task) => {
    if (!task.date) return new Date("9999-12-31"); // push unscheduled tasks to bottom
  
    const datePart = task.date; // should be like "2025-04-10"
    const timePart = task.time || "00:00"; // fallback to midnight
    const combined = `${datePart}T${timePart}`;
  
    const parsed = new Date(combined);
    return isNaN(parsed) ? new Date("9999-12-31") : parsed;
  };

  const sortedTasks = [...tasks].sort((a, b) => parseDateTime(a) - parseDateTime(b));

  return (
    <div className="task-list-wrapper">
      <div className="task-header">
        <h3>Upcoming Tasks</h3>
        <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>
          + Add Task
        </button>
      </div>

      <div className="task-list">
  {sortedTasks.length === 0 ? (
    <p>No tasks yet.</p>
  ) : (
    sortedTasks.map((task) => {
      return (
            <div
              className="task-card"
              key={task.task_id}
              style={{
                backgroundColor: typeColors[task.task_type] || "#f0f0f0",
                color: "#000" // ⬅️ force black text
              }}
            >
              <div className="task-content">
                <span className="task-name">{task.task_name}</span>
                <span
                  className="task-type"
                  style={{
                    backgroundColor: typeColors[task.task_type] || "#ccc",
                    color: "#000"
                  }}
                >
                  {task.task_type}
                </span>
                <div className="task-datetime">
                  📅 {formatDueDate(task.date)} 
                  {task.time && `  🕒 ${new Date(`1970-01-01T${task.time}`).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                  })}`}

                </div>
              </div>
              <button className="delete-task" onClick={() => handleDelete(task.task_id)}>
                Complete
              </button>
            </div>
          );
        })
      )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="EventAdder">
            <h2>Add New Task</h2>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Task Name:</label>
                <input
                  type="text"
                  value={newTask.task_name}
                  onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Task Type:</label>
                <select
                  value={newTask.task_type}
                  onChange={(e) => setNewTask({ ...newTask, task_type: e.target.value })}
                >
                  <option value="Coursework">Coursework</option>
                  <option value="Work">Work</option>
                  <option value="Club">Club</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Time:</label>
                <input
                  type="time"
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
