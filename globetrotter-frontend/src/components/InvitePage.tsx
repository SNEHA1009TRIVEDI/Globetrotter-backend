import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AUTH_REGISTER, API_INVITE_SCORE } from "../constants";

const InvitePage: React.FC = () => {
  const { inviteUserId } = useParams(); // Extract from route
  const [username, setUsername] = useState("");
  const [score, setScore] = useState<number>(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState<number>(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Function to update score using inviteUserId
  const updateScore = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(API_INVITE_SCORE, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          userId: inviteUserId, // ✅ Extracted from route
          isGuestUser: true,
        },
      });

      setScore(response.data.correctAttempts);
      setIncorrectAttempts(response.data.incorrectAttempts);
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  useEffect(() => {
    if (inviteUserId) {
      updateScore(); // Fetch score only if inviteUserId exists
    }
  }, [inviteUserId]);

  const handleSubmit = async () => {
    if (!username.trim()) {
      alert("Please enter a valid name.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(AUTH_REGISTER, {
        username,
        isGuestUser: true,
      });

      if (response.data.success) {
        console.log("respinse",response);
        localStorage.setItem("token", response.data.token); // Store JWT token
        localStorage.setItem("inviterScore", response.data.inviterScore); // Store inviter’s score
        navigate("/game"); // Redirect to game
      }
    } catch (error) {
      console.error("Error registering invited user:", error);
      alert("Registration failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="invite-container">
      <h2>Enter Your Name to Join the Challenge</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Joining..." : "Join Game"}
      </button>

      {/* Display score */}
      {inviteUserId && (
        <div>
          <p>Your Inviter's Score: {score}</p>
          <p>Incorrect Attempts: {incorrectAttempts}</p>
        </div>
      )}
    </div>
  );
};

export default InvitePage;
