"use client";

import Button from "@/components/Button";

const fieldClass =
  "w-full border border-ink/15 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-ink/45 focus:border-teal sm:px-4 sm:py-4";

export default function ContactForm() {
  return (
    <form
      className="grid gap-3 bg-bone p-4 sm:gap-4 sm:p-5 md:p-8"
      onSubmit={(event) => event.preventDefault()}
    >
      <input className={fieldClass} placeholder="Name" aria-label="Name" />
      <input className={fieldClass} type="email" placeholder="Email" aria-label="Email" />
      <textarea className={`${fieldClass} min-h-28 resize-none sm:min-h-40`} placeholder="Message" aria-label="Message" />
      <Button type="submit" variant="teal" className="px-4 py-3 text-xs sm:text-sm">Send Message</Button>
    </form>
  );
}
