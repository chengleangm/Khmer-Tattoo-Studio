"use client";

import { Upload } from "lucide-react";
import Button from "@/components/Button";
import { styles } from "@/data/site";

const fieldClass =
  "min-w-0 w-full border border-ink/15 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-ink/45 focus:border-teal sm:px-4 sm:py-4";

export default function BookingForm() {
  return (
    <form
      className="grid gap-3 sm:gap-4"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <div className="grid max-w-full grid-cols-2 gap-2 sm:gap-4">
        <input className={fieldClass} placeholder="Full Name" aria-label="Full Name" />
        <input className={fieldClass} placeholder="Phone" aria-label="Phone Number" />
      </div>
      <input className={fieldClass} type="email" placeholder="Email" aria-label="Email" />
      <div className="grid max-w-full grid-cols-2 gap-2 sm:gap-4">
        <select className={fieldClass} aria-label="Tattoo Style" defaultValue="">
          <option value="" disabled>Tattoo Style</option>
          {styles.map((style) => (
            <option key={style}>{style}</option>
          ))}
        </select>
        <input className={fieldClass} placeholder="Placement" aria-label="Tattoo Placement" />
      </div>
      <input className={fieldClass} type="date" aria-label="Preferred Date" />
      <textarea
        className={`${fieldClass} min-h-28 resize-none sm:min-h-40`}
        placeholder="Message / Idea"
        aria-label="Message or tattoo idea"
      />
      <label className="flex cursor-pointer items-center justify-between gap-3 border border-dashed border-ink/30 bg-white px-3 py-3 transition hover:border-teal sm:px-4 sm:py-5">
        <span className="min-w-0">
          <span className="block font-condensed text-xs uppercase tracking-editorial sm:text-sm">Upload Reference</span>
          <span className="text-xs text-ink/55 sm:text-sm">Optional image</span>
        </span>
        <Upload className="shrink-0" size={18} />
        <input type="file" className="sr-only" aria-label="Upload reference image" />
      </label>
      <Button type="submit" variant="teal" className="w-full px-4 py-3 text-xs sm:text-sm">
        Submit Request
      </Button>
    </form>
  );
}
