import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProfileLayout from "./components/ProfileLayout";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import CategoryList from "./pages/CategoryList";
import Page404 from "./pages/Page404";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProfileLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/category/:category" element={<CategoryList />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
