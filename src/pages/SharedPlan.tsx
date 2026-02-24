import { useParams } from "react-router-dom";
import { DRILL_CATEGORIES } from "../types";
import { decodeShareData, formatDate, getYouTubeEmbedUrl, getTotalPlanMinutes } from "../utils";

export default function SharedPlan() {
  const { encoded } = useParams();
  const data = encoded ? decodeShareData(encoded) : null;

  if (!data) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 32,
        }}
      >
        <div className="empty-state">
          <h3>Invalid or expired link</h3>
          <p>This practice plan link could not be loaded.</p>
        </div>
      </div>
    );
  }

  const { plan, drills, coaches } = data;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 32,
      }}
    >
      <div className="print-header" style={{ marginBottom: 24 }}>
        <h1>Lax Practice</h1>
      </div>

      <div className="flex justify-between items-center no-print" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "var(--color-primary)", fontSize: "1.5rem" }}>
            {plan.name}
          </h1>
          <p className="text-muted">{formatDate(plan.date)}</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.print()}>
          Print
        </button>
      </div>

      <div className="card mb-4">
        <div className="flex justify-between items-center">
          <h3>{plan.name}</h3>
          <span className="text-sm text-muted">
            {plan.stations.length} station{plan.stations.length !== 1 ? "s" : ""}{" "}
            &middot; {getTotalPlanMinutes(plan.stations)} min
          </span>
        </div>
        <p className="text-muted text-sm">{formatDate(plan.date)}</p>
        {plan.notes && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              background: "var(--color-bg)",
              borderRadius: "var(--radius)",
            }}
          >
            <strong className="text-sm">Notes:</strong>
            <p className="text-sm" style={{ whiteSpace: "pre-wrap" }}>
              {plan.notes}
            </p>
          </div>
        )}
      </div>

      {plan.stations.map((station) => {
        const stationCoaches = coaches.filter((c) =>
          station.assignedCoachIds.includes(c.id)
        );
        const stationMinutes = station.drills.reduce(
          (s, d) => s + d.duration,
          0
        );

        return (
          <div key={station.id} className="card mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3>{station.name}</h3>
              <span className="text-sm text-muted">{stationMinutes} min</span>
            </div>

            {stationCoaches.length > 0 && (
              <p className="text-sm mb-2">
                <strong>Coaches:</strong>{" "}
                {stationCoaches.map((c) => c.name).join(", ")}
              </p>
            )}

            {station.drills.map((planned) => {
              const drill = drills.find((d) => d.id === planned.drillId);
              if (!drill) return null;

              return (
                <div
                  key={planned.id}
                  style={{
                    padding: 16,
                    background: "var(--color-bg)",
                    borderRadius: "var(--radius)",
                    marginBottom: 12,
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <h4>{drill.name}</h4>
                      <span className={`badge badge-${drill.category}`}>
                        {DRILL_CATEGORIES.find(
                          (c) => c.value === drill.category
                        )?.label ?? drill.category}
                      </span>
                    </div>
                    <span
                      className="badge"
                      style={{
                        background: "var(--color-primary)",
                        color: "white",
                      }}
                    >
                      {planned.duration} min
                    </span>
                  </div>

                  {drill.description && (
                    <p className="text-sm mb-2">{drill.description}</p>
                  )}

                  {drill.coachingPoints.length > 0 && (
                    <div className="mb-2">
                      <strong className="text-sm">Coaching Points:</strong>
                      <ul
                        style={{
                          paddingLeft: 20,
                          fontSize: "0.85rem",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {drill.coachingPoints.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {drill.youtubeUrl &&
                    getYouTubeEmbedUrl(drill.youtubeUrl) && (
                      <div
                        className="no-print"
                        style={{
                          position: "relative",
                          paddingBottom: "56.25%",
                          height: 0,
                          borderRadius: "var(--radius)",
                          overflow: "hidden",
                          marginTop: 8,
                        }}
                      >
                        <iframe
                          src={getYouTubeEmbedUrl(drill.youtubeUrl)!}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={drill.name}
                        />
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
