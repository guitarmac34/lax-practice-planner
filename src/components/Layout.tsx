import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app-layout">
      <aside className="sidebar no-print">
        <div className="sidebar-header">
          <h1>Lax Practice</h1>
          <span>Youth Lacrosse Planner</span>
        </div>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/drills">Drill Library</NavLink>
          <NavLink to="/plans">Practice Plans</NavLink>
          <NavLink to="/history">History</NavLink>
          <NavLink to="/coaches">Coaches</NavLink>
          <NavLink to="/players">Players</NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
