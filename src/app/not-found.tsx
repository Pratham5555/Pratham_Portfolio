import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="mb-4 font-heading text-6xl font-bold">
        <span className="bg-gradient-to-r from-violet to-rose bg-clip-text text-transparent">
          404
        </span>
      </h1>
      <p className="mb-8 text-muted">This page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="glass rounded-full px-6 py-3 font-mono text-sm text-muted transition-colors hover:text-foreground hover:shadow-sm"
      >
        Go Home
      </Link>
    </div>
  );
}
