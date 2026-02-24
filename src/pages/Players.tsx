import { useState, type FormEvent } from "react";
import { useApp } from "../context";
import type { Player, PlayerPosition } from "../types";
import { PLAYER_POSITIONS } from "../types";

export default function Players() {
  const { players, addPlayer, updatePlayer, deletePlayer, isAdmin } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Player | undefined>();
  const [name, setName] = useState("");
  const [positions, setPositions] = useState<PlayerPosition[]>([]);
  const [rank, setRank] = useState(1);

  function openNew() {
    setEditing(undefined);
    setName("");
    setPositions([]);
    setRank(1);
    setShowForm(true);
  }

  function openEdit(player: Player) {
    setEditing(player);
    setName(player.name);
    setPositions(player.positions);
    setRank(player.rank);
    setShowForm(true);
  }

  function togglePosition(pos: PlayerPosition) {
    setPositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || positions.length === 0) return;

    const player: Player = {
      id: editing?.id ?? crypto.randomUUID(),
      name: name.trim(),
      positions,
      rank,
    };

    if (editing) {
      await updatePlayer(player);
    } else {
      await addPlayer(player);
    }
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this player?")) {
      await deletePlayer(id);
    }
  }

  const sorted = [...players].sort((a, b) => a.rank - b.rank);

  return (
    <div>
      <div className="page-header">
        <h2>Player Directory</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openNew}>
            + Add Player
          </button>
        )}
      </div>

      {players.length === 0 ? (
        <div className="empty-state">
          <h3>No players added yet</h3>
          <p>Add players to build your team roster with positions and rankings.</p>
        </div>
      ) : (
        <div className="grid-3">
          {sorted.map((player) => (
            <div key={player.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ fontSize: "1.05rem", marginBottom: 8 }}>
                  {player.name}
                </h3>
                <span
                  style={{
                    background: "var(--color-primary)",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {player.rank}
                </span>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {player.positions.map((pos) => (
                  <span
                    key={pos}
                    className="badge"
                    style={{
                      background: "var(--color-surface)",
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: "0.8rem",
                    }}
                  >
                    {PLAYER_POSITIONS.find((p) => p.value === pos)?.label ?? pos}
                  </span>
                ))}
              </div>
              {isAdmin && (
                <div className="flex gap-2 mt-4">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => openEdit(player)}
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
                    onClick={() => handleDelete(player.id)}
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
            <h3>{editing ? "Edit Player" : "Add Player"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Player name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Positions * (select all that apply)</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PLAYER_POSITIONS.map((pos) => (
                    <label
                      key={pos.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        cursor: "pointer",
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: positions.includes(pos.value)
                          ? "2px solid var(--color-primary)"
                          : "2px solid var(--color-border)",
                        background: positions.includes(pos.value)
                          ? "var(--color-primary-light, rgba(37,99,235,0.1))"
                          : "transparent",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={positions.includes(pos.value)}
                        onChange={() => togglePosition(pos.value)}
                        style={{ display: "none" }}
                      />
                      {pos.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Rank (1 = highest)</label>
                <input
                  type="number"
                  min={1}
                  value={rank}
                  onChange={(e) => setRank(Number(e.target.value))}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editing ? "Update" : "Add Player"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
