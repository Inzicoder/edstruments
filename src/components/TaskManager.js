import React, { useState, useContext, useCallback, useMemo } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../App.css";

const TaskManager = () => {
  const [newTask, setNewTask] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const { tasks, saveTasks, user, logoutUser } = useContext(AuthContext);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");

  const [filter, setFilter] = useState("all"); // State to handle task filters

  const handleAddTask = useCallback(() => {
    if (newTask.trim() === "") {
      setErrorMessage("Task cannot be empty"); // Set error for empty task
      return;
    }
    const updatedTasks = [
      ...tasks,
      { title: newTask, completed: false, id: Date.now() },
    ];
    saveTasks(user, updatedTasks);
    setNewTask("");
    setErrorMessage(""); // Clear error after adding a task
  }, [newTask, tasks, user, saveTasks]);

  const handleToggleComplete = useCallback(
    (id) => {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      saveTasks(user, updatedTasks);
    },
    [tasks, user, saveTasks]
  );

  const handleDeleteTask = useCallback(
    (id) => {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      saveTasks(user, updatedTasks);
    },
    [tasks, user, saveTasks]
  );

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    setEditedTaskTitle(task.title);
  }, []);

  const handleSaveEdit = useCallback(
    (id) => {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, title: editedTaskTitle } : task
      );
      saveTasks(user, updatedTasks);
      setEditingTask(null);
      setEditedTaskTitle("");
    },
    [tasks, editedTaskTitle, user, saveTasks]
  );

  // Task filtering logic based on the selected filter
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "completed":
        return tasks.filter((task) => task.completed);
      case "incomplete":
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Memoize the task list to avoid unnecessary re-renders
  const memoizedTaskList = useMemo(
    () =>
      filteredTasks.map((task) => (
        <li
          key={task.id}
          className={`task-item ${task.completed ? "completed" : ""}`}
        >
          {editingTask?.id === task.id ? (
            <input
              className="edit-task"
              value={editedTaskTitle}
              onChange={(e) => setEditedTaskTitle(e.target.value)}
            />
          ) : (
            <span className="task-title">{task.title}</span>
          )}
          <div className="task-actions">
            {editingTask?.id === task.id ? (
              <button className="save" onClick={() => handleSaveEdit(task.id)}>
                Save
              </button>
            ) : (
              <>
                <button
                  className="complete"
                  onClick={() => handleToggleComplete(task.id)}
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button className="edit" onClick={() => handleEditTask(task)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </li>
      )),
    [
      filteredTasks,
      editingTask,
      editedTaskTitle,
      handleSaveEdit,
      handleToggleComplete,
      handleEditTask,
      handleDeleteTask,
    ]
  );

  return (
    <div className="container">
      <div className="header">
        <h2>Task Management</h2>
        <button className="logout" onClick={logoutUser}>
          Logout
        </button>
      </div>

      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button className="add-task" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      {/* Filter Buttons */}
      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-button ${filter === "all" ? "active-all" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-button ${
            filter === "completed" ? "active-completed" : ""
          }`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={`filter-button ${
            filter === "incomplete" ? "active-incomplete" : ""
          }`}
          onClick={() => setFilter("incomplete")}
        >
          Incomplete
        </button>
      </div>

      <ul className="tasks">{memoizedTaskList}</ul>
    </div>
  );
};

export default TaskManager;
