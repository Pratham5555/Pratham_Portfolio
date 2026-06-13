interface SectionHeaderProps {
  label: string;
  title: string;
}

export function SectionHeader({ label, title }: SectionHeaderProps) {
  return (
    <div className="mb-12 text-center lg:mb-16">
      <span className="mb-3 inline-block font-mono text-sm tracking-wider text-violet">
        {label}
      </span>
      <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-violet to-rose" />
    </div>
  );
}
