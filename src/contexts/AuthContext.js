import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

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

  const saveTasks = (username, newTasks) => {
    setTasks(newTasks);
    localStorage.setItem(`tasks_${username}`, JSON.stringify(newTasks));
  };

  const registerUser = (username, email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username]) {
      return { success: false, message: "User already exists!" };
    }

    users[username] = { email, password };
    localStorage.setItem("users", JSON.stringify(users));

    return { success: true };
  };

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
