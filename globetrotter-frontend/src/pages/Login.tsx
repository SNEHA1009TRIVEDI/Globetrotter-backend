import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AUTH_REGISTER, AUTH_LOGIN } from "../../src/constants";
import { AuthResponse } from "../../src/types/auth";
import "../styles/Login.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (isRegistering) {
        // ✅ Register user
        await axios.post<AuthResponse>(AUTH_REGISTER, {
          username: username,
          password: password,
          isGuestUser: false,
        });

        // ✅ Registration successful → Ask user to log in
        setSuccessMessage("Registration successful! Please log in.");
        setIsRegistering(false); // Switch to login mode
        setUsername("");
        setPassword("");
      } else {
        // ✅ Login user
        const loginResponse = await axios.post<AuthResponse>(AUTH_LOGIN, {
          username,
          password,
        });
        const { token, user } = loginResponse.data;

        // ✅ Store token & user in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ Pass token in future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        navigate("/game"); // Redirect after login
      }
    } catch (error: any) {
      setError(
        isRegistering
          ? "Registration failed. Try again."
          : "Login failed. Please check your credentials."
      );
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Welcome to the Globetrotter World !!!</h1>
        {successMessage && <p className="success">{successMessage}</p>}{" "}
        {/* Success Message */}
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleAuth} disabled={loading}>
          {loading ? "Processing..." : isRegistering ? "Register" : "Login"}
        </button>
        <p>
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Login" : "Register Instead"}
          </button>
        </p>
        {error && <p className="error">{error}</p>} {/* Error Message */}
      </div>

      <div className="login-image">
        <img src="/public/globetrotter.png" alt="Globetrotter Game" />
      </div>
    </div>
  );
};

export default Login;
