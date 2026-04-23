import { useRef } from "react";

interface ResizeHandleProps {
  onResize: (dx: number) => void;
}

export function ResizeHandle({ onResize }: ResizeHandleProps) {
  const draggingRef = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    let lastX = e.clientX;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (ev: MouseEvent) => {
      if (!draggingRef.current) return;
      const dx = ev.clientX - lastX;
      lastX = ev.clientX;
      if (dx !== 0) onResize(dx);
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1 shrink-0 cursor-col-resize bg-transparent hover:bg-blue-200 active:bg-blue-300 transition-colors"
      style={{ zIndex: 5 }}
    />
  );
}
