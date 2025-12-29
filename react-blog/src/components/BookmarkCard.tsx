import { useMemo } from "react";
import "../styles/BookmarkCard.css";

interface BookmarkCardProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

function BookmarkCard({ url, title, description }: BookmarkCardProps) {
  const icons = useMemo(() => {
    try {
      const urlObj = new URL(url);
      return {
        favicon: `${urlObj.protocol}//${urlObj.host}/favicon.ico`,
        siteLogo: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`,
      };
    } catch {
      return { favicon: "", siteLogo: "" };
    }
  }, [url]);

  const displayUrl = useMemo(() => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  }, [url]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bookmark-card"
    >
      <div className="bookmark-content">
        <div className="bookmark-text">
          <div className="bookmark-title">{title || url}</div>
          {description && (
            <div className="bookmark-description">{description}</div>
          )}
          <div className="bookmark-link">
            {icons.favicon && (
              <img
                src={icons.favicon}
                alt=""
                className="bookmark-favicon"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <span>{displayUrl}</span>
          </div>
        </div>
        <div className="bookmark-icon">
          {icons.siteLogo && (
            <img
              src={icons.siteLogo}
              alt=""
              onError={(e) => {
                if ((e.target as HTMLImageElement).src !== icons.favicon) {
                  (e.target as HTMLImageElement).src = icons.favicon || "";
                } else {
                  (e.target as HTMLImageElement).style.display = "none";
                }
              }}
            />
          )}
        </div>
      </div>
    </a>
  );
}

export default BookmarkCard;
