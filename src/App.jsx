import React, { useState, useEffect } from "react";

function shuffle(src) {
  const copy = [...src];
  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }
  if (typeof src === "string") {
    return copy.join("");
  }
  return copy;
}

// Array of words
const wordsArray = ["react", "javascript", "developer", "frontend", "backend", "scramble", "coding", "software", "engineer", "design"];

const App = () => {
  const [words, setWords] = useState(shuffle([...wordsArray])); 
  const [currentWord, setCurrentWord] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0); 
  const [input, setInput] = useState("");
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(3);
  const [feedback, setFeedback] = useState("");

  
  useEffect(() => {
    if (words.length) {
      const nextWord = words[0]; 
      setCurrentWord(scrambleWord(nextWord));
    }
  }, [words]);
  

  const scrambleWord = (word) => {
    const scrambled = shuffle(word);
    console.log("Original Word:", word, "Scrambled Word:", scrambled);
    return scrambled;
  };

  const handleGuess = () => {
    if (words.length === 0 || strikes >= 3) return;
  
    const originalWord = words[0]; 
    console.log("Original Word:", originalWord);
    console.log("Scrambled Word:", currentWord);
    console.log("User Guess:", input);
  
    if (input.trim().toLowerCase() === originalWord.trim().toLowerCase()) {
      setPoints((prevPoints) => prevPoints + 1);
      setFeedback("Correct! Great job!");
      const newWords = words.slice(1); 
      setWords(newWords);
      setCurrentWord(newWords.length ? scrambleWord(newWords[0]) : "");
    } else {
      setStrikes((prevStrikes) => prevStrikes + 1);
      setFeedback("Incorrect. Try again!");
    }
  
    setInput(""); 
  };
  

  const handlePass = () => {
    if (passes > 0 && words.length > 0) {
      setPasses((prevPasses) => prevPasses - 1);
      setFeedback("You skipped the word.");
      const newWords = words.slice(1);
      setWords(newWords);
      setCurrentWord(newWords.length ? scrambleWord(newWords[0]) : "");
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleRestart = () => {
    const shuffledWords = shuffle([...wordsArray]);
    setWords(shuffledWords);
    setCurrentWord(scrambleWord(shuffledWords[0]));
    setCurrentWordIndex(0);
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setFeedback("");
    localStorage.removeItem("gameState");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Scramble Game</h1>
      {words.length === 0 || strikes >= 3 ? (
        <div>
          <h2>Game Over</h2>
          <p>{strikes >= 3 ? "You ran out of strikes!" : "You guessed all the words!"}</p>
          <p>Your final score: {points}</p>
          <button onClick={handleRestart}>Play Again</button>
        </div>
      ) : (
        <>
          <h2>Scrambled Word: {currentWord}</h2>
          <p>{feedback}</p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your guess"
          />
          <button onClick={handleGuess}>Guess</button>
          <button onClick={handlePass} disabled={passes === 0}>
            Pass (Remaining: {passes})
          </button>
          <p>Points: {points}</p>
          <p>Strikes: {strikes}/3</p>
          <p>Words Remaining: {words.length}</p>
        </>
      )}
    </div>
  );
};

export default App;
