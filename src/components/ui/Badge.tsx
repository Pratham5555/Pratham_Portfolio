import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border border-black/6 bg-white/50 px-3 py-1 font-mono text-xs text-muted transition-colors duration-200 hover:border-violet/30 hover:text-violet dark:border-white/10 dark:bg-white/5",
        className
      )}
    >
      {children}
    </span>
  );
}
