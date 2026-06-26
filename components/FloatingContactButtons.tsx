import { PhoneCall } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { contactDetails } from "@/data/site";

export default function FloatingContactButtons() {
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2 sm:bottom-5 sm:right-5">
      <a
        href={`tel:+855${contactDetails.phonePrimary.slice(1)}`}
        aria-label={`Call ${contactDetails.phonePrimaryDisplay}`}
        title="Call"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-teal text-white shadow-[0_12px_28px_rgba(0,0,0,0.28)] transition hover:scale-105 hover:bg-ink sm:h-14 sm:w-14"
      >
        <PhoneCall className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
      </a>
      <a
        href={contactDetails.whatsappHref}
        aria-label={`WhatsApp ${contactDetails.phonePrimaryDisplay}`}
        target="_blank"
        rel="noopener noreferrer"
        title="WhatsApp"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-[#25D366] text-white shadow-[0_12px_28px_rgba(0,0,0,0.28)] transition hover:scale-105 hover:bg-ink sm:h-14 sm:w-14"
      >
        <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
      </a>
    </div>
  );
}
