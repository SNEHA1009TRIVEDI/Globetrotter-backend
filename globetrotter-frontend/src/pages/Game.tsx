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
import "../styles/Game.css";
import Confetti from "react-confetti";

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
  const [showConfettiState, setShowConfettiState] = useState<boolean>(false); // Confetti state
  const [showMessage, setShowMessage] = useState<boolean>(false);

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
      const token = localStorage.getItem("token");

      const response = await axios.post(
        API_RESET_SCORE,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setScore(0);
        setScore(0);
        setIncorrectAttempts(0);
        alert("Your score has been reset!");
      }
    } catch (error) {
      console.error("Error resetting score:", error);
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

      setFunFact(response.data.funFacts[0]);
      console.log("funFacts", response.data.funFacts[0]);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const showConfetti = () => {
    setShowConfettiState(true);
    setShowMessage(true);
    setTimeout(() => {
      setShowConfettiState(false);
      setShowMessage(false);
    }, 5000);
    alert("🥳 Correct!");
  };

  const showSadFace = () => {
    fetchNewLocation();
    alert("😢 Incorrect!");
  };

  const revealNextHint = () => {
    if (visibleClues < clues.length) {
      setVisibleClues(visibleClues + 1);
    }
  };

  return (
    <div className="game-container">
      <h1>Guess the Place!!🤓</h1>

      {clues.length > 0 && (
        <div>
          {clues.slice(0, visibleClues).map((clue, index) => (
            <p key={index}>
              <strong>Clue {index + 1}:</strong> {clue}
            </p>
          ))}
        </div>
      )}
      <div className="game-options">
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
      </div>

      {funFact && <p className="fun-fact">Fun Fact: {funFact}</p>}
      <div className="score-container">
        <p>
          <strong>Correct Attempts:</strong> {score}
        </p>
        <p>
          <strong>Incorrect Attempts:</strong> {incorrectAttempts}
        </p>
      </div>

      <div className="button-container">
        <button onClick={fetchNewLocation}>Next</button>
        <button onClick={resetScore}>Play Again</button>
      </div>

      {visibleClues < clues.length && (
        <>
          <p>
            <strong>Hints Remaining:</strong> {clues.length - visibleClues}
          </p>
          <div className="hint-actions">
            <button onClick={revealNextHint} disabled={loading}>
              Get Another Hint
            </button>
          </div>
        </>
      )}
      <ChallengeFriend />

      <div className="confetti-container">
        {showConfettiState && <Confetti />}
        {showMessage && (
          <div className="correct-message">
            <h2>Correct!! 🎉</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
