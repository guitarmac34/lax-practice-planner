import { useState, type FormEvent } from "react";
import { DRILL_CATEGORIES, type Drill, type DrillCategory } from "../types";

interface Props {
  drill?: Drill;
  onSave: (drill: Drill) => void;
  onCancel: () => void;
}

export default function DrillForm({ drill, onSave, onCancel }: Props) {
  const [name, setName] = useState(drill?.name ?? "");
  const [description, setDescription] = useState(drill?.description ?? "");
  const [category, setCategory] = useState<DrillCategory>(
    drill?.category ?? "other"
  );
  const [youtubeUrl, setYoutubeUrl] = useState(drill?.youtubeUrl ?? "");
  const [coachingPointsText, setCoachingPointsText] = useState(
    drill?.coachingPoints.join("\n") ?? ""
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: drill?.id ?? crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      category,
      youtubeUrl: youtubeUrl.trim(),
      coachingPoints: coachingPointsText
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Drill Name *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rapid Fire Shooting"
          required
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as DrillCategory)}
        >
          {DRILL_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe how to run this drill..."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Coaching Points (one per line)</label>
        <textarea
          value={coachingPointsText}
          onChange={(e) => setCoachingPointsText(e.target.value)}
          placeholder={"Stick high, hands away from body\nQuick release\nStep towards target"}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>YouTube URL</label>
        <input
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {drill ? "Update Drill" : "Add Drill"}
        </button>
      </div>
    </form>
  );
}
