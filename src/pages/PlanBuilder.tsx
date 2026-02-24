import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useApp } from "../context";
import { DRILL_CATEGORIES, type PracticePlan, type Station, type PlannedDrill, type Drill, type DrillCategory } from "../types";

function SortableDrillItem({
  item,
  drill,
  onRemove,
  onDurationChange,
}: {
  item: PlannedDrill;
  drill: Drill | undefined;
  onRemove: () => void;
  onDurationChange: (mins: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        background: "var(--color-bg)",
        borderRadius: "var(--radius)",
        marginBottom: 6,
        border: "1px solid var(--color-border)",
      }}
    >
      <span
        {...attributes}
        {...listeners}
        style={{
          cursor: "grab",
          padding: "0 4px",
          color: "var(--color-text-muted)",
          fontSize: "1.1rem",
          userSelect: "none",
        }}
      >
        &#x2630;
      </span>
      <span style={{ flex: 1, fontSize: "0.9rem" }}>
        {drill?.name ?? "Unknown Drill"}
      </span>
      <input
        type="number"
        min={1}
        value={item.duration}
        onChange={(e) => onDurationChange(parseInt(e.target.value) || 1)}
        style={{
          width: 60,
          padding: "4px 6px",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius)",
          textAlign: "center",
          fontSize: "0.85rem",
        }}
      />
      <span className="text-sm text-muted">min</span>
      <button className="btn-icon" onClick={onRemove} title="Remove">
        &times;
      </button>
    </div>
  );
}

