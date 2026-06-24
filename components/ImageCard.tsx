import Image from "next/image";

type ImageCardProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export default function ImageCard({ src, alt, className = "", priority = false }: ImageCardProps) {
  return (
    <div className={`group relative overflow-hidden bg-charcoal ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 90vw, 42vw"
        className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-teal/0 mix-blend-multiply transition duration-500 group-hover:bg-teal/25" />
    </div>
  );
}
