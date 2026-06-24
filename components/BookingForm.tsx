"use client";

import { Calendar, Upload } from "lucide-react";
import { useState } from "react";
import Button from "@/components/Button";
import { styles } from "@/data/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/translations";

const fieldClass =
  "min-w-0 w-full border border-ink/15 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-ink/45 focus:border-teal sm:px-4 sm:py-4";
const months = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
const days = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0"));
const years = ["2026", "2027", "2028", "2029", "2030"];

export default function BookingForm() {
  const { lang } = useLanguage();
  const tx = t[lang];
  const f = tx.booking.form;
  const styleLabels = tx.showcase.styleNames;
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [dateParts, setDateParts] = useState({ month: "", day: "", year: "" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("language", lang);

    const selectedDate = new Date(
      Number(dateParts.year),
      Number(dateParts.month) - 1,
      Number(dateParts.day),
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const validDate =
      selectedDate.getFullYear() === Number(dateParts.year) &&
      selectedDate.getMonth() === Number(dateParts.month) - 1 &&
      selectedDate.getDate() === Number(dateParts.day) &&
      selectedDate >= today;

    if (!validDate) {
      setStatus("error");
      setFeedback(lang === "km" ? "សូមជ្រើសរើសថ្ងៃកក់ដែលត្រឹមត្រូវ។" : "Please choose a valid booking date.");
      return;
    }

    formData.set("preferredDate", `${dateParts.year}-${dateParts.month}-${dateParts.day}`);

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
      setDateParts({ month: "", day: "", year: "" });
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
      <input className={fieldClass} name="email" type="email" placeholder={f.email} aria-label={f.email} required suppressHydrationWarning />
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
      <label className="block border border-ink/15 bg-white px-3 py-2 transition focus-within:border-teal sm:px-4 sm:py-3">
        <span className="mb-1 block font-condensed text-[0.65rem] uppercase tracking-editorial text-ink/55 sm:text-xs">
          {f.date}
        </span>
        <span className="grid grid-cols-[auto_1fr_1fr_1fr] items-center gap-2">
          <Calendar className="shrink-0 text-ink/45" size={17} />
          <select
            className="min-w-0 bg-transparent text-sm outline-none"
            aria-label={f.month}
            value={dateParts.month}
            onChange={(e) => setDateParts((date) => ({ ...date, month: e.target.value }))}
            required
          >
            <option value="" disabled>{f.month}</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select
            className="min-w-0 bg-transparent text-sm outline-none"
            aria-label={f.day}
            value={dateParts.day}
            onChange={(e) => setDateParts((date) => ({ ...date, day: e.target.value }))}
            required
          >
            <option value="" disabled>{f.day}</option>
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <select
            className="min-w-0 bg-transparent text-sm outline-none"
            aria-label={f.year}
            value={dateParts.year}
            onChange={(e) => setDateParts((date) => ({ ...date, year: e.target.value }))}
            required
          >
            <option value="" disabled>{f.year}</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </span>
      </label>
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
