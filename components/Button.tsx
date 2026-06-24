import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "light" | "dark" | "teal" | "outline";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

const variants = {
  light: "bg-bone text-ink hover:bg-white",
  dark: "bg-ink text-white hover:bg-teal",
  teal: "bg-teal text-white hover:bg-ink",
  outline: "border border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
};

export default function Button({
  href,
  children,
  variant = "dark",
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 border border-current px-5 py-3 font-condensed text-sm uppercase tracking-editorial transition duration-300 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        <ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled}>
      {children}
      <ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
    </button>
  );
}
