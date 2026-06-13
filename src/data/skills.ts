export interface SkillGroup {
  title: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    skills: ["JavaScript", "TypeScript", "Python", "C++", "C", "HTML5", "CSS3"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express.js", "FastAPI", "REST APIs", "JWT", "Mongoose"],
  },
  {
    title: "Frontend",
    skills: [
      "React",
      "React Native",
      "Tailwind CSS",
      "Vite",
      "Socket.IO",
      "Quill",
    ],
  },
  {
    title: "Databases",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "Supabase"],
  },
  {
    title: "AI / ML",
    skills: ["YOLOv8n", "TensorFlow Lite", "Prompt Engineering"],
  },
  {
    title: "DevOps & Tools",
    skills: [
      "Git",
      "GitHub Actions",
      "Docker",
      "Selenium",
      "Jest",
      "Postman",
      "Linux",
    ],
  },
];
