import { useState, useEffect, useMemo } from "react";
import "../styles/Home.css";

function Home() {
  const titles = useMemo(
    () => [
      "Kiki",
      "an Active Learner",
      "Team Player",
      "a DAY ONE person",
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

  const downloadResume = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    try {
      const pdfUrl =
        "https://raw.githubusercontent.com/ki225/ki225.github.io/main/source/files/resume.pdf";
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "Yung-Chi_Huang_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("下載失敗:", error);
      window.open(
        "https://raw.githubusercontent.com/ki225/ki225.github.io/main/source/files/resume.pdf",
        "_blank",
      );
    }
  };

  return (
    <main className="home-content">
      <div className="content-wrapper">
        <div className="left-section">
          <div className="title-section">
            <h1 className="main-title">
              <span className="hi-text">Hi! I'm</span>{" "}
              <span className="dynamic-title">{displayText}</span>
            </h1>
          </div>

          <div className="mobile-image">
            <img
              src="https://ki225.github.io/images/self/image.png"
              alt="Profile Picture"
            />
          </div>

          <div className="introduction">
            <p>
              Welcome to my tech note site!
              <br />I focus on <span className="highlight">cloud</span>,{" "}
              <span className="highlight">networking</span>, and{" "}
              <span className="highlight">development</span>, and I enjoy
              exploring the intersection of AI, security, and infrastructure.
              <br />
              This is where I document what I learn, what I break (and fix), and
              what excites me in tech.
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

          <div className="resume-download">
            <a href="#" className="download-button" onClick={downloadResume}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Resume (PDF)
            </a>
          </div>
        </div>

        <div className="right-section">
          <div className="profile-image">
            <img
              src="https://ki225.github.io/images/self/image.png"
              alt="Profile Picture"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
