import { useState } from "react";
import { useApp } from "../context";
import RichTextEditor from "../components/RichTextEditor";

export default function ParentInfo() {
  const { contentPages, upsertContentPage } = useApp();
  const page = contentPages.find((p) => p.id === "parents");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(page?.content || "");

  const handleEdit = () => {
    setDraft(page?.content || "");
    setEditing(true);
  };

  const handleSave = () => {
    upsertContentPage({
      id: "parents",
      title: "Parent Information",
      content: draft,
      lastUpdated: new Date().toISOString(),
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Parent Information</h2>
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
          <p>Click "Edit Page" to add parent information.</p>
        </div>
      )}
    </div>
  );
}
