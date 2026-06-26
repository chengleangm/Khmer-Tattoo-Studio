"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cambodiaPhonePattern, cambodiaPhoneTitle, sanitizeCambodiaPhoneInput } from "@/data/phone";
import { t } from "@/data/translations";
import { Mail, MessageSquareText, Phone, User } from "lucide-react";

const fieldClass =
  "w-full border border-ink/15 bg-white py-3 pl-11 pr-3 text-sm outline-none transition placeholder:text-ink/45 focus:border-teal sm:py-4 sm:pl-12 sm:pr-4";

const iconClass = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-teal";
const textareaIconClass = "pointer-events-none absolute left-4 top-4 text-teal sm:top-5";

export default function ContactForm() {
  const { lang } = useLanguage();
  const f = t[lang].contact.form;
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
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send contact message.");
      }

      form.reset();
      setStatus("success");
      setFeedback(lang === "km" ? "បានផ្ញើសាររបស់អ្នកទៅ Telegram រួចហើយ។" : "Your message was sent to Telegram.");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Unable to send contact message.");
    }
  }

  return (
    <form className="grid gap-3 bg-bone p-4 sm:gap-4 sm:p-5 md:p-8" onSubmit={handleSubmit}>
      <label className="relative block">
        <User className={iconClass} size={18} />
        <input className={fieldClass} name="name" placeholder={f.name} aria-label={f.name} required />
      </label>
      <label className="relative block">
        <Phone className={iconClass} size={18} />
        <input
          className={fieldClass}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          pattern={cambodiaPhonePattern}
          title={cambodiaPhoneTitle}
          onInput={(event) => {
            event.currentTarget.value = sanitizeCambodiaPhoneInput(event.currentTarget.value);
          }}
          placeholder={f.phone}
          aria-label={f.phone}
          required
        />
      </label>
      <label className="relative block">
        <Mail className={iconClass} size={18} />
        <input className={fieldClass} name="email" type="email" placeholder={f.email} aria-label={f.email} required suppressHydrationWarning />
      </label>
      <label className="relative block">
        <MessageSquareText className={textareaIconClass} size={18} />
        <textarea className={`${fieldClass} min-h-28 resize-none sm:min-h-40`} name="message" placeholder={f.message} aria-label={f.message} required />
      </label>
      {feedback && (
        <p className={`text-sm ${status === "error" ? "text-red-700" : "text-ink/70"}`} role="status">
          {feedback}
        </p>
      )}
      <Button type="submit" variant="teal" disabled={status === "sending"} className="px-4 py-3 text-xs sm:text-sm">
        {status === "sending" ? (lang === "km" ? "កំពុងផ្ញើ..." : "Sending...") : f.send}
      </Button>
    </form>
  );
}
