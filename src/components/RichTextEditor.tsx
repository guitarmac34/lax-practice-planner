import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import Link from "@tiptap/extension-link";
import { useApp } from "../context";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const { plans } = useApp();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Youtube.configure({ controls: true }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const insertYouTube = () => {
    const url = prompt("Enter YouTube URL:");
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  const insertPlayLink = () => {
    if (plans.length === 0) {
      alert("No practice plans available to link.");
      return;
    }
    const options = plans.map((p, i) => `${i + 1}. ${p.name} (${p.date})`).join("\n");
    const choice = prompt(`Select a plan by number:\n${options}`);
    if (choice) {
      const idx = parseInt(choice, 10) - 1;
      const plan = plans[idx];
      if (plan) {
        editor
          .chain()
          .focus()
          .setLink({ href: `/plans/${plan.id}/view` })
          .insertContent(plan.name)
          .unsetLink()
          .run();
      }
    }
  };

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <button
          type="button"
          className={editor.isActive("bold") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          className={editor.isActive("italic") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={editor.isActive("heading", { level: 3 }) ? "active" : ""}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          type="button"
          className={editor.isActive("bulletList") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          UL
        </button>
        <button
          type="button"
          className={editor.isActive("orderedList") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          OL
        </button>
        <button type="button" onClick={insertYouTube}>
          YouTube
        </button>
        <button type="button" onClick={insertPlayLink}>
          Link to Play
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
