type ServiceCardProps = {
  title: string;
  description: string;
  price: string;
};

function wrapLatinWords(text: string) {
  const parts = text.split(/([a-zA-Z][\w-]*)/g);
  if (parts.length <= 1) return text;
  return parts.map((part, i) =>
    /^[a-zA-Z]/.test(part) ? <span key={i} lang="en">{part}</span> : part
  );
}

export default function ServiceCard({ title, description, price }: ServiceCardProps) {
  return (
    <article className="group min-w-0 overflow-hidden border border-ink/10 bg-bone p-3 transition duration-300 hover:-translate-y-1 hover:border-teal hover:bg-white sm:p-5">
      <p className="font-condensed text-[0.65rem] uppercase tracking-editorial text-teal sm:text-xs">{price}</p>
      <h3 className="mt-3 break-words font-display text-[1.05rem] leading-[0.95] [overflow-wrap:anywhere] sm:mt-4 sm:text-5xl">
        <span className="km-title-text">{wrapLatinWords(title)}</span>
      </h3>
      <p className="mt-3 text-[0.68rem] leading-5 text-ink/70 sm:mt-4 sm:text-sm sm:leading-6">{description}</p>
    </article>
  );
}
