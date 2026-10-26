import type { ReactNode } from "react";

export type IconName =
  | "mail"
  | "github"
  | "linkedin"
  | "work"
  | "education"
  | "community"
  | "skills"
  | "research"
  | "certificate"
  | "award"
  | "arrow";

export default function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    github: (
      <>
        <path
          d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.7-1.6 6.7-7.3a5.7 5.7 0 0 0-1.5-4 5.3 5.3 0 0 0-.1-4s-1.2-.4-4.1 1.5a14 14 0 0 0-7 0C5.1-.4 3.9 0 3.9 0a5.3 5.3 0 0 0-.1 4 5.7 5.7 0 0 0-1.5 4c0 5.7 3.4 6.9 6.7 7.3A3.5 3.5 0 0 0 8 18v4"
          transform="translate(1 1) scale(.9)"
        />
      </>
    ),
    linkedin: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7 10v7m0-10v.1M11 17v-7m0 3a3 3 0 0 1 6 0v4" />
      </>
    ),
    work: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="3" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a21 21 0 0 0 18 0M12 11v4" />
      </>
    ),
    education: (
      <path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6m4-2v8" />
    ),
    community: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m3 10v-3a6 6 0 0 0-2-4" />
      </>
    ),
    skills: <path d="m8 8-4 4 4 4m8-8 4 4-4 4M14 5l-4 14" />,
    research: (
      <>
        <path d="M9 3h6m-5 0v7L4 20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1l-6-10V3M7 15h10" />
        <path d="M10 18h.01M14 17h.01" />
      </>
    ),
    certificate: (
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="m8 14-1 8 5-3 5 3-1-8m-7-5 2 2 4-4" />
      </>
    ),
    award: (
      <>
        <path d="M8 3h8v5a4 4 0 0 1-8 0V3Zm0 2H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 1v6m-4 3h8m-6-3h4v3h-4z" />
      </>
    ),
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
