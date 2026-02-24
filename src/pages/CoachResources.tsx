import { useState } from "react";
import { useApp } from "../context";
import RichTextEditor from "../components/RichTextEditor";
import PasswordGate from "../components/PasswordGate";

export default function CoachResources() {
  const { contentPages, upsertContentPage } = useApp();
  const page = contentPages.find((p) => p.id === "coaches-content");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(page?.content || "");

  const handleEdit = () => {
    setDraft(page?.content || "");
    setEditing(true);
  };

  const handleSave = () => {
    upsertContentPage({
      id: "coaches-content",
      title: "Coach Resources",
      content: draft,
      lastUpdated: new Date().toISOString(),
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <PasswordGate>
      <div>
        <div className="page-header">
          <h2>Coach Resources</h2>
          {!editing && (
            <button className="btn btn-primary" onClick={handleEdit}>
              Edit Page
            </button>
          )}
        </div>

        {editing ? (
          <div className="card">
            <RichTextEditor content={draft} onChange={setDraft} />
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        ) : page?.content ? (
          <div className="card">
            <div
              className="content-display"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
            {page.lastUpdated && (
              <p className="text-muted text-sm mt-4">
                Last updated: {new Date(page.lastUpdated).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No content yet</h3>
            <p>Click "Edit Page" to add coach resources.</p>
          </div>
        )}
      </div>
    </PasswordGate>
  );
}
