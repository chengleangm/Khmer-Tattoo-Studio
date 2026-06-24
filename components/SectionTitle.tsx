type SectionTitleProps = {
  kicker?: string;
  title: string;
  align?: "left" | "center";
  light?: boolean;
};

export default function SectionTitle({
  kicker = "Stories on Skin",
  title,
  align = "center",
  light = false,
}: SectionTitleProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-[22rem] text-center lg:max-w-4xl" : "max-w-[22rem] lg:max-w-4xl"}>
      <p className={`font-condensed text-xs uppercase tracking-[0.35em] ${light ? "text-teal" : "text-charcoal/70"}`}>
        {kicker}
      </p>
      <h2 className={`mt-3 max-w-full break-words font-display text-[clamp(2.3rem,8vw,5.5rem)] leading-[0.82] [overflow-wrap:anywhere] lg:text-[clamp(3rem,10vw,9rem)] ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
    </div>
  );
}
