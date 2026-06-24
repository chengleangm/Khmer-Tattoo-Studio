import Image from "next/image";
import Button from "@/components/Button";

type ArtistCardProps = {
  name: string;
  specialty: string;
  years: string;
  image: string;
  viewWorksLabel?: string;
};

export default function ArtistCard({ name, specialty, years, image, viewWorksLabel = "View Works" }: ArtistCardProps) {
  const specialtyHasKhmer = /[ក-៿]/.test(specialty);
  return (
    <article className="group min-w-0 border border-ink/10 bg-bone">
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
        <Image
          src={image}
          alt={`${name}, ${specialty} artist`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
        />
      </div>
      <div className="p-3 sm:p-5">
        <h3 className="font-display text-4xl leading-none sm:text-6xl">{name}</h3>
        <p lang={specialtyHasKhmer ? undefined : "en"} className="mt-1 font-condensed text-[0.68rem] uppercase leading-tight tracking-editorial text-teal sm:text-base">
          {specialty}
        </p>
        <p className="mt-2 text-xs leading-5 text-ink/65 sm:text-sm">{years}</p>
        <Button href="/gallery" variant="outline" className="mt-4 w-full px-2 py-2 text-[0.6rem] sm:mt-5 sm:px-5 sm:py-3 sm:text-sm">
          {viewWorksLabel}
        </Button>
      </div>
    </article>
  );
}
