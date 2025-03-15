import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  API_RANDOM_LOCATION,
  API_SUBMIT_ANSWER,
  API_INVITE_SCORE,
  API_RESET_SCORE,
} from "../../src/constants";
import ChallengeFriend from "../components/ChallengeFriend";

const Game: React.FC = () => {
  const [clues, setClues] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [funFact, setFunFact] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState<number>(0);
  const [locationId, setLocationId] = useState<number>(0);
  const [visibleClues, setVisibleClues] = useState<number>(1); // Controls how many clues are shown
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNewLocation();
  }, []);

  const fetchNewLocation = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_RANDOM_LOCATION, {
        headers: { Authorization: `Bearer ${token}` },
      });

      updateScore();
      const { hints, options, id } = response.data;
      setClues(hints);
      setOptions(options);
      setLocationId(id);
      setFunFact(null);
      setSelectedAnswer(null);
      setVisibleClues(1); // Reset clue visibility
    } catch (error) {
      console.error("Error fetching location:", error);
      navigate("/"); // Redirect to login if unauthorized
    }
    setLoading(false);
  };

  const resetScore = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
     
      const response = await axios.post(
        API_RESET_SCORE, 
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        setScore(0);
        setScore(0);
        setIncorrectAttempts(0);
        alert('Your score has been reset!');
      }
    } catch (error) {
      console.error('Error resetting score:', error);
    }
    setLoading(false);
  };
  

  const updateScore = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_INVITE_SCORE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScore(response.data.correctAttempts);
      setIncorrectAttempts(response.data.incorrectAttempts);
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const submitAnswer = async (answer: string) => {
    setSelectedAnswer(answer);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        API_SUBMIT_ANSWER,
        { userAnswer: answer, locationId: locationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        updateScore();
        showConfetti();
      } else {
        showSadFace();
      }

      setFunFact(response.data.funFact);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const showConfetti = () => {
    fetchNewLocation()
    alert("🎉 Correct! Confetti Animation Here!");
  };

  const showSadFace = () => {
    fetchNewLocation()
    alert("😢 Incorrect! Sad Face Animation Here!");
  };

  const revealNextHint = () => {
    if (visibleClues < clues.length) {
      setVisibleClues(visibleClues + 1);
    }
  };

  return (
    <div className="game-container">
      <h2>Guess the Destination!</h2>

      {clues.length > 0 && (
        <div>
          {clues.slice(0, visibleClues).map((clue, index) => (
            <p key={index}>
              <strong>Clue {index + 1}:</strong> {clue}
            </p>
          ))}
        </div>
      )}

      {options.map((option) => (
        <button
          key={option}
          onClick={() => submitAnswer(option)}
          disabled={selectedAnswer !== null || loading}
          className={selectedAnswer === option ? "selected" : ""}
        >
          {option}
        </button>
      ))}

      {funFact && <p className="fun-fact">Fun Fact: {funFact}</p>}

      <p>
        <strong>Correct Attempts:</strong> {score}
      </p>
      <p>
        <strong>Incorrect Attempts:</strong> {incorrectAttempts}
      </p>

      <button onClick={fetchNewLocation}>
        Next
      </button>
      <button onClick={resetScore}>
        Play Again
      </button>
      {visibleClues < clues.length && (
        <div>
          <p>
            <strong>Hints Remaining:</strong> {clues.length - visibleClues}
          </p>
          <button onClick={revealNextHint} disabled={loading}>
            Get Another Hint
          </button>
        </div>
      )}
      {
        
      }
      <ChallengeFriend />
    </div>
  );
};

export default Game;
