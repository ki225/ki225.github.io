# Personal Tech Blog

A modern, responsive blog built with React and TypeScript, featuring articles on cloud computing, networking, blockchain, and software development.

## Features

- 📝 Markdown-based blog posts
- 🎨 Clean and responsive UI design
- 📂 Category-based post organization
- 🔍 Post filtering and navigation

## Tech Stack
- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3
- **Linting**: ESLint
- **Content**: Markdown posts

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ki225/ki225.github.io.git
cd ki225.github.io
```

2. Install dependencies:
```bash
cd react-blog
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
react-blog/
├── public/           # Static assets and images
├── src/
│   ├── components/   # Reusable components (Sidebar, Loading)
│   ├── pages/        # Page components (Home, BlogList, BlogDetail)
│   ├── posts/        # Markdown blog posts
│   ├── styles/       # CSS styling files
│   └── utils/        # Utility functions (blogParser)
└── ...
```

## Adding New Posts

1. Create a new `.md` file in `src/posts/`
2. Follow the existing post format with frontmatter
3. Add relevant images to `public/images/` if needed
4. The post will automatically appear in the blog list


## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
