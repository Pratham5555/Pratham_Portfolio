export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-mono text-sm text-muted-dark">
          Designed & built by{" "}
          <span className="bg-gradient-to-r from-violet to-rose bg-clip-text text-transparent">
            Pratham Maheshwari
          </span>
        </p>
        <p className="mt-2 font-mono text-xs text-muted-dark">
          © {year} Pratham Maheshwari. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
