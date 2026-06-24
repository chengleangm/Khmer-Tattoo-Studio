import BookingForm from "@/components/BookingForm";
import SectionTitle from "@/components/SectionTitle";

export default function BookingPage() {
  return (
    <main>
      <section className="grain bg-ink px-5 py-14 text-white sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title="BOOK AN APPOINTMENT" light />
        </div>
      </section>

      <section className="editorial-section overflow-x-hidden px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-28" data-bg-word="BOOK">
        <div className="mx-auto grid w-full max-w-7xl gap-4 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
          <div className="w-full max-w-full overflow-hidden bg-bone p-3 sm:p-5 md:p-8">
            <BookingForm />
          </div>
          <aside className="w-full max-w-full overflow-hidden bg-ink p-4 text-white sm:p-6 md:p-8">
            <p className="font-condensed text-xs uppercase tracking-editorial text-teal sm:text-sm">Studio Info</p>
            <h2 className="mt-3 max-w-sm font-display text-[clamp(3rem,14vw,4.75rem)] leading-[0.85] lg:text-7xl">
              Private Studio Hours
            </h2>
            <div className="mt-5 grid gap-3 text-xs leading-5 text-white/70 sm:mt-8 sm:gap-5 sm:text-sm sm:leading-6">
              <p><strong className="font-condensed uppercase tracking-editorial text-white">Mon - Fri:</strong> 11:00 AM - 8:00 PM</p>
              <p><strong className="font-condensed uppercase tracking-editorial text-white">Saturday:</strong> 12:00 PM - 7:00 PM</p>
              <p><strong className="font-condensed uppercase tracking-editorial text-white">Sunday:</strong> Consultation only</p>
              <p><strong className="font-condensed uppercase tracking-editorial text-white">Phone:</strong> +855 12 345 678</p>
              <p><strong className="font-condensed uppercase tracking-editorial text-white">Email:</strong> hello@khmertattoostudio.com</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
