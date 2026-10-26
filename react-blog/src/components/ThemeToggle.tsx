import { useEffect, useLayoutEffect, useState } from "react";

type Theme = "light" | "dark";
const storageKey = "kiki-theme";

function readPreference(): Theme | null {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

export default function ThemeToggle() {
  const [preference, setPreference] = useState<Theme | null>(readPreference);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const theme = preference ?? (systemDark ? "dark" : "light");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) =>
      setSystemDark(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setPreference(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // The switch still works when browser storage is unavailable.
    }
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      role="switch"
      aria-label="Dark mode"
      aria-checked={theme === "dark"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
    >
      <span className="theme-toggle-thumb">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {theme === "dark" ? (
            <path d="M20.9 13.2A9 9 0 0 1 10.8 3.1 9 9 0 1 0 20.9 13.2Z" />
          ) : (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </>
          )}
        </svg>
      </span>
    </button>
  );
}
