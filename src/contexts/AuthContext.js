import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Check if a user is logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
      loadTasks(storedUser);
    }
  }, []);

  // Load tasks for a specific user
  const loadTasks = (username) => {
    const storedTasks = localStorage.getItem(`tasks_${username}`);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  };

  // Save tasks to localStorage
  const saveTasks = (username, newTasks) => {
    setTasks(newTasks);
    localStorage.setItem(`tasks_${username}`, JSON.stringify(newTasks));
  };

  // Register a new user
  const registerUser = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username]) {
      return { success: false, message: "User already exists!" };
    }

    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
    return { success: true };
  };

  // Login a user
  const loginUser = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username] && users[username] === password) {
      setUser(username);
      localStorage.setItem("user", username);
      loadTasks(username);
      return { success: true };
    }
    return { success: false, message: "Invalid credentials!" };
  };

  // Logout a user
  const logoutUser = () => {
    setUser(null);
    setTasks([]);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, tasks, loginUser, logoutUser, registerUser, saveTasks }}
    >
      {children}
    </AuthContext.Provider>
  );
};
