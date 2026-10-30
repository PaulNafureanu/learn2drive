import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";

import { sanityClient, urlFor } from "../../lib/sanity";

type ButtonData = {
  label?: string;
  href?: string;
};

type HeroData = {
  _id: string;
  title: string;
  highlight?: string;
  description?: string;
  image?: {
    asset?: {
      _ref: string;
    };
    alt?: string;
  };
  primaryButton?: ButtonData;
  secondaryButton?: ButtonData;
};

const HERO_QUERY = `
  *[_type == "hero"] | order(_updatedAt desc)[0] {
    _id,
    title,
    highlight,
    description,
    image,
    primaryButton,
    secondaryButton
  }
`;

function safeLink(href?: string) {
  const value = href?.trim() || "";

  if (
    /^#[a-zA-Z][\w-]*$/.test(value) ||
    (value.startsWith("/") && !value.startsWith("//")) ||
    /^https:\/\/[^/\s]+/i.test(value) ||
    /^mailto:[^\s]+$/i.test(value) ||
    /^tel:\+?[\d\s()-]+$/i.test(value)
  ) {
    return value;
  }

  return "#contact";
}

export default function Hero() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchHero() {
      try {
        const data = await sanityClient.fetch<HeroData | null>(HERO_QUERY);

        if (mounted) setHero(data);
      } catch (err) {
        console.error("Sanity Hero error:", err);
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchHero();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-8 lg:px-12">
        <div
          role="status"
          aria-label="Se încarcă secțiunea principală"
          className="min-h-[480px] animate-pulse rounded-[32px] bg-[#E9E9E7]"
        />
      </section>
    );
  }

  if (error || !hero) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-20 text-center">
        <p className="text-neutral-600">
          {error ? "Nu am putut încărca secțiunea principală." : "Conținutul paginii nu este disponibil."}
        </p>
      </section>
    );
  }

  const image = hero.image?.asset?._ref ? urlFor(hero.image).width(1400).auto("format").url() : null;

  return (
    <section id="acasa" className="mx-auto max-w-7xl px-4 py-4 sm:px-8 sm:py-8 lg:px-12">
      <div className="overflow-hidden rounded-[28px] bg-[#E9E9E7] p-5 sm:rounded-[36px] sm:p-10 lg:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* LEFT: CONTENT */}
          <div className="py-4 sm:py-8 lg:py-12">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2">
              <span className="size-2 rounded-full bg-blue-600" />
              <span className="text-xs font-semibold sm:text-sm">Școală auto & moto · Onești</span>
            </div>

            <h1 className="max-w-2xl text-[clamp(2.75rem,5.4vw,5.5rem)] leading-[1.07] font-extrabold tracking-[-0.065em] text-[#171717]">
              {hero.title} {hero.highlight && <span className="text-blue-600">{hero.highlight}</span>}
            </h1>

            {hero.description && (
              <p className="mt-6 max-w-lg text-base leading-[1.7] text-neutral-600 sm:text-lg lg:text-xl">
                {hero.description}
              </p>
            )}

            {/* BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-3">
              {hero.primaryButton?.label && (
                <a
                  href={safeLink(hero.primaryButton.href)}
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700 sm:text-base"
                >
                  {hero.primaryButton.label}
                  <ArrowUpRight size={18} />
                </a>
              )}

              {hero.secondaryButton?.label && (
                <a
                  href={safeLink(hero.secondaryButton.href)}
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-black/15 px-6 py-3.5 text-sm font-semibold transition hover:bg-white sm:text-base"
                >
                  {hero.secondaryButton.label}
                  <ArrowRight size={18} />
                </a>
              )}
            </div>

            {/* TRUST DETAIL */}
            <div className="mt-10 flex items-center gap-3 border-t border-black/10 pt-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-600">
                <ShieldCheck size={22} strokeWidth={1.8} />
              </div>

              <div className="text-sm leading-relaxed">
                <p className="font-semibold">Pregătire cu încredere</p>
                <p className="text-neutral-500">Învață să conduci în ritmul tău.</p>
              </div>
            </div>
          </div>

          {/* RIGHT: IMAGE */}
          <div className="relative min-h-[300px] overflow-hidden rounded-[24px] bg-neutral-300 sm:min-h-[440px] lg:min-h-[540px]">
            {image ? (
              <img
                src={image}
                alt={hero.image?.alt || "Autoturism pentru pregătirea cursanților"}
                className="absolute inset-0 h-full w-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">
                Imagine indisponibilă
              </div>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/50 to-transparent" />

            <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/50 px-5 py-3 text-sm font-bold text-white backdrop-blur-md">
              LEARN<span className="text-blue-400">2</span>DRIVE
            </div>

            <div className="absolute right-5 bottom-5 flex size-12 items-center justify-center rounded-full bg-white text-[#171717]">
              <ArrowUpRight size={22} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
