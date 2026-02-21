import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import {
  loadAllPosts,
  getAllTags,
  filterPostsByCategory,
  searchPosts,
  formatDate,
  type BlogPost,
} from "../utils/blogParser";
import "../styles/BlogList.css";

function BlogList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const categoryImages: { [key: string]: string } = {
    AWS: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    Cloud: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
    Networking:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    Security:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
    Development:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    DevOps:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800",
    AI: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    Blockchain:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    Linux: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800",
    Career:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
  };

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      const posts = await loadAllPosts();

      const allTags = getAllTags(posts);
      setTags(allTags);

      const categoryParam = searchParams.get("category");
      const tagParam = searchParams.get("tag");
      const searchParam = searchParams.get("search");

      if (searchParam) {
        const filtered = searchPosts(posts, searchParam);
        setDisplayedPosts(filtered);
        setSearchQuery(searchParam);
      } else if (categoryParam) {
        const filtered = filterPostsByCategory(posts, categoryParam);
        setDisplayedPosts(filtered);
      } else if (tagParam) {
        const filtered = posts.filter((post) =>
          post.tags.some((tag) => tag.toLowerCase() === tagParam.toLowerCase()),
        );
        setDisplayedPosts(filtered);
      } else {
        setDisplayedPosts(posts);
      }

      setIsLoading(false);
    }

    fetchPosts();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="blog-layout">
        <Sidebar tags={[]} />
        <main className="blog-main">
          <Loading />
        </main>
      </div>
    );
  }

  return (
    <div className="blog-layout">
      <Sidebar tags={tags} />

      <main className="blog-main">
        <div className="blog-header">
          <div>
            <h1>Blog</h1>
            <p className="blog-description">
              Tech notes on cloud, networking, AI, and development. Learning,
              breaking, fixing, and sharing.
            </p>
          </div>
          <div className="blog-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(
                      `/blog?search=${encodeURIComponent(searchQuery.trim())}`,
                    );
                  } else if (e.key === "Escape") {
                    setSearchQuery("");
                    navigate("/blog");
                  }
                }}
                className="search-input"
              />
              <button
                className="search-btn"
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(
                      `/blog?search=${encodeURIComponent(searchQuery.trim())}`,
                    );
                  }
                }}
              >
                Search
              </button>
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => {
                    setSearchQuery("");
                    navigate("/blog");
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <section className="articles-section">
          <div className="section-header">
            <h2>
              Articles{" "}
              <span className="article-count">{displayedPosts.length}</span>
            </h2>
            <div className="article-controls">
              <select
                className="sort-select"
                onChange={(e) => {
                  const sorted = [...displayedPosts];
                  if (e.target.value === "date") {
                    sorted.sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                    );
                  } else if (e.target.value === "title") {
                    sorted.sort((a, b) => a.title.localeCompare(b.title));
                  }
                  setDisplayedPosts(sorted);
                }}
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>

          <div className="articles-grid">
            {displayedPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="article-card"
              >
                <div className="article-image">
                  <img
                    loading="lazy"
                    src={
                      post.thumbnail ||
                      categoryImages[post.category] ||
                      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"
                    }
                    alt={post.title}
                  />
                  <span className="article-category">{post.category}</span>
                </div>
                <div className="article-content">
                  <div className="article-meta">
                    <span>⏱ {post.readTime}</span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="article-tags">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {displayedPosts.length === 0 && (
            <div className="no-results">
              <p>
                {searchParams.get("search")
                  ? `No articles found for "${searchParams.get("search")}"`
                  : searchParams.get("tag")
                    ? `No articles found with tag "${searchParams.get("tag")}"`
                    : "No articles found in this category."}
              </p>
              {(searchParams.get("search") ||
                searchParams.get("tag") ||
                searchParams.get("category")) && (
                <button
                  className="clear-filter-btn"
                  onClick={() => navigate("/blog")}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default BlogList;
