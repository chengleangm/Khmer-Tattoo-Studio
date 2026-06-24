import ArtistCard from "@/components/ArtistCard";
import SectionTitle from "@/components/SectionTitle";
import { artists } from "@/data/site";

export default function ArtistsPage() {
  return (
    <main>
      <section className="grain bg-ink px-5 py-14 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title="OUR ARTISTS" light />
          <p className="mx-auto mt-6 hidden max-w-2xl text-center text-sm leading-6 text-white/60 sm:block">
            Four focused specialists, one studio standard: clean design, strong contrast, and custom tattoos made for your skin.
          </p>
        </div>
      </section>

      <section className="editorial-section px-5 py-14 lg:px-8 lg:py-28" data-bg-word="ARTISTS">
        <div className="grid w-[min(350px,calc(100vw-2.5rem))] grid-cols-2 gap-3 overflow-hidden md:mx-auto md:w-full md:max-w-7xl md:gap-5 lg:grid-cols-4">
          {artists.map((artist) => (
            <ArtistCard key={artist.name} {...artist} />
          ))}
        </div>
      </section>
    </main>
  );
}