function StationEditor({
  station,
  allDrills,
  coaches,
  onUpdate,
  onRemove,
}: {
  station: Station;
  allDrills: Drill[];
  coaches: { id: string; name: string }[];
  onUpdate: (s: Station) => void;
  onRemove: () => void;
}) {
  const [showDrillPicker, setShowDrillPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerCategory, setPickerCategory] = useState<DrillCategory | "all">("all");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = station.drills.findIndex((d) => d.id === active.id);
    const newIdx = station.drills.findIndex((d) => d.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    onUpdate({ ...station, drills: arrayMove(station.drills, oldIdx, newIdx) });
  }

  function addDrill(drill: Drill) {
    const planned: PlannedDrill = {
      id: crypto.randomUUID(),
      drillId: drill.id,
      duration: 10,
    };
    onUpdate({ ...station, drills: [...station.drills, planned] });
    setShowDrillPicker(false);
  }

  function removeDrill(id: string) {
    onUpdate({
      ...station,
      drills: station.drills.filter((d) => d.id !== id),
    });
  }

  function updateDrillDuration(id: string, duration: number) {
    onUpdate({
      ...station,
      drills: station.drills.map((d) =>
        d.id === id ? { ...d, duration } : d
      ),
    });
  }

  function toggleCoach(coachId: string) {
    const has = station.assignedCoachIds.includes(coachId);
    onUpdate({
      ...station,
      assignedCoachIds: has
        ? station.assignedCoachIds.filter((c) => c !== coachId)
        : [...station.assignedCoachIds, coachId],
    });
  }

  const filteredPickerDrills = allDrills.filter((d) => {
    if (pickerCategory !== "all" && d.category !== pickerCategory) return false;
    if (pickerSearch && !d.name.toLowerCase().includes(pickerSearch.toLowerCase())) return false;
    return true;
  });

  const stationMinutes = station.drills.reduce((s, d) => s + d.duration, 0);

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="flex justify-between items-center mb-2">
        <input
          value={station.name}
          onChange={(e) => onUpdate({ ...station, name: e.target.value })}
          style={{
            fontSize: "1.05rem",
            fontWeight: 600,
            border: "none",
            borderBottom: "2px solid var(--color-border)",
            padding: "4px 0",
            background: "transparent",
            width: "60%",
          }}
          placeholder="Station Name"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">{stationMinutes} min</span>
          <button
            className="btn btn-sm"
            style={{
              background: "none",
              color: "var(--color-danger)",
              border: "1px solid var(--color-danger)",
            }}
            onClick={onRemove}
          >
            Remove Station
          </button>
        </div>
      </div>

      {coaches.length > 0 && (
        <div className="mb-2">
          <label className="text-sm" style={{ fontWeight: 600 }}>
            Assigned Coaches:
          </label>
          <div className="flex gap-2 flex-wrap mt-2">
            {coaches.map((c) => (
              <label
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "var(--radius)",
                  background: station.assignedCoachIds.includes(c.id)
                    ? "var(--color-primary)"
                    : "var(--color-bg)",
                  color: station.assignedCoachIds.includes(c.id)
                    ? "white"
                    : "var(--color-text)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <input
                  type="checkbox"
                  checked={station.assignedCoachIds.includes(c.id)}
                  onChange={() => toggleCoach(c.id)}
                  style={{ display: "none" }}
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={station.drills.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {station.drills.map((item) => (
            <SortableDrillItem
              key={item.id}
              item={item}
              drill={allDrills.find((d) => d.id === item.drillId)}
              onRemove={() => removeDrill(item.id)}
              onDurationChange={(mins) => updateDrillDuration(item.id, mins)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {station.drills.length === 0 && (
        <p
          className="text-sm text-muted"
          style={{ textAlign: "center", padding: 16 }}
        >
          No drills added yet
        </p>
      )}

      <button
        className="btn btn-outline btn-sm mt-2"
        onClick={() => setShowDrillPicker(true)}
      >
        + Add Drill from Library
      </button>

      {showDrillPicker && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Drill to {station.name || "Station"}</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="search"
                placeholder="Search drills..."
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <select
                value={pickerCategory}
                onChange={(e) => setPickerCategory(e.target.value as DrillCategory | "all")}
                style={{
                  padding: "8px 12px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                }}
              >
                <option value="all">All</option>
                {DRILL_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {filteredPickerDrills.length === 0 ? (
              <p className="text-muted text-sm">
                No drills found. Add drills in the Drill Library first.
              </p>
            ) : (
              <div
                style={{
                  maxHeight: 350,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {filteredPickerDrills.map((drill) => (
                  <div
                    key={drill.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      background: "var(--color-bg)",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "0.9rem" }}>
                        {drill.name}
                      </strong>
                      <span
                        className={`badge badge-${drill.category}`}
                        style={{ marginLeft: 8 }}
                      >
                        {DRILL_CATEGORIES.find(
                          (c) => c.value === drill.category
                        )?.label ?? drill.category}
                      </span>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => addDrill(drill)}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={() => setShowDrillPicker(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlanBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plans, drills, coaches, addPlan, updatePlan } = useApp();

  const existing = id ? plans.find((p) => p.id === id) : null;

  const [name, setName] = useState(existing?.name ?? "");
  const [date, setDate] = useState(
    existing?.date ?? new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [stations, setStations] = useState<Station[]>(
    existing?.stations ?? []
  );

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setDate(existing.date);
      setNotes(existing.notes);
      setStations(existing.stations);
    }
  }, [existing]);

  function addStation() {
    setStations((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `Station ${prev.length + 1}`,
        assignedCoachIds: [],
        drills: [],
      },
    ]);
  }

  function updateStation(updated: Station) {
    setStations((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  function removeStation(stationId: string) {
    setStations((prev) => prev.filter((s) => s.id !== stationId));
  }

  async function handleSave() {
    if (!name.trim()) {
      alert("Please enter a plan name.");
      return;
    }

    const plan: PracticePlan = {
      id: existing?.id ?? crypto.randomUUID(),
      name: name.trim(),
      date,
      notes: notes.trim(),
      stations,
    };

    if (existing) {
      await updatePlan(plan);
    } else {
      await addPlan(plan);
    }

    navigate("/plans");
  }

  return (
    <div>
      <div className="page-header">
        <h2>{existing ? "Edit Practice Plan" : "New Practice Plan"}</h2>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => navigate("/plans")}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Plan
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <div className="form-group">
            <label>Plan Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tuesday Practice - Week 3"
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Practice Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes for this practice (goals, reminders, etc.)..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3>Stations</h3>
        <button className="btn btn-accent" onClick={addStation}>
          + Add Station
        </button>
      </div>

      {stations.length === 0 ? (
        <div className="empty-state">
          <h3>No stations yet</h3>
          <p>
            Add stations to organize your practice into rotation groups.
          </p>
        </div>
      ) : (
        stations.map((station) => (
          <StationEditor
            key={station.id}
            station={station}
            allDrills={drills}
            coaches={coaches}
            onUpdate={updateStation}
            onRemove={() => removeStation(station.id)}
          />
        ))
      )}
    </div>
  );
}
