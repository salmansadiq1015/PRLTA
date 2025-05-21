import React, { useRef, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const Editor = ({ value, onChange }) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const editor = document.createElement("div");
      container.appendChild(editor);

      quillRef.current = new ReactQuill(editor, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image", "video"],
              ["blockquote", "code-block"],
            ],
            handlers: {
              image: handleImageInsert,
              video: handleVideoInsert,
            },
          },
        },
      });

      // Handle initial value
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Update state on content change
      quillRef.current.on("text-change", () => {
        onChange(quillRef.current.root.innerHTML);
      });
    }

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [value, onChange]);

  // Insert image by URL
  const handleImageInsert = () => {
    const url = prompt("Enter Image URL:");
    if (url) {
      const editor = quillRef.current;
      const range = editor.getSelection();
      editor.insertEmbed(range.index, "image", url);
    }
  };

  // Insert video by URL
  const handleVideoInsert = () => {
    const url = prompt("Enter Video URL:");
    if (url) {
      const editor = quillRef.current;
      const range = editor.getSelection();
      editor.insertEmbed(range.index, "video", url);
    }
  };

  return <div ref={containerRef} />;
};

export default Editor;
