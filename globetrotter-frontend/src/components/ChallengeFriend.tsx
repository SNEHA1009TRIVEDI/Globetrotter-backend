import React, { useState } from "react";
import { FRONTEND_URL } from "../constants";

const ChallengeFriend: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const generateInviteLink = () => {
    const uniqueToken = Math.random().toString(36).substr(2, 9); // Temporary token
    const user = JSON.parse(localStorage.getItem('user') || '{}'); 
    const userId = user.id; // Extract id properly
    const link = `${FRONTEND_URL}/invite/${uniqueToken}/inviteUser/${userId}`;
    setInviteLink(link);
    setShowPopup(true);
  };

  const shareOnWhatsApp = () => {
    const message = `Can you guess the destination? 🌍 Play now! ${inviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div>
      <button onClick={generateInviteLink}>Challenge a Friend</button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Invite a Friend</h3>
            <img src="https://via.placeholder.com/150" alt="Dynamic Image" />
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
    </div>
  );
};

export default ChallengeFriend;
