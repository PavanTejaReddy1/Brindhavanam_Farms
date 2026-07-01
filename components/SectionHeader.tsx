interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={`mb-16 ${centered ? "text-center" : ""}`}>
      <p
        className="text-xs font-semibold tracking-[0.14em] uppercase mb-3"
        style={{ color: light ? "rgba(212,175,55,0.9)" : "#6B8E23" }}
      >
        {eyebrow}
      </p>
      <h2
        className="font-serif text-3xl md:text-4xl font-semibold leading-tight mb-4"
        style={{ color: light ? "#fff" : "#1F4D3A" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base font-light leading-relaxed max-w-xl ${
            centered ? "mx-auto" : ""
          }`}
          style={{ color: light ? "rgba(255,255,255,0.7)" : "#6b6b6b" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}