import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context";
import { DRILL_CATEGORIES } from "../types";
import { formatDate } from "../utils";

type ViewMode = "by-date" | "by-drill";

export default function PracticeHistory() {
  const { plans, drills } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>("by-date");

  const sortedPlans = [...plans].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Build drill usage map: drillId -> dates[]
  const drillDates = new Map<string, string[]>();
  for (const plan of plans) {
    for (const station of plan.stations) {
      for (const pd of station.drills) {
        const existing = drillDates.get(pd.drillId) ?? [];
        if (!existing.includes(plan.date)) {
          existing.push(plan.date);
        }
        drillDates.set(pd.drillId, existing);
      }
    }
  }

  // Sort dates for each drill
  for (const [id, dates] of drillDates) {
    drillDates.set(
      id,
      dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    );
  }

  // Sort drills by usage count
  const drillUsage = drills
    .map((d) => ({
      drill: d,
      dates: drillDates.get(d.id) ?? [],
    }))
    .sort((a, b) => b.dates.length - a.dates.length);

  return (
    <div>
      <div className="page-header">
        <h2>Practice History</h2>
        <div className="flex gap-2">
          <button
            className={`btn ${viewMode === "by-date" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setViewMode("by-date")}
          >
            By Date
          </button>
          <button
            className={`btn ${viewMode === "by-drill" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setViewMode("by-drill")}
          >
            By Drill
          </button>
        </div>
      </div>

      {viewMode === "by-date" ? (
        <div>
          {sortedPlans.length === 0 ? (
            <div className="empty-state">
              <h3>No practice history</h3>
              <p>Create practice plans to start tracking history.</p>
            </div>
          ) : (
            sortedPlans.map((plan) => {
              const allDrillIds = plan.stations.flatMap((s) =>
                s.drills.map((d) => d.drillId)
              );
              const uniqueDrillIds = [...new Set(allDrillIds)];

              return (
                <div key={plan.id} className="card mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3>{plan.name}</h3>
                      <p className="text-sm text-muted">
                        {formatDate(plan.date)}
                      </p>
                    </div>
                    <Link
                      to={`/plans/${plan.id}/view`}
                      className="btn btn-outline btn-sm"
                    >
                      View Plan
                    </Link>
                  </div>

                  {plan.notes && (
                    <div
                      style={{
                        padding: 12,
                        background: "var(--color-bg)",
                        borderRadius: "var(--radius)",
                        marginBottom: 12,
                      }}
                    >
                      <strong className="text-sm">Notes:</strong>
                      <p
                        className="text-sm"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {plan.notes}
                      </p>
                    </div>
                  )}

                  <div>
                    <strong className="text-sm">
                      Drills ({uniqueDrillIds.length}):
                    </strong>
                    <div
                      className="flex flex-wrap gap-2 mt-2"
                      style={{ gap: 6 }}
                    >
                      {uniqueDrillIds.map((drillId) => {
                        const drill = drills.find((d) => d.id === drillId);
                        if (!drill) return null;
                        return (
                          <span
                            key={drillId}
                            className={`badge badge-${drill.category}`}
                          >
                            {drill.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-2">
                    <strong className="text-sm">
                      Stations ({plan.stations.length}):
                    </strong>
                    <span className="text-sm text-muted" style={{ marginLeft: 8 }}>
                      {plan.stations.map((s) => s.name).join(", ")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div>
          {drillUsage.length === 0 ? (
            <div className="empty-state">
              <h3>No drills tracked yet</h3>
              <p>Add drills to practice plans to start tracking usage.</p>
            </div>
          ) : (
            drillUsage.map(({ drill, dates }) => (
              <div key={drill.id} className="card mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <h3>{drill.name}</h3>
                    <span className={`badge badge-${drill.category}`}>
                      {DRILL_CATEGORIES.find(
                        (c) => c.value === drill.category
                      )?.label ?? drill.category}
                    </span>
                  </div>
                  <span
                    className="badge"
                    style={{
                      background:
                        dates.length > 0
                          ? "var(--color-success)"
                          : "var(--color-border)",
                      color: dates.length > 0 ? "white" : "var(--color-text-muted)",
                    }}
                  >
                    Used {dates.length} time{dates.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {dates.length > 0 ? (
                  <div className="flex flex-wrap gap-2" style={{ gap: 6 }}>
                    {dates.map((date) => (
                      <span
                        key={date}
                        className="text-sm"
                        style={{
                          padding: "2px 8px",
                          background: "var(--color-bg)",
                          borderRadius: "var(--radius)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        {formatDate(date)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">
                    This drill hasn't been used in any practice plans yet.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
