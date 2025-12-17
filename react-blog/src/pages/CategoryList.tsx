import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import {
  loadAllPosts,
  getAllTags,
  getAllCategories,
  formatDate,
  type BlogPost,
} from "../utils/blogParser";
import "../styles/CategoryList.css";

function CategoryList() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 根據 category 名稱取得對應的背景圖片
  const getCategoryImage = (categoryName: string): string => {
    const categoryLower = categoryName.toLowerCase();
    const imageMap: { [key: string]: string } = {
      "3gpp": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      "5g": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      aws: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      blockchain: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
      career: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
      "developing note": "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800",
      devops: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800",
      life: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800",
      linux: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800",
      security: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
      "virtualize networking": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      "wireless networking": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      general: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800",
    };

    return imageMap[categoryLower] || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800";
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const allPosts = await loadAllPosts();
      const allTags = getAllTags(allPosts);
      const allCategories = getAllCategories(allPosts);
      
      setTags(allTags);
      setCategories(allCategories);

      // 如果有指定分類，篩選該 category 的文章
      if (category) {
        const filteredPosts = allPosts.filter((post) =>
          post.category.toLowerCase() === category.toLowerCase()
        );
        setPosts(filteredPosts);
        setDisplayedPosts(filteredPosts);
      } else {
        setPosts([]);
        setDisplayedPosts([]);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [category]);

  if (isLoading) {
    return (
      <div className="blog-layout">
        <Sidebar tags={[]} />
        <main className="category-main">
          <Loading />
        </main>
      </div>
    );
  }

  // 如果沒有指定分類，顯示所有分類的概覽
  if (!category) {
    return (
      <div className="blog-layout">
        <Sidebar tags={tags} />
        <main className="category-main">
          <div className="category-header">
            <h1>Categories</h1>
            <p className="category-description">
              Browse articles by category
            </p>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/category/${encodeURIComponent(cat.name.toLowerCase())}`}
                className="category-card"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${getCategoryImage(cat.name)})`,
                }}
              >
                <div className="category-card-content">
                  <h2>{cat.name}</h2>
                  <p className="category-card-count">
                    {cat.count} {cat.count === 1 ? "article" : "articles"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // 搜索功能
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setDisplayedPosts(posts);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
    setDisplayedPosts(filtered);
  };

  // 顯示特定分類的文章列表
  const categoryName = decodeURIComponent(category);
  
  return (
    <div className="blog-layout">
      <Sidebar tags={tags} />
      <main className="category-main">
        <div className="category-detail-header">
          <div className="category-header-content">
            <button
              className="back-button"
              onClick={() => navigate("/categories")}
            >
              ← Back to Categories
            </button>
            <h1>#{categoryName}</h1>
            <p className="category-detail-description">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>
          <div className="category-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search in this category..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchQuery("");
                    setDisplayedPosts(posts);
                  }
                }}
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setDisplayedPosts(posts);
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
                        new Date(b.date).getTime() - new Date(a.date).getTime()
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
                    src={
                      post.thumbnail ||
                      getCategoryImage(categoryName) ||
                      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"
                    }
                    alt={post.title}
                  />
                  <span className="article-category">{categoryName}</span>
                </div>
                <div className="article-content">
                  <div className="article-meta">
                    <span>⏱ {post.readTime}</span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="article-tags">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">
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
                {searchQuery
                  ? `No articles found for "${searchQuery}"`
                  : "No articles found in this category."}
              </p>
              {searchQuery && (
                <button
                  className="clear-filter-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setDisplayedPosts(posts);
                  }}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default CategoryList;
