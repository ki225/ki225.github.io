import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import CategoryList from "./pages/CategoryList";
import Projects from "./pages/Projects";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <Link to="/" className="logo">
            kiki::blog
          </Link>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
            <Link to="/blog" onClick={() => setMenuOpen(false)}>
              Blog
            </Link>
            <a
              href="https://ki225.github.io/#/blog?tag=AWS"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              AWS Blog
            </a>
            <Link to="/categories" onClick={() => setMenuOpen(false)}>
              Categories
            </Link>
            <a
              href="https://free-ran-ue.github.io/doc-5g-core-book/en/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              5GC book
            </a>
            <a
              href="https://www.linkedin.com/in/yung-chi-huang/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              About Me
            </a>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/category/:category" element={<CategoryList />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>

        <footer className="footer">
          <p>© 2024 - 2026 Kiki. All Rights Reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
