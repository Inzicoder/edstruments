import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  const storageKey = user ? `tasks_${user.username}` : null;

  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem(storageKey);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]);
      }
    } else {
      setTasks([]);
    }
  }, [user, storageKey]);

  useEffect(() => {
    if (user && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    }
  }, [tasks, user, storageKey]);

  const addTask = (title) => {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id, newTitle) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, deleteTask, toggleComplete, editTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};
