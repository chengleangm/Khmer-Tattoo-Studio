import type { LucideIcon } from "lucide-react";

type ServiceCardProps = {
  title: string;
  description: string;
  price: string;
  Icon: LucideIcon;
  index: number;
  featured?: boolean;
};

function wrapLatinWords(text: string) {
  const parts = text.split(/([a-zA-Z][\w-]*)/g);
  if (parts.length <= 1) return text;
  return parts.map((part, i) =>
    /^[a-zA-Z]/.test(part) ? <span key={i} lang="en">{part}</span> : part
  );
}

export default function ServiceCard({ title, description, price, Icon, index, featured = false }: ServiceCardProps) {
  const articleClass = featured
    ? "group flex min-h-64 min-w-0 flex-col overflow-hidden border border-teal bg-ink p-3 text-white shadow-[0_18px_45px_rgba(5,7,6,0.2)] transition duration-300 hover:-translate-y-1 hover:bg-charcoal sm:min-h-80 sm:p-5"
    : "group flex min-h-64 min-w-0 flex-col overflow-hidden border border-ink/10 bg-bone p-3 transition duration-300 hover:-translate-y-1 hover:border-teal hover:bg-white sm:min-h-80 sm:p-5";
  const iconClass = featured
    ? "flex h-10 w-10 shrink-0 items-center justify-center border border-teal bg-teal text-white sm:h-12 sm:w-12"
    : "flex h-10 w-10 shrink-0 items-center justify-center border border-teal bg-white text-teal transition group-hover:bg-teal group-hover:text-white sm:h-12 sm:w-12";
  const numberClass = featured
    ? "font-display text-3xl leading-none text-white sm:text-5xl"
    : "font-display text-3xl leading-none text-ink/10 sm:text-5xl";
  const priceClass = featured
    ? "mt-4 w-fit border border-teal bg-teal px-2 py-1 font-condensed text-[0.65rem] uppercase tracking-editorial text-white sm:mt-5 sm:text-xs"
    : "mt-4 w-fit border border-teal/35 px-2 py-1 font-condensed text-[0.65rem] uppercase tracking-editorial text-teal sm:mt-5 sm:text-xs";
  const descriptionClass = featured
    ? "mt-auto pt-4 text-[0.68rem] leading-5 text-white/70 sm:text-sm sm:leading-6"
    : "mt-auto pt-4 text-[0.68rem] leading-5 text-ink/70 sm:text-sm sm:leading-6";

  return (
    <article className={articleClass}>
      <div className="flex items-start justify-between gap-3">
        <span className={iconClass}>
          <Icon size={22} strokeWidth={1.8} />
        </span>
        <span className={numberClass}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className={priceClass}>{price}</p>
      <h3 className="mt-3 break-words font-display text-[1.35rem] leading-[0.95] [overflow-wrap:anywhere] sm:mt-4 sm:text-5xl">
        <span className="km-title-text">{wrapLatinWords(title)}</span>
      </h3>
      <p className={descriptionClass}>{description}</p>
    </article>
  );
}
