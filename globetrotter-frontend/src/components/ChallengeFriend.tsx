import React, { useState } from "react";
import { API_INVITE_SCORE, FRONTEND_URL } from "../constants";
import "../styles/ChallengeFriend.css";
import axios from "axios";
const ChallengeFriend: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const generateInviteLink = async () => {
    const uniqueToken = Math.random().toString(36).substr(2, 9); // Temporary token
    const token = localStorage.getItem("token");
    const response = await axios.get(API_INVITE_SCORE, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userScore = response.data.correctAttempts;
    const link = `${FRONTEND_URL}/invite/${uniqueToken}/inviteUser/${userScore}`;
    setInviteLink(link);
    setShowPopup(true);
  };

  const shareOnWhatsApp = () => {
    const message = `Can you guess the destination? 🌍 Play now! ${inviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <>
      <button onClick={generateInviteLink}>Challenge a Friend</button>

      {showPopup && (
        <div className={`popup-overlay ${showPopup ? "show" : ""}`}>
          <div className="popup">
            <h3>Want to Invite a Friend ?🥸</h3>
            <img src="/public/welcome.png" alt="Dynamic Image" />
            <p>Share this link with your friend:</p>
            <input type="text" value={inviteLink} readOnly />
            <button onClick={() => navigator.clipboard.writeText(inviteLink)}>
              Copy Link
            </button>
            <button onClick={shareOnWhatsApp}>Share on WhatsApp</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChallengeFriend;
