export interface Project {
  slug: string;
  title: string;
  date: string;
  backstory: string;
  description: string;
  stack: string[];
  github: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "wasifyai",
    title: "WasifyAi",
    date: "Apr 2026",
    backstory:
      "In my hostel, there are colour-coded waste bins that nobody uses correctly. One day I watched someone toss a battery into the wet waste bin and thought — what if your phone camera could just tell you where something goes? Started as a weekend hack, ended up building a full mobile app.",
    description:
      "A React Native app that runs a YOLOv8n model on-device (exported to TensorFlow Lite) to classify waste into 12 categories via camera input. Python/FastAPI backend deployed on Railway with GitHub Actions CI/CD. Includes offline-first data sync and a gamification system with eco-points and a community leaderboard.",
    stack: [
      "React Native",
      "TypeScript",
      "YOLOv8n",
      "TensorFlow Lite",
      "FastAPI",
      "Python",
      "Railway",
      "GitHub Actions",
    ],
    github: "https://github.com/Pratham5555/WasifyAi",
  },
  {
    slug: "cowritter",
    title: "coWritter",
    date: "Jan 2026",
    backstory:
      "Group assignments at college meant three people editing the same Google Doc with changes taking forever to sync. I got curious about how real-time collaboration actually works under the hood — WebSockets, conflict resolution, presence indicators. So I built my own version from scratch.",
    description:
      "Real-time collaborative editor where multiple users edit documents concurrently with conflict-free sync through Socket.IO. Integrated Quill rich-text editor with a live presence system and JWT-based auth with email verification and session persistence.",
    stack: ["React", "Node.js", "Socket.IO", "MongoDB", "Quill", "JWT"],
    github: "https://github.com/Pratham5555/coWritter",
  },
  {
    slug: "jobscraper",
    title: "JobScraper",
    date: "May 2026",
    backstory:
      "Applying for internships meant checking LinkedIn, Internshala, and five other portals every single morning. Got tired of the routine, so I wrote a Python pipeline that does it for me overnight and emails me a daily shortlist.",
    description:
      "Automated job tracking pipeline that scrapes multiple portals, applies custom filtering and deduplication, scores matches against preferences, and sends daily notification digests. Orchestrated with modular workflows and Windows task scheduling.",
    stack: [
      "Python",
      "Selenium",
      "GitHub Actions",
      "Automation",
    ],
    github: "https://github.com/Pratham5555/JobScraper",
  },
  {
    slug: "flavoursome",
    title: "FlavourSome",
    date: "Jan 2025",
    backstory:
      "My mom has recipes scattered across WhatsApp forwards, torn notebook pages, and memory. I wanted a proper place to store them, and figured other people might want the same thing.",
    description:
      "Full-stack recipe-sharing platform with user auth, recipe CRUD, and keyword search. Reduced page load times by 30% through compound MongoDB indexes and query projection. RESTful APIs with Joi validation and centralized error handling.",
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Tailwind CSS"],
    github: "https://github.com/Pratham5555/FlavourSome",
  },
  {
    slug: "snapfeed-api",
    title: "Snapfeed API",
    date: "Jul 2024",
    backstory:
      "Before I built full apps, I wanted to really understand how social platforms work at the API level — auth flows, file uploads, nested comments, the whole thing. Snapfeed was my deep dive into building a proper REST API from scratch.",
    description:
      "Social media REST API supporting user auth, profile management, text/image posts, likes, comments with nested replies, and email verification via Nodemailer with Gmail OAuth.",
    stack: ["Node.js", "Express", "MongoDB", "JWT", "Nodemailer", "REST API"],
    github: "https://github.com/Pratham5555/Snapfeed-API",
  },
];
