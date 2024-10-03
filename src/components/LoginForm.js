import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Import CSS styles

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setErrorMessage("Credentials cannot be empty");
    } else {
      const result = loginUser(username, password);
      if (result.success) {
        navigate("/tasks");
      } else {
        setErrorMessage(result.message); // Set error message for invalid login
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
          {errorMessage && <p className="error">{errorMessage}</p>}{" "}
        </form>
        <p className="register-text" onClick={() => navigate("/register")}>
          New User? Register
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
