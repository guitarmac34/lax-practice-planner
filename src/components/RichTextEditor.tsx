import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Node as TiptapNode, mergeAttributes } from "@tiptap/core";
import { useApp } from "../context";

const Iframe = TiptapNode.create({
  name: "iframe",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      frameborder: { default: "0" },
      allowfullscreen: { default: "true" },
      allow: { default: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" },
      style: { default: "width: 100%; aspect-ratio: 16/9; border: 0; border-radius: var(--radius);" },
    };
  },

  parseHTML() {
    return [{ tag: "iframe" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["iframe", mergeAttributes(HTMLAttributes)];
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const { plans } = useApp();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Iframe,
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const insertVideo = () => {
    const url = prompt("Enter video URL (YouTube, Loom, Vimeo, etc.):");
    if (url) {
      let embedUrl = url;
      // Convert YouTube watch URLs to embed
      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
      if (ytMatch) {
        embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
      }
      // Convert Vimeo URLs to embed
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
      // Convert Loom share URLs to embed
      const loomMatch = url.match(/loom\.com\/share\/([\w-]+)/);
      if (loomMatch) {
        embedUrl = `https://www.loom.com/embed/${loomMatch[1]}`;
      }
      editor.chain().focus().insertContent({
        type: "iframe",
        attrs: { src: embedUrl },
      }).run();
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
        <button type="button" onClick={insertVideo}>
          Embed Video
        </button>
        <button type="button" onClick={insertPlayLink}>
          Link to Play
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
