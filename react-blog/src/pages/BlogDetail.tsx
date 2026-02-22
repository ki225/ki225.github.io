import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeSlug from "rehype-slug";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import MermaidDiagram from "../components/MermaidDiagram";
import BookmarkCard from "../components/BookmarkCard";
import Callout from "../components/Callout";
import {
  loadPostBySlug,
  loadAllPosts,
  getAllTags,
  formatDate,
  type BlogPost,
} from "../utils/blogParser";
import "../styles/BlogDetail.css";

function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryImages: { [key: string]: string } = {
    AWS: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
    Cloud: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200",
    Networking:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200",
    Security:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200",
    Development:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
    DevOps:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200",
    AI: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
    Blockchain:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200",
    Linux:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200",
    Career:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200",
  };

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;

      setIsLoading(true);

      const currentPost = await loadPostBySlug(id);
      setPost(currentPost);

      const allPosts = loadAllPosts();
      const allTags = getAllTags(allPosts);
      setTags(allTags);

      if (currentPost) {
        const related = allPosts
          .filter(
            (p) =>
              p.id !== currentPost.id && p.category === currentPost.category,
          )
          .slice(0, 3);
        setRelatedPosts(related);
      }

      setIsLoading(false);
    }

    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="blog-layout">
        <Sidebar tags={[]} />
        <main className="blog-detail-main">
          <Loading />
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-layout">
        <Sidebar tags={tags} />
        <main className="blog-detail-main">
          <div className="error">
            <h2>Article not found</h2>
            <Link to="/blog" className="back-link">
              ← Back to Blog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="blog-layout">
      <Sidebar tags={tags} />

      <main className="blog-detail-main">
        <article className="article-detail">
          <header className="article-header">
            <div className="article-meta-info">
              <img
                src="/images/self/chiikawa.jpg"
                alt="Kiki H."
                className="author-avatar"
              />
              <div>
                <span className="author-name">Kiki Huang</span>
                <div className="article-info">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{formatDate(post.date)}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
            <h1>{post.title}</h1>
            <div className="article-tags-header">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="article-body">
            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
                [remarkToc, { tight: true, ordered: false }],
              ]}
              rehypePlugins={[rehypeRaw, rehypeSlug]}
              components={{
                code({
                  inline,
                  className,
                  children,
                  ...props
                }: {
                  inline?: boolean;
                  className?: string;
                  children?: React.ReactNode;
                }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "";

                  if (!inline && language === "mermaid") {
                    return <MermaidDiagram chart={String(children)} />;
                  }

                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={language}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                blockquote: ({ children }) => {
                  return <blockquote className="markdown-blockquote">{children}</blockquote>;
                },
                a: ({ href, children, ...props }) => {
                  let childText = "";
                  if (Array.isArray(children)) {
                    childText = children
                      .map((child) =>
                        typeof child === "string"
                          ? child
                          : child?.props?.children || "",
                      )
                      .join("");
                  } else if (typeof children === "string") {
                    childText = children;
                  }

                  if (childText.trim() === "bookmark" && href) {
                    return <BookmarkCard url={href} />;
                  }

                  // Handle anchor links (TOC links)
                  if (href?.startsWith('#')) {
                    return (
                      <a
                        href={href}
                        {...props}
                        onClick={(e) => {
                          e.preventDefault();
                          const id = decodeURIComponent(href.substring(1));
                          const element = document.getElementById(id);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                      >
                        {children}
                      </a>
                    );
                  }

                  if (href?.endsWith('.md')) {
                    const slug = href.replace('.md', '');
                    return (
                      <Link to={`/blog/${slug}`} {...props}>
                        {children}
                      </Link>
                    );
                  }

                  if (href?.startsWith('/') && !href.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
                    return (
                      <Link to={href} {...props}>
                        {children}
                      </Link>
                    );
                  }

                  return (
                    <a
                      href={href}
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  );
                },
                img: ({ ...props }) => {
                  let src = props.src || "";
                  if (
                    src &&
                    !src.startsWith("http://") &&
                    !src.startsWith("https://") &&
                    !src.startsWith("/")
                  ) {
                    src = "/" + src;
                  }
                  return <img {...props} src={src} alt={props.alt || ""} />;
                },
                aside: ({ children }) => {
                  return <Callout type="info">{children}</Callout>;
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <footer className="article-footer">
            <Link to="/blog" className="back-link">
              ← Back to all articles
            </Link>
          </footer>
        </article>
      </main>

      <aside className="article-sidebar">
        <div className="share-section">
          <h3>Share to</h3>
          <div className="share-buttons">
            <button
              className="share-btn"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
            >
              🔗
            </button>
            <button
              className="share-btn"
              onClick={() => {
                window.open(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`,
                  "_blank",
                );
              }}
            >
              🐦
            </button>
            <button
              className="share-btn"
              onClick={() => {
                window.open(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                  "_blank",
                );
              }}
            >
              💼
            </button>
            <button
              className="share-btn"
              onClick={() => {
                window.open(
                  `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(window.location.href)}`,
                  "_blank",
                );
              }}
            >
              📧
            </button>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="related-section">
            <h3>Related Articles</h3>
            <div className="related-articles">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  to={`/blog/${related.slug}`}
                  className="related-card"
                >
                  <img
                    src={
                      related.thumbnail ||
                      categoryImages[related.category] ||
                      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400"
                    }
                    alt={related.title}
                  />
                  <div>
                    <h4>{related.title}</h4>
                    <span className="related-category">{related.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default BlogDetail;
