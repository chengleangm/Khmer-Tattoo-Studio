import GalleryGrid from "@/components/GalleryGrid";
import SectionTitle from "@/components/SectionTitle";

export default function GalleryPage() {
  return (
    <main>
      <section className="grain bg-ink px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title="OUR GALLERY" light />
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-white/60">
            A rotating portfolio preview with clear local image filenames under <span className="font-mono">public/images</span>.
          </p>
        </div>
      </section>

      <section className="editorial-section px-5 py-20 lg:px-8 lg:py-28" data-bg-word="INK">
        <div className="mx-auto max-w-7xl">
          <GalleryGrid />
        </div>
      </section>
    </main>
  );
}
