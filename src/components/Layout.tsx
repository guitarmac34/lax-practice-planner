import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useApp } from "../context";

export default function Layout() {
  const { isAdmin, login, logout } = useApp();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(password);
    if (ok) {
      setShowLogin(false);
      setPassword("");
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar no-print">
        <div className="sidebar-header">
          <img src="/logo.png" alt="Buford Lacrosse" />
          <h1>Practice Planner</h1>
          <span>Buford Youth Lacrosse Association</span>
        </div>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/drills">Drill Library</NavLink>
          <NavLink to="/plans">Practice Plans</NavLink>
          <NavLink to="/history">History</NavLink>
          <NavLink to="/coaches">Coach Roster</NavLink>
          <NavLink to="/players">Players</NavLink>
          <div className="sidebar-divider" />
          <NavLink to="/schedule">Schedule</NavLink>
          <NavLink to="/parent-info">Parent Info</NavLink>
          <NavLink to="/coach-resources">Coach Resources</NavLink>
        </nav>
        <div className="sidebar-footer">
          {isAdmin ? (
            <div className="admin-indicator">
              <span className="admin-badge">Admin</span>
              <button className="btn-sidebar-action" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn-sidebar-action"
              onClick={() => setShowLogin(true)}
            >
              Admin Login
            </button>
          )}
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>

      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 360 }}>
            <h3>Admin Login</h3>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              {error && (
                <p style={{ color: "var(--color-danger)", fontSize: "0.85rem", marginBottom: 12 }}>
                  Incorrect password.
                </p>
              )}
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowLogin(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
