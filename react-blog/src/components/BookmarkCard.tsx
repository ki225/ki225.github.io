import { useState, useEffect } from "react";
import "../styles/BookmarkCard.css";

interface BookmarkCardProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

function BookmarkCard({ url, title, description, image }: BookmarkCardProps) {
  const [favicon, setFavicon] = useState<string>("");
  const [siteLogo, setSiteLogo] = useState<string>("");

  useEffect(() => {
    try {
      const urlObj = new URL(url);
      setFavicon(`${urlObj.protocol}//${urlObj.host}/favicon.ico`);
      // 使用 Google's favicon service 获取更高质量的图标
      setSiteLogo(`https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`);
    } catch (e) {
      setFavicon("");
      setSiteLogo("");
    }
  }, [url]);

  const displayUrl = (() => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  })();

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
            {favicon && (
              <img
                src={favicon}
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
          {siteLogo && (
            <img 
              src={siteLogo} 
              alt="" 
              onError={(e) => {
                // 如果 Google 服务失败，尝试直接使用 favicon
                if ((e.target as HTMLImageElement).src !== favicon) {
                  (e.target as HTMLImageElement).src = favicon || '';
                } else {
                  (e.target as HTMLImageElement).style.display = 'none';
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
