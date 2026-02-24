import { useState, type ReactNode } from "react";

const COACH_PASSWORD = "buford2026";
const SESSION_KEY = "coach-resources-unlocked";

interface PasswordGateProps {
  children: ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === COACH_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="password-gate">
      <div className="card" style={{ maxWidth: 400, margin: "80px auto", textAlign: "center" }}>
        <h3 style={{ color: "var(--color-primary)", marginBottom: 16 }}>Coach Resources</h3>
        <p className="text-muted text-sm" style={{ marginBottom: 20 }}>
          Enter the coach password to access this page.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              autoFocus
            />
          </div>
          {error && (
            <p style={{ color: "var(--color-danger)", fontSize: "0.85rem", marginBottom: 12 }}>
              Incorrect password. Please try again.
            </p>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
