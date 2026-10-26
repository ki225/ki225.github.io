import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Icon from "./ProfileIcon";
import ThemeToggle from "./ThemeToggle";
import { profile } from "../data/profile";
import "../styles/Home.css";
import "../styles/Writing.css";
import "../styles/Theme.css";

export default function ProfileLayout() {
  const { pathname, search } = useLocation();
  const isAbout = pathname === "/";
  useEffect(() => {
    document.title =
      profile.name + (isAbout ? " — Software, Cloud & Networks" : " — Writing");
    window.scrollTo(0, 0);
  }, [pathname, search, isAbout]);
  return (
    <div className={"profile-page" + (isAbout ? "" : " profile-writing")}>
      <div className="profile-shell">
        <header className="profile-header">
          <Link
            to="/"
            className="profile-wordmark"
            aria-label="Kiki Huang home"
          >
            kiki<span>.</span>
          </Link>
          <div className="profile-header-actions">
            <a
              className="profile-book-link"
              href="https://free-ran-ue.github.io/doc-5g-core-book/en/"
              target="_blank"
              rel="noopener noreferrer"
            >
              5GC book <Icon name="arrow" />
            </a>
            <ThemeToggle />
          </div>
        </header>
        <div className="profile-intro">
          <img
            className="profile-avatar"
            src="/images/self/chiikawa.jpg"
            alt="Kiki's avatar"
            width="96"
            height="96"
          />
          <div>
            <h1>{profile.name}</h1>
            <p className="profile-tagline">{profile.tagline}</p>
            <div
              className="profile-socials"
              aria-label="Contact and social links"
            >
              <a href={"mailto:" + profile.email}>
                <Icon name="mail" />
                Email
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="linkedin" />
                LinkedIn
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="github" />
                GitHub
              </a>
            </div>
          </div>
        </div>
        <nav className="profile-tabs" aria-label="Main navigation">
          <Link to="/" aria-current={isAbout ? "page" : undefined}>
            About
          </Link>
          <Link to="/blog" aria-current={!isAbout ? "page" : undefined}>
            Writing
          </Link>
        </nav>
        <div className="profile-route-content">
          <Outlet />
        </div>
        <footer className="profile-footer">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <Link to="/blog">
            Notes from the learning journey <span aria-hidden="true">↗</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}
