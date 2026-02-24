import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
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
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
