import { useEffect, useState } from "react";
import "./App.css";

const API = "/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      const response = await fetch(`${API}/tasks`);
      if (!response.ok) throw new Error("Failed to load tasks");
      setTasks(await response.json());
      setError("");
    } catch {
      setError("Could not connect to the Task API.");
    }
  }

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const response = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
      setTitle("");
      setDescription("");
      loadTasks();
    } else {
      setError("Could not create task.");
    }
  }

  async function toggleTask(task) {
    await fetch(
      `${API}/tasks/${task.id}?completed=${!task.completed}`,
      { method: "PUT" }
    );
    loadTasks();
  }

  async function deleteTask(id) {
    await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Task Manager</h1>
        <p>Manage your tasks with Kubernetes.</p>
      </header>

      <form onSubmit={addTask} className="task-form">
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error">{error}</p>}

      <section>
        <h2>Your Tasks ({tasks.length})</h2>

        {tasks.length === 0 && <p>No tasks yet. Add one above.</p>}

        {tasks.map((task) => (
          <article className="task" key={task.id}>
            <div>
              <h3 className={task.completed ? "completed" : ""}>
                {task.title}
              </h3>
              <p>{task.description || "No description"}</p>
              <small>{task.completed ? "Completed" : "Pending"}</small>
            </div>

            <div className="actions">
              <button onClick={() => toggleTask(task)}>
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button className="delete" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
