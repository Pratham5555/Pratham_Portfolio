import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border border-border px-3 py-1 font-mono text-xs text-muted transition-colors duration-200 hover:border-violet/40 hover:text-violet-light",
        className
      )}
    >
      {children}
    </span>
  );
}
