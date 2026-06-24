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
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("language", lang);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send booking request.");
      }

      form.reset();
      setFileName("");
      setStatus("success");
      setFeedback(lang === "km" ? "បានផ្ញើសំណើរបស់អ្នកទៅ Telegram រួចហើយ។" : "Your request was sent to Telegram.");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Unable to send booking request.");
    }
  }

  return (
    <form className="grid gap-3 sm:gap-4" onSubmit={handleSubmit}>
      <div className="grid max-w-full grid-cols-2 gap-2 sm:gap-4">
        <input className={fieldClass} name="fullName" placeholder={f.fullName} aria-label={f.fullName} required />
        <input className={fieldClass} name="phone" placeholder={f.phone} aria-label={f.phone} required />
      </div>
      <input className={fieldClass} name="email" type="email" placeholder={f.email} aria-label={f.email} required />
      <div className="grid max-w-full grid-cols-2 gap-2 sm:gap-4">
        <select className={fieldClass} name="tattooStyle" aria-label={f.style} defaultValue="" required>
          <option value="" disabled>{f.style}</option>
          {styles.map((style, index) => {
            const label = lang === "km" ? styleLabels[index] ?? style : style;
            return (
            <option key={style} value={label}>
              {label}
            </option>
            );
          })}
        </select>
        <input className={fieldClass} name="placement" placeholder={f.placement} aria-label={f.placement} required />
      </div>
      <input
        className={fieldClass}
        name="preferredDate"
        type="text"
        placeholder={f.date}
        aria-label={f.date}
        required
        onFocus={(e) => {
          e.currentTarget.type = "date";
        }}
        onBlur={(e) => {
          if (!e.currentTarget.value) e.currentTarget.type = "text";
        }}
      />
      <textarea
        className={`${fieldClass} min-h-28 resize-none sm:min-h-40`}
        name="message"
        placeholder={f.message}
        aria-label={f.message}
        required
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
          name="referenceImage"
          className="sr-only"
          aria-label={f.uploadLabel}
          accept="image/*"
          onChange={(e) => setFileName(e.currentTarget.files?.[0]?.name ?? "")}
        />
      </label>
      {feedback && (
        <p className={`text-sm ${status === "error" ? "text-red-700" : "text-ink/70"}`} role="status">
          {feedback}
        </p>
      )}
      <Button type="submit" variant="teal" disabled={status === "sending"} className="w-full px-4 py-3 text-xs sm:text-sm">
        {status === "sending" ? (lang === "km" ? "កំពុងផ្ញើ..." : "Sending...") : f.submit}
      </Button>
    </form>
  );
}
