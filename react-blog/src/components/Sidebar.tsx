import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

interface SidebarProps {
  tags: { name: string; count: number }[];
}

function Sidebar({ tags }: SidebarProps) {

  return (
    <aside className="sidebar">
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
