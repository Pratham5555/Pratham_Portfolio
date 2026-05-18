export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "leetcode" | "mail";
}

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/Pratham5555",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/prathammaheshwari",
    icon: "linkedin",
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/u/PrathamMaheshwari5",
    icon: "leetcode",
  },
  {
    label: "Email",
    href: "mailto:pratham.maheshwari5@gmail.com",
    icon: "mail",
  },
];
