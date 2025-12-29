import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

interface SidebarProps {
  tags: { name: string; count: number }[];
}

function Sidebar({ tags }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <aside className={`sidebar ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 4L6 8L10 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="sidebar-section">
        <h3 className="sidebar-title">Tags</h3>
        <nav className="sidebar-nav">
          {tags.slice(0, 20).map((tag) => (
            <Link
              key={tag.name}
              to={`/blog?tag=${encodeURIComponent(tag.name)}`}
              className="sidebar-link sidebar-tag"
            >
              <span className="tag-name">{tag.name}</span>
              <span className="tag-count">{tag.count}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
