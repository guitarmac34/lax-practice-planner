import { Link } from "react-router-dom";
import { useApp } from "../context";
import { formatDate, getTotalPlanMinutes } from "../utils";

export default function Plans() {
  const { plans, deletePlan, isAdmin } = useApp();

  const sorted = [...plans].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  async function handleDelete(id: string) {
    if (confirm("Delete this practice plan?")) {
      await deletePlan(id);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Practice Plans</h2>
        {isAdmin && (
          <Link to="/plans/new" className="btn btn-primary">
            + New Plan
          </Link>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <h3>No practice plans yet</h3>
          <p>Create your first practice plan to get started.</p>
        </div>
      ) : (
        <div className="grid-2">
          {sorted.map((plan) => (
            <div key={plan.id} className="card">
              <div className="flex justify-between items-center mb-2">
                <h3 style={{ fontSize: "1.05rem" }}>{plan.name}</h3>
                <span className="text-sm text-muted">
                  {formatDate(plan.date)}
                </span>
              </div>

              <p className="text-sm text-muted mb-2">
                {plan.stations.length} station
                {plan.stations.length !== 1 ? "s" : ""} &middot;{" "}
                {getTotalPlanMinutes(plan.stations)} min
              </p>

              {plan.notes && (
                <p
                  className="text-sm text-muted mb-2"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {plan.notes}
                </p>
              )}

              <div className="flex gap-2" style={{ marginTop: 12 }}>
                {isAdmin && (
                  <Link
                    to={`/plans/${plan.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    Edit
                  </Link>
                )}
                <Link
                  to={`/plans/${plan.id}/view`}
                  className="btn btn-accent btn-sm"
                >
                  View
                </Link>
                {isAdmin && (
                  <button
                    className="btn btn-sm"
                    style={{
                      background: "none",
                      color: "var(--color-danger)",
                      border: "1px solid var(--color-danger)",
                    }}
                    onClick={() => handleDelete(plan.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
