"use client";

import Button from "@/components/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

const fieldClass =
  "w-full border border-ink/15 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-ink/45 focus:border-teal sm:px-4 sm:py-4";

export default function ContactForm() {
  const { lang } = useLanguage();
  const f = t[lang].contact.form;

  return (
    <form className="grid gap-3 bg-bone p-4 sm:gap-4 sm:p-5 md:p-8" onSubmit={(e) => e.preventDefault()}>
      <input className={fieldClass} placeholder={f.name} aria-label={f.name} />
      <input className={fieldClass} type="email" placeholder={f.email} aria-label={f.email} />
      <textarea className={`${fieldClass} min-h-28 resize-none sm:min-h-40`} placeholder={f.message} aria-label={f.message} />
      <Button type="submit" variant="teal" className="px-4 py-3 text-xs sm:text-sm">{f.send}</Button>
    </form>
  );
}
