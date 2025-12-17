export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  thumbnail?: string;
}

export interface BlogMetadata {
  title: string;
  date: string;
  tags: string[];
}

/**
 * 解析 Markdown frontmatter
 */
export function parseFrontmatter(markdown: string): {
  metadata: BlogMetadata;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return {
      metadata: { title: "Untitled", date: "", tags: [] },
      content: markdown,
    };
  }

  const frontmatterText = match[1];
  const content = match[2];

  const metadata: BlogMetadata = {
    title: "",
    date: "",
    tags: [],
  };

  const titleMatch = frontmatterText.match(/title:\s*(.+)/);
  const dateMatch = frontmatterText.match(/date:\s*(.+)/);
  const tagsMatch = frontmatterText.match(/tags:\s*\[(.+?)\]/);

  if (titleMatch) metadata.title = titleMatch[1].trim();
  if (dateMatch) metadata.date = dateMatch[1].trim();
  if (tagsMatch) {
    metadata.tags = tagsMatch[1].split(",").map((tag) => tag.trim());
  }

  return { metadata, content };
}

/**
 * 计算阅读时间（基于字数）
 */
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function extractFirstImage(content: string): string | undefined {
  const imageRegex = /!\[.*?\]\((.+?)\)/;
  const match = content.match(imageRegex);

  if (match && match[1]) {
    let imagePath = match[1].trim();

    if (!imagePath.startsWith("http://") && !imagePath.startsWith("https://")) {
      if (!imagePath.startsWith("/")) {
        imagePath = "/" + imagePath;
      }
    }

    return imagePath;
  }

  return undefined;
}

export function generateExcerpt(
  content: string,
  maxLength: number = 150,
): string {
  const plainText = content
    .replace(/^#+ .+$/gm, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/[*_~]/g, "")
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength) + "...";
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function getCategory(tags: string[]): string {
  if (tags.length === 0) return "General";

  const categoryMap: { [key: string]: string } = {
    aws: "AWS",
    cloud: "Cloud",
    networking: "Networking",
    "5g": "Networking",
    "3gpp": "Networking",
    security: "Security",
    blockchain: "Blockchain",
    terraform: "DevOps",
    devops: "DevOps",
    docker: "DevOps",
    iac: "DevOps",
    ai: "AI",
    ml: "AI",
    "machine-learning": "AI",
    git: "Development",
    hexo: "Development",
    php: "Development",
    linux: "Linux",
    ubuntu: "Linux",
    interview: "Career",
  };

  for (const tag of tags) {
    const normalizedTag = tag.toLowerCase();
    if (categoryMap[normalizedTag]) {
      return categoryMap[normalizedTag];
    }
  }

  return tags[0];
}

export function getCategoryFromPath(path: string): string {
  const parts = path.split("/");
  const postsIndex = parts.findIndex(p => p === "posts");
  
  if (postsIndex === -1 || postsIndex >= parts.length - 2) {
    return "General";
  }
  
  return parts[postsIndex + 1]; 
}

export async function loadAllPosts(): Promise<BlogPost[]> {
  const postFiles = import.meta.glob("/src/posts/**/*.md", { as: "raw" });

  const posts: BlogPost[] = [];

  for (const path in postFiles) {
    try {
      const markdown = (await postFiles[path]()) as string;
      const { metadata, content } = parseFrontmatter(markdown);

      const filename = path.split("/").pop()?.replace(".md", "") || "";
      const category = getCategoryFromPath(path);

      const post: BlogPost = {
        id: filename,
        slug: filename,
        title: metadata.title,
        date: metadata.date,
        tags: metadata.tags,
        excerpt: generateExcerpt(content),
        content: content,
        category: category,
        readTime: calculateReadTime(content),
        thumbnail: extractFirstImage(content),
      };

      posts.push(post);
    } catch (error) {
      console.error(`Error loading post ${path}:`, error);
    }
  }

  return posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

export async function loadPostBySlug(slug: string): Promise<BlogPost | null> {
  // 先嘗試從所有文章中找到對應的 slug
  const allPosts = await loadAllPosts();
  const post = allPosts.find(p => p.slug === slug);
  
  if (post) {
    return post;
  }
  
  console.error(`Post not found: ${slug}`);
  return null;
}

export function getAllCategories(
  posts: BlogPost[],
): { name: string; count: number }[] {
  const categoryCount: { [key: string]: number } = {};

  posts.forEach((post) => {
    const category = post.category;
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  return Object.entries(categoryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function filterPostsByCategory(
  posts: BlogPost[],
  category: string,
): BlogPost[] {
  return posts.filter((post) => post.category === category);
}

export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}

export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
}

export function getAllTags(
  posts: BlogPost[],
): { name: string; count: number }[] {
  const tagCount: { [key: string]: number } = {};

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
