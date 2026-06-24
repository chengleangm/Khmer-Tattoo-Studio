"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import Button from "@/components/Button";
import { styles } from "@/data/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

const fieldClass =
  "min-w-0 w-full border border-ink/15 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-ink/45 focus:border-teal sm:px-4 sm:py-4";

export default function BookingForm() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const f = tx.booking.form;
  const styleLabels = tx.showcase.styleNames;
  const [fileName, setFileName] = useState("");

  return (
    <form className="grid gap-3 sm:gap-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid max-w-full grid-cols-2 gap-2 sm:gap-4">
        <input className={fieldClass} placeholder={f.fullName} aria-label={f.fullName} />
        <input className={fieldClass} placeholder={f.phone} aria-label={f.phone} />
      </div>
      <input className={fieldClass} type="email" placeholder={f.email} aria-label={f.email} />
      <div className="grid max-w-full grid-cols-2 gap-2 sm:gap-4">
        <select className={fieldClass} aria-label={f.style} defaultValue="">
          <option value="" disabled>{f.style}</option>
          {styles.map((style, index) => (
            <option key={style} value={style}>
              {lang === "km" ? styleLabels[index] ?? style : style}
            </option>
          ))}
        </select>
        <input className={fieldClass} placeholder={f.placement} aria-label={f.placement} />
      </div>
      <input
        className={fieldClass}
        type="text"
        placeholder={f.date}
        aria-label={f.date}
        onFocus={(e) => {
          e.currentTarget.type = "date";
        }}
        onBlur={(e) => {
          if (!e.currentTarget.value) e.currentTarget.type = "text";
        }}
      />
      <textarea
        className={`${fieldClass} min-h-28 resize-none sm:min-h-40`}
        placeholder={f.message}
        aria-label={f.message}
      />
      <label className="flex cursor-pointer items-center justify-between gap-3 border border-dashed border-ink/30 bg-white px-3 py-3 transition hover:border-teal sm:px-4 sm:py-5">
        <span className="min-w-0">
          <span className="block font-condensed text-xs uppercase tracking-editorial sm:text-sm">{f.uploadLabel}</span>
          <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/55 sm:text-sm">
            <span className="font-condensed uppercase tracking-editorial text-ink">{f.chooseImage}</span>
            <span>{fileName || f.noFileSelected}</span>
          </span>
        </span>
        <Upload className="shrink-0" size={18} />
        <input
          type="file"
          className="sr-only"
          aria-label={f.uploadLabel}
          onChange={(e) => setFileName(e.currentTarget.files?.[0]?.name ?? "")}
        />
      </label>
      <Button type="submit" variant="teal" className="w-full px-4 py-3 text-xs sm:text-sm">
        {f.submit}
      </Button>
    </form>
  );
}
