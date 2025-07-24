// src/App.tsx
import { useState } from "react";
import "./App.css";

function App() {
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = async () => {
    // 1. OWASP C6: Password length + character checks
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (!/[a-z]/.test(password)) return setError("Password must contain lowercase.");
    if (!/[A-Z]/.test(password)) return setError("Password must contain uppercase.");
    if (!/[0-9]/.test(password)) return setError("Password must contain a digit.");
    if (!/[^a-zA-Z0-9]/.test(password)) return setError("Password must contain a special character.");

    // 2. Check against leaked list
    try {
      const response = await fetch("/top1000.txt");
      const text = await response.text();
      const leakedPasswords = text.split("\n").map(line => line.trim());

      if (leakedPasswords.includes(password)) {
        return setError("Password is in the leaked list.");
      }
    } catch (err) {
      return setError("Failed to check leaked password list.");
    }

    setIsValid(true);
  };

  if (isValid) {
    return (
      <div className="App">
        <h2>Welcome!</h2>
        <p>Your password is: <strong>{password}</strong></p>
        <button onClick={() => { setPassword(""); setIsValid(false); }}>Logout</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h2>Password Login</h2>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
      />
      <button onClick={validatePassword}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
