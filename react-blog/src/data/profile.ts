export interface ProfileEntry {
  period: string;
  organization: string;
  title: string;
  detail?: string;
  logo: string;
}

export const profile = {
  name: "Kiki Huang",
  tagline: "Software, cloud & next-generation networks.",
  introduction:
    "I'm a computer science graduate student exploring cloud infrastructure and next-generation networks. This is a little space for my work, research, and the things I learn along the way.",
  email: "yungchi.huang0225@gmail.com",
  github: "https://github.com/ki225",
  linkedin: "https://www.linkedin.com/in/yung-chi-huang/",
};

export const experience: ProfileEntry[] = [
  {
    period: "Oct 2026 — Present",
    organization: "Saviah Technologies, Inc.",
    title: "Software Engineer Intern",
    detail: "Internship",
    logo: "/images/organizations/saviah.png",
  },
  {
    period: "Jul — Aug 2026",
    organization: "TrendAI",
    title: "Software Engineer Intern",
    detail: "Internship",
    logo: "/images/organizations/trendai.png",
  },
  {
    period: "Jun 2025 — Jun 2026",
    organization: "25sprout",
    title: "DevOps Engineer Intern",
    detail: "Internship",
    logo: "/images/organizations/25sprout.png",
  },
  {
    period: "Sep — Oct 2025",
    organization: "Cake",
    title: "Cloud Technical Advisor",
    detail: "AI Tech Career: 30-Day Certification Challenge feat. AWS",
    logo: "/images/organizations/cake.png",
  },
  {
    period: "Jul — Oct 2024",
    organization: "eCloudvalley",
    title: "Cloud Security Intern",
    detail: "Internship",
    logo: "/images/organizations/ecloudvalley.png",
  },
  {
    period: "Sep 2023 — Jun 2025",
    organization: "National Central University",
    title: "Teaching Assistant",
    detail: "Informatics and Social Service II",
    logo: "/images/organizations/ncu.png",
  },
];

export const education: ProfileEntry[] = [
  {
    period: "Graduate",
    organization: "National Yang Ming Chiao Tung University",
    title: "Master's Studies in Computer Science and Engineering",
    detail: "WIRE Lab · Sep 2026 — Present",
    logo: "/images/organizations/nycu.png",
  },
  {
    period: "Undergraduate",
    organization: "National Central University",
    title: "Computer Science and Information Engineering",
    detail: "Mobile Broadband Network Lab · Sep 2024 — Jun 2026",
    logo: "/images/organizations/ncu.png",
  },
];

export const community: ProfileEntry[] = [
  {
    period: "Dec 2024 — Apr 2026",
    organization: "Amazon Web Services (AWS)",
    title: "AWS Educate Taiwan Cloud Ambassador",
    logo: "/images/organizations/aws.png",
  },
];

export const projects = [
  {
    name: "TPET",
    context: "AWS Educate Taiwan",
    description: "A serverless email delivery platform for AWS Educate Taiwan.",
    links: [
      {
        label: "Frontend",
        href: "https://github.com/aws-educate-tw/email-sender-nextjs",
      },
      {
        label: "Backend",
        href: "https://github.com/aws-educate-tw/aws-educate-tpet-backend",
      },
    ],
  },
  {
    name: "free5GC",
    context: "Contributor",
    description: "Contributing to an open-source 5G core network.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/free5gc/free5gc",
      },
      {
        label: "Contributions",
        href: "https://github.com/pulls?q=is%3Apr+author%3Aki225+org%3Afree5gc",
      },
    ],
  },
];

export const skillStack = [
  {
    category: "Software Engineering",
    skills: ["Python", "C++", "TypeScript", "Node.js", "React", "Postman"],
  },
  {
    category: "Cloud & DevOps",
    skills: [
      "AWS",
      "Google Cloud",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Jenkins",
      "Linux",
    ],
  },
  {
    category: "Networking & Distributed Systems",
    skills: ["free5GC", "Hyperledger Fabric", "IPFS"],
  },
  {
    category: "AI & Data",
    skills: ["LangGraph", "LangChain", "OpenSearch", "Federated Learning"],
  },
];

export const research = {
  authors:
    "Yung-Chi Huang, Pei-Yi Tsao, Szu-Hua Huang, Yi-An Lien, and Li-Der Chou",
  title:
    "ZBFed: Building a Blockchain-based Federated Learning Platform under Zero Trust Architecture",
  venues: "Journal of Internet Technology · TANET 2025",
};

export const certifications = [
  {
    title: "AWS Certified Solutions Architect – Associate",
    description:
      "Designing scalable, highly available, and cost-efficient AWS architectures",
  },
  {
    title: "AWS Certified AI Practitioner",
    description: "Core concepts of AI and ML on AWS",
  },
  {
    title: "AWS Certified Cloud Practitioner",
    description:
      "Foundational understanding of AWS services and cloud concepts",
  },
];

export const awards = [
  {
    recognition: "1st Place",
    title: "Sea × OpenAI Regional Codex Hackathon Taiwan",
    description: "TurnDeal",
    href: "https://ec.ltn.com.tw/article/breakingnews/5572426",
    repoHref: "https://github.com/muen1019/TurnDeal",
    members: [
      { name: "Mu-En Chiu", href: "https://www.linkedin.com/in/muen1019/" },
      {
        name: "Ling-Cheng Tseng",
        href: "https://www.linkedin.com/in/ling-cheng-tseng-489a00306/",
      },
      {
        name: "Yung-Chi Huang",
        href: "https://www.linkedin.com/in/yung-chi-huang/",
      },
      {
        name: "Jonathan Peng",
        href: "https://www.linkedin.com/in/jonathan-peng-292ba517a/",
      },
    ],
  },
  {
    recognition: "Top 3",
    title: "2026 AIWave: Taiwan Generative AI Applications Hackathon",
    members: [
      { name: "Ju-Shen Huang", href: "https://www.linkedin.com/in/ogmatcha/" },
      {
        name: "趙啟翔",
        href: "https://www.linkedin.com/in/%E5%95%9F%E7%BF%94-%E8%B6%99-457378198/",
      },
      { name: "何雅智", href: "https://www.linkedin.com/in/lindahoduck/" },
      {
        name: "Yung-Chi Huang",
        href: "https://www.linkedin.com/in/yung-chi-huang/",
      },
      {
        name: "古謙紘",
        href: "https://www.linkedin.com/in/%E8%AC%99%E7%B4%98-%E5%8F%A4-96717a408/",
      },
    ],
  },
  {
    recognition: "Best Paper",
    title: "TANET 2025",
  },
  {
    recognition: "3rd Place · 2024",
    title: "GiCS Creative Ideas Competition — University Division",
    description:
      "Topic: Preventing BLUFFS Attacks & Raising Public Cybersecurity Awareness",
    details: [
      "Advisors: Prof. 周立德 and Prof. 許富皓",
      "Team: 王若琳、邱郁安、黃詠綺、鍾羽綾、曹佩怡",
    ],
  },
  {
    recognition: "114-1",
    title: "Scholarship for Outstanding Students",
    description: "National Central University",
    href: "https://www.linkedin.com/in/yung-chi-huang/overlay/Education/823025473/treasury/?profileId=ACoAAD2zx_sBRxPCyHT5koXT81W5p1d1jcdNdLI",
  },
  {
    recognition: "Top Excellence",
    title:
      "2025 National Central University Public Service Scholarship (6th Edition)",
  },
  {
    recognition: "Finalist",
    title: "8th Social Innovation and Entrepreneurship Competition",
  },
];
