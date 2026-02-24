import { useState, type FormEvent } from "react";
import { useApp } from "../context";
import type { Coach } from "../types";

export default function Coaches() {
  const { coaches, addCoach, updateCoach, deleteCoach } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coach | undefined>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  function openNew() {
    setEditing(undefined);
    setName("");
    setEmail("");
    setPhone("");
    setShowForm(true);
  }

  function openEdit(coach: Coach) {
    setEditing(coach);
    setName(coach.name);
    setEmail(coach.email);
    setPhone(coach.phone);
    setShowForm(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const coach: Coach = {
      id: editing?.id ?? crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    if (editing) {
      updateCoach(coach);
    } else {
      addCoach(coach);
    }
    setShowForm(false);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this coach?")) {
      deleteCoach(id);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Coaches</h2>
        <button className="btn btn-primary" onClick={openNew}>
          + Add Coach
        </button>
      </div>

      {coaches.length === 0 ? (
        <div className="empty-state">
          <h3>No coaches added yet</h3>
          <p>
            Add coaches so you can assign them to stations in your practice
            plans.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {coaches.map((coach) => (
            <div key={coach.id} className="card">
              <h3 style={{ fontSize: "1.05rem", marginBottom: 8 }}>
                {coach.name}
              </h3>
              {coach.email && (
                <p className="text-sm text-muted">{coach.email}</p>
              )}
              {coach.phone && (
                <p className="text-sm text-muted">{coach.phone}</p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => openEdit(coach)}
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
                  onClick={() => handleDelete(coach.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editing ? "Edit Coach" : "Add Coach"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Coach name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coach@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
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
                  {editing ? "Update" : "Add Coach"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
