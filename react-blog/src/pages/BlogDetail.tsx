import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Sidebar from '../components/Sidebar'
import { loadPostBySlug, loadAllPosts, getAllTags, formatDate, type BlogPost } from '../utils/blogParser'
import '../styles/BlogDetail.css'

function BlogDetail() {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [tags, setTags] = useState<{ name: string; count: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const categoryImages: { [key: string]: string } = {
    'AWS': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
    'Cloud': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200',
    'Networking': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200',
    'Security': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200',
    'Development': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
    'DevOps': 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200',
    'AI': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
    'Blockchain': 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200',
    'Linux': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200',
    'Career': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200'
  }

  useEffect(() => {
    async function fetchPost() {
      if (!id) return
      
      setIsLoading(true)
      
      const currentPost = await loadPostBySlug(id)
      setPost(currentPost)

      const allPosts = await loadAllPosts()
      const allTags = getAllTags(allPosts)
      setTags(allTags)

      if (currentPost) {
        const related = allPosts
          .filter(p => p.id !== currentPost.id && p.category === currentPost.category)
          .slice(0, 3)
        setRelatedPosts(related)
      }

      setIsLoading(false)
    }

    fetchPost()
  }, [id])

  if (isLoading) {
    return (
      <div className="blog-layout">
        <Sidebar tags={[]} />
        <main className="blog-detail-main">
          <div className="loading">Loading article...</div>
        </main>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-layout">
        <Sidebar tags={tags} />
        <main className="blog-detail-main">
          <div className="error">
            <h2>Article not found</h2>
            <Link to="/blog" className="back-link">← Back to Blog</Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="blog-layout">
      <Sidebar tags={tags} />
      
      <main className="blog-detail-main">
        <article className="article-detail">
          <header className="article-header">
            <div className="article-meta-info">
              <img src="https://ki225.github.io/images/self/image.png" alt="Kiki Huang" className="author-avatar" />
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
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </header>

          <div className="article-image-container">
            <img 
              src={post.thumbnail || categoryImages[post.category] || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200'} 
              alt={post.title} 
            />
          </div>

          <div className="article-body">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={{
                img: ({...props}) => {
                  let src = props.src || ''
                  if (src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('/')) {
                    src = '/' + src
                  }
                  return <img {...props} src={src} alt={props.alt || ''} />
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <footer className="article-footer">
            <Link to="/blog" className="back-link">← Back to all articles</Link>
          </footer>
        </article>
      </main>

      <aside className="article-sidebar">
        <div className="share-section">
          <h3>Share to</h3>
          <div className="share-buttons">
            <button className="share-btn" onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              alert('Link copied to clipboard!')
            }}>
              🔗
            </button>
            <button className="share-btn" onClick={() => {
              window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')
            }}>
              🐦
            </button>
            <button className="share-btn" onClick={() => {
              window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')
            }}>
              💼
            </button>
            <button className="share-btn" onClick={() => {
              window.open(`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(window.location.href)}`, '_blank')
            }}>
              📧
            </button>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="related-section">
            <h3>Related Articles</h3>
            <div className="related-articles">
              {relatedPosts.map((related) => (
                <Link key={related.id} to={`/blog/${related.slug}`} className="related-card">
                  <img 
                    src={related.thumbnail || categoryImages[related.category] || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400'} 
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
  )
}

export default BlogDetail
