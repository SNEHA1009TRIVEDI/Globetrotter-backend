import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AUTH_REGISTER, API_INVITE_SCORE } from "../constants";
import "../styles/InvitePage.css";

const InvitePage: React.FC = () => {
  const { inviteUserScore } = useParams(); // Extract from route
  const [username, setUsername] = useState("");
  const [score, setScore] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // ✅ Function to update score using inviteUserId

  useEffect(() => {
    if (inviteUserScore) {
      setScore(inviteUserScore); // Fetch score only if inviteUserId exists
    }
  }, [inviteUserScore]);

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
        console.log("respinse", response);
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
      <h2>Can you guess the destination? 🌍 Play now!🙃</h2>
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
      {inviteUserScore && (
        <div className="invitie">
          <p>Your Inviter's Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default InvitePage;
