import { useState, useRef } from "react";
import Papa from "papaparse";
import { useApp } from "../context";
import type { ScheduleEvent, EventType } from "../types";
import { EVENT_TYPES } from "../types";

const emptyEvent: Omit<ScheduleEvent, "id"> = {
  date: "",
  time: "",
  eventType: "practice",
  opponent: "",
  location: "",
  notes: "",
};

export default function Schedule() {
  const { schedule, addScheduleEvent, updateScheduleEvent, deleteScheduleEvent, importSchedule } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyEvent);
  const [csvPreview, setCsvPreview] = useState<ScheduleEvent[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const sorted = [...schedule].sort((a, b) => {
    const d = a.date.localeCompare(b.date);
    return d !== 0 ? d : a.time.localeCompare(b.time);
  });

  const openAdd = () => {
    setForm(emptyEvent);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (ev: ScheduleEvent) => {
    setForm({ date: ev.date, time: ev.time, eventType: ev.eventType, opponent: ev.opponent, location: ev.location, notes: ev.notes });
    setEditingId(ev.id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.date) return;
    if (editingId) {
      updateScheduleEvent({ ...form, id: editingId });
    } else {
      addScheduleEvent({ ...form, id: crypto.randomUUID() });
    }
    setShowModal(false);
  };

  const handleCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const events: ScheduleEvent[] = (results.data as Record<string, string>[]).map((row) => ({
          id: crypto.randomUUID(),
          date: row.date || row.Date || "",
          time: row.time || row.Time || "",
          eventType: (row.eventType || row.type || row.Type || "other").toLowerCase() as EventType,
          opponent: row.opponent || row.Opponent || "",
          location: row.location || row.Location || "",
          notes: row.notes || row.Notes || "",
        }));
        setCsvPreview(events);
      },
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const confirmImport = () => {
    if (csvPreview) {
      importSchedule(csvPreview);
      setCsvPreview(null);
    }
  };

  const typeBadgeClass = (t: EventType) => {
    switch (t) {
      case "game": return "badge badge-offense";
      case "practice": return "badge badge-passing";
      case "tournament": return "badge badge-shooting";
      default: return "badge badge-other";
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Schedule</h2>
        <div className="flex gap-2">
          <label className="btn btn-outline" style={{ cursor: "pointer" }}>
            Upload CSV
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleCsv}
              style={{ display: "none" }}
            />
          </label>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Event
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <h3>No events scheduled</h3>
          <p>Add events manually or upload a CSV file.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "auto" }}>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Opponent</th>
                <th>Location</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.date}</td>
                  <td>{ev.time}</td>
                  <td><span className={typeBadgeClass(ev.eventType)}>{ev.eventType}</span></td>
                  <td>{ev.opponent}</td>
                  <td>{ev.location}</td>
                  <td>{ev.notes}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(ev)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteScheduleEvent(ev.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Event" : "Add Event"}</h3>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value as EventType })}>
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Opponent</label>
              <input type="text" value={form.opponent} onChange={(e) => setForm({ ...form, opponent: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {csvPreview && (
        <div className="modal-overlay" onClick={() => setCsvPreview(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <h3>CSV Import Preview</h3>
            <p className="text-sm text-muted mb-4">
              {csvPreview.length} event(s) found. This will replace all existing events.
            </p>
            <div style={{ maxHeight: 300, overflow: "auto" }}>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Opponent</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {csvPreview.map((ev) => (
                    <tr key={ev.id}>
                      <td>{ev.date}</td>
                      <td>{ev.time}</td>
                      <td>{ev.eventType}</td>
                      <td>{ev.opponent}</td>
                      <td>{ev.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setCsvPreview(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmImport}>Import</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
