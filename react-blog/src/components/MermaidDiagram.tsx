import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
}

let mermaidInitialized = false;

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        fontFamily: "monospace",
      });
      mermaidInitialized = true;
    }

    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart.trim());
        setSvg(svg);
        setError("");
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError("Failed to render diagram");
      }
    };

    renderDiagram();
  }, [chart]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) {
        setIsZoomed(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isZoomed]);

  if (error) {
    return (
      <div className="mermaid-container">
        <pre style={{ color: "#ff6b6b" }}>{error}</pre>
      </div>
    );
  }

  return (
    <>
      <div 
        className="mermaid-container" 
        ref={containerRef}
        onClick={() => setIsZoomed(true)}
        style={{ cursor: "zoom-in" }}
        title="點擊放大查看"
      >
        {svg ? (
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <div>Loading diagram...</div>
        )}
      </div>

      {isZoomed && (
        <div 
          className="mermaid-modal" 
          onClick={() => setIsZoomed(false)}
        >
          <div className="mermaid-modal-content">
            <button 
              className="mermaid-modal-close"
              onClick={() => setIsZoomed(false)}
            >
              ✕
            </button>
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
        </div>
      )}
    </>
  );
}
