import { Link } from "react-router-dom";
import { useApp } from "../context";
import { formatDate, getTotalPlanMinutes } from "../utils";

export default function Dashboard() {
  const { drills, coaches, plans } = useApp();

  const today = new Date().toISOString().split("T")[0];

  const upcomingPlans = plans
    .filter((p) => p.date >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recentPlans = plans
    .filter((p) => p.date < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <Link to="/plans/new" className="btn btn-primary">
          + New Practice Plan
        </Link>
      </div>

      <div className="grid-3 mb-4">
        <div className="card" style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--color-primary)",
            }}
          >
            {drills.length}
          </div>
          <div className="text-sm text-muted">Drills in Library</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--color-accent-dark)",
            }}
          >
            {plans.length}
          </div>
          <div className="text-sm text-muted">Practice Plans</div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--color-success)",
            }}
          >
            {coaches.length}
          </div>
          <div className="text-sm text-muted">Coaches</div>
        </div>
      </div>

      {upcomingPlans.length > 0 && (
        <>
          <h3 className="mb-2">Upcoming Practices</h3>
          <div className="grid-2 mb-4">
            {upcomingPlans.slice(0, 4).map((plan) => (
              <div key={plan.id} className="card">
                <div className="flex justify-between items-center mb-2">
                  <h4>{plan.name}</h4>
                  <span className="text-sm text-muted">
                    {formatDate(plan.date)}
                  </span>
                </div>
                <p className="text-sm text-muted">
                  {plan.stations.length} station
                  {plan.stations.length !== 1 ? "s" : ""} &middot;{" "}
                  {getTotalPlanMinutes(plan.stations)} min
                </p>
                <div className="flex gap-2 mt-2">
                  <Link
                    to={`/plans/${plan.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/plans/${plan.id}/view`}
                    className="btn btn-accent btn-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {recentPlans.length > 0 && (
        <>
          <h3 className="mb-2">Recent Practices</h3>
          <div className="grid-2 mb-4">
            {recentPlans.map((plan) => (
              <div key={plan.id} className="card">
                <div className="flex justify-between items-center mb-2">
                  <h4>{plan.name}</h4>
                  <span className="text-sm text-muted">
                    {formatDate(plan.date)}
                  </span>
                </div>
                <p className="text-sm text-muted">
                  {plan.stations.length} station
                  {plan.stations.length !== 1 ? "s" : ""} &middot;{" "}
                  {getTotalPlanMinutes(plan.stations)} min
                </p>
                {plan.notes && (
                  <p
                    className="text-sm text-muted mt-2"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {plan.notes}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <Link
                    to={`/plans/${plan.id}/view`}
                    className="btn btn-outline btn-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {plans.length === 0 && drills.length === 0 && (
        <div className="empty-state">
          <h3>Welcome to Buford Lacrosse Practice Planner!</h3>
          <p>Get started by adding drills to your library, then create a practice plan.</p>
          <div className="flex gap-2" style={{ justifyContent: "center", marginTop: 16 }}>
            <Link to="/drills" className="btn btn-primary">
              Add Drills
            </Link>
            <Link to="/coaches" className="btn btn-outline">
              Add Coaches
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
