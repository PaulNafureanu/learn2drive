import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useSanityQuery } from "../../../hooks/useSanityQuery";
import { urlFor } from "../../../lib/sanity";
import { HERO_QUERY, HERO_LISTEN_QUERY } from "../queries";
import HeroSlideshow from "./../../reusable/HeroSlideshow";
import HeroScheleton from "./HeroScheleton";
import HeroError from "./HeroError";

type HeroImage = {
  _key: string;
  alt?: string | null;
  asset?: {
    _ref: string;
    _type: "reference";
  } | null;
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
};

export type HeroData = {
  title: string;
  highlight?: string | null;
  description?: string | null;
  images?: HeroImage[] | null;

  primaryButton?: {
    label: string;
    href: string;
  } | null;

  secondaryButton?: {
    label: string;
    href: string;
  } | null;
};

export default function Hero() {
  const {
    data: hero,
    loading,
    error,
  } = useSanityQuery<HeroData>({
    loadingQuery: HERO_QUERY,
    listeningQuery: HERO_LISTEN_QUERY,
    loadingErrorMsg: "Failed to load hero",
    listeningErrorMsg: "Hero listener failed",
  });

  // Loading skeleton
  if (loading && !hero) {
    return <HeroScheleton />;
  }

  // Error or missing document
  if (!hero) {
    return <HeroError error={error} />;
  }

  // Convert Sanity images into slideshow-ready URLs.
  const slides = (hero.images ?? [])
    .filter((image) => Boolean(image.asset?._ref))
    .map((image) => ({
      _key: image._key,
      alt: image.alt,
      url: urlFor(image).width(1200).height(900).auto("format").url(),
    }));

  const hasImages = slides.length > 0;

  return (
    <section id="acasa" className="mx-auto w-[90%] bg-transparent py-10 sm:py-14 lg:py-20">
      <div
        className={`grid items-center gap-10 lg:gap-8 xl:gap-12 ${
          hasImages ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" : "lg:grid-cols-1"
        }`}
      >
        {/* LEFT: CONTENT */}
        <div className="py-4 sm:py-8">
          {/* Main title */}
          <h1 className="w-full text-[clamp(2.5rem,4.5vw,5rem)] leading-[1.08] font-extrabold tracking-[-0.055em] text-[#171717]">
            {hero.title}

            {hero.highlight && (
              <>
                {" "}
                <span className="text-blue-600">{hero.highlight}</span>
              </>
            )}
          </h1>

          {/* Description */}
          {hero.description && (
            <p className="mt-6 max-w-xl text-base leading-[1.7] text-neutral-600 sm:text-lg lg:text-xl">
              {hero.description}
            </p>
          )}

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            {hero.primaryButton?.label && hero.primaryButton?.href && (
              <a
                href={hero.primaryButton.href}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 motion-reduce:transform-none sm:text-base"
              >
                {hero.primaryButton.label}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            )}

            {hero.secondaryButton?.label && hero.secondaryButton?.href && (
              <a
                href={hero.secondaryButton.href}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-black/15 px-6 py-3.5 text-sm font-semibold text-[#171717] transition-all duration-200 hover:bg-neutral-100 sm:text-base"
              >
                {hero.secondaryButton.label}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* RIGHT: IMAGE SLIDESHOW */}
        {hasImages && <HeroSlideshow images={slides} intervalMs={5000} />}
      </div>
    </section>
  );
}
