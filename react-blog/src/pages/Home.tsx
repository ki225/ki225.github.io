import { useState, useEffect, useMemo } from "react";
import "../styles/Home.css";

function Home() {
  const titles = useMemo(
    () => [
      "Kiki",
      "Senior CS Student",
      "IT Sprouter",
      "AWS Educate AMB",
      "Ex-ECV Intern",
      "a Cafe Hopper",
    ],
    [],
  );
  const [displayText, setDisplayText] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = titles[titleIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < currentTitle.length) {
            setDisplayText(currentTitle.substring(0, charIndex + 1));
            setCharIndex(charIndex + 1);
          } else {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          if (charIndex > 0) {
            setDisplayText(currentTitle.substring(0, charIndex - 1));
            setCharIndex(charIndex - 1);
          } else {
            setIsDeleting(false);
            setTitleIndex((titleIndex + 1) % titles.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, titleIndex, titles]);

  return (
    <main className="home-content">
      <div className="content-wrapper">
        <div className="left-section">
          <div className="mobile-image">
            <img src="/images/self/chiikawa.jpg" alt="Profile Picture" />
          </div>

          <div className="title-section">
            <h1 className="main-title">
              <span className="hi-text">Hi! I'm</span>{" "}
              <span className="dynamic-title">{displayText}</span>
            </h1>
          </div>

          <div className="introduction">
            <p>
              Welcome to my note site!
              <br />
              I’m engaged in{" "}
              <span className="highlight">AWS</span> and{" "}
              <span className="highlight">next-generation networking</span>.
              <br />
              This blog site is where I document my explorations, experiments, and system-level
              thinking—turning what I build and learn into shared notes along the way.
            </p>
          </div>

          <div className="social-icons">
            <a
              href="https://www.linkedin.com/in/yung-chi-huang/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://ki225.github.io/images/linkedin.svg"
                alt="LinkedIn"
              />
            </a>
            <a
              href="https://www.instagram.com/photokii_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://ki225.github.io/images/instagram.svg"
                alt="Instagram"
              />
            </a>
            <a
              href="https://github.com/ki225"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://ki225.github.io/images/github.svg"
                alt="GitHub"
              />
            </a>
            <a
              href="https://youtu.be/Dq_z8meAShM?si=V-PEjM61sWfRuYbm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://ki225.github.io/images/youtube.svg"
                alt="YouTube"
              />
            </a>
            <a
              href="https://medium.com/@271yeye"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://ki225.github.io/images/medium.svg"
                alt="Medium"
              />
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=yungchi.huang0225@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="https://ki225.github.io/images/gmail.png" alt="Gmail" />
            </a>
          </div>
        </div>

        <div className="right-section">
          <div className="profile-image">
            <img src="/images/self/chiikawa.jpg" alt="Profile Picture" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
