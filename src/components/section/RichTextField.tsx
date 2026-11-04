import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useTheme } from "../../context/ThemeContext";

type RichTextFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextField({ value, onChange }: RichTextFieldProps) {
  const { colors } = useTheme();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  return (
    <RichTextEditor
      editor={editor}
      styles={{
        root: {
          borderColor: colors.bgHighlight,
          backgroundColor: colors.bgSurface,
          color: colors.text,
          borderRadius: 12,
          overflow: "hidden",
        },
        content: {
          backgroundColor: colors.bgSurface,
          color: colors.text,
          padding: "10px 12px",
          caretColor: colors.accPrimary,
          "& .ProseMirror": {
            outline: "none",
            color: colors.text,
            caretColor: colors.accPrimary,
          },
        },
      }}
    >
      
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
