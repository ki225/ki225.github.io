import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <Link to="/" className="logo">
            kiki.dev
          </Link>
          <nav className="nav">
            <Link to="/blog">Blog</Link>
            <a href="#">Projects</a>
            <a href="https://www.linkedin.com/in/yung-chi-huang/" target="_blank" rel="noopener noreferrer">About Me</a>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>

        <footer className="footer">
          <p>© 2025 Kiki. All Rights Reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
