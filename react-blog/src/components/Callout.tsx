import "../styles/Callout.css";

interface CalloutProps {
  type?: "info" | "warning" | "important" | "tip" | "note";
  children: React.ReactNode;
}

const iconMap = {
  info: "ℹ️",
  warning: "⚠️",
  important: "❗",
  tip: "💡",
  note: "📝",
};

const colorMap = {
  info: "#3b82f6",
  warning: "#f59e0b",
  important: "#ef4444",
  tip: "#10b981",
  note: "#8b5cf6",
};

function Callout({ type = "info", children }: CalloutProps) {
  return (
    <div 
      className="callout" 
      style={{ borderLeftColor: colorMap[type] }}
      data-type={type}
    >
      <div className="callout-icon" style={{ color: colorMap[type] }}>
        {iconMap[type]}
      </div>
      <div className="callout-content">{children}</div>
    </div>
  );
}

export default Callout;
