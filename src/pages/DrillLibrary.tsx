import { useState } from "react";
import { useApp } from "../context";
import { DRILL_CATEGORIES, type Drill, type DrillCategory } from "../types";
import DrillForm from "../components/DrillForm";
import { getYouTubeEmbedUrl } from "../utils";

export default function DrillLibrary() {
  const { drills, addDrill, updateDrill, deleteDrill, isAdmin } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingDrill, setEditingDrill] = useState<Drill | undefined>();
  const [filterCategory, setFilterCategory] = useState<DrillCategory | "all">(
    "all"
  );
  const [search, setSearch] = useState("");

  const filtered = drills.filter((d) => {
    if (filterCategory !== "all" && d.category !== filterCategory) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  async function handleSave(drill: Drill) {
    if (editingDrill) {
      await updateDrill(drill);
    } else {
      await addDrill(drill);
    }
    setShowForm(false);
    setEditingDrill(undefined);
  }

  function handleEdit(drill: Drill) {
    setEditingDrill(drill);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this drill?")) {
      await deleteDrill(id);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Drill Library</h2>
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingDrill(undefined);
              setShowForm(true);
            }}
          >
            + Add Drill
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="search"
          placeholder="Search drills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            minWidth: 200,
          }}
        />
        <select
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(e.target.value as DrillCategory | "all")
          }
          style={{
            padding: "8px 12px",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
          }}
        >
          <option value="all">All Categories</option>
          {DRILL_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No drills found</h3>
          <p>
            {drills.length === 0
              ? "Add your first drill to get started."
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <div className="grid-2">
          {filtered.map((drill) => (
            <div key={drill.id} className="card">
              <div className="flex justify-between items-center mb-2">
                <h3 style={{ fontSize: "1.05rem" }}>{drill.name}</h3>
                <span className={`badge badge-${drill.category}`}>
                  {DRILL_CATEGORIES.find((c) => c.value === drill.category)
                    ?.label ?? drill.category}
                </span>
              </div>

              {drill.description && (
                <p className="text-sm text-muted mb-2">{drill.description}</p>
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

              {drill.youtubeUrl && (
                <div className="mb-2">
                  {getYouTubeEmbedUrl(drill.youtubeUrl) ? (
                    <div
                      style={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                        borderRadius: "var(--radius)",
                        overflow: "hidden",
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
                  ) : (
                    <a
                      href={drill.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm"
                    >
                      Watch Video
                    </a>
                  )}
                </div>
              )}

              {isAdmin && (
                <div className="flex gap-2" style={{ marginTop: 12 }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEdit(drill)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{
                      background: "none",
                      color: "var(--color-danger)",
                      border: "1px solid var(--color-danger)",
                    }}
                    onClick={() => handleDelete(drill.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingDrill ? "Edit Drill" : "Add New Drill"}</h3>
            <DrillForm
              drill={editingDrill}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingDrill(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
