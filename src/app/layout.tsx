import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Pratham Maheshwari | Full-Stack Developer",
  description:
    "Portfolio of Pratham Maheshwari, CS undergrad at JIIT Noida. Full-stack developer building web apps, real-time systems, and mobile experiences with React, Node.js, and Python.",
  keywords: [
    "Pratham Maheshwari",
    "Full Stack Developer",
    "JIIT Noida",
    "React",
    "Node.js",
    "Portfolio",
  ],
  authors: [{ name: "Pratham Maheshwari" }],
  openGraph: {
    title: "Pratham Maheshwari | Full-Stack Developer",
    description:
      "CS undergrad at JIIT Noida building full-stack web apps, real-time systems, and mobile experiences.",
    url: "https://pratham-portfolio-nine.vercel.app",
    siteName: "Pratham Maheshwari",
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="relative min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
