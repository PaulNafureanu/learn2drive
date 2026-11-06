import { ArrowUpRight, Star } from "lucide-react";

import { useSanityQuery } from "../../../hooks/useSanityQuery";
import { REVIEWS_QUERY, REVIEWS_LISTEN_QUERY } from "./../queries";
import ReviewCard from "./ReviewCard";

import type { ReviewsData } from "./types";

type Props = {
  mapsUrl?: string | null;
  reviewUrl?: string | null;
};

export default function Reviews({ mapsUrl, reviewUrl }: Props) {
  const { data, loading } = useSanityQuery<ReviewsData>({
    loadingQuery: REVIEWS_QUERY,
    listeningQuery: REVIEWS_LISTEN_QUERY,
    loadingErrorMsg: "Failed to load testimonials",
    listeningErrorMsg: "Testimonials listener failed",
  });

  const testimonials = data?.testimonials ?? [];

  if (loading && !data) {
    return (
      <section id="recenzii" className="mx-auto w-[90%] py-16">
        <div className="mx-auto mb-10 h-12 w-80 max-w-full animate-pulse rounded-lg bg-neutral-200" />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-60 animate-pulse rounded-3xl bg-neutral-200" />
          ))}
        </div>
      </section>
    );
  }

  if (!testimonials.length && !mapsUrl && !reviewUrl) {
    return null;
  }

  return (
    <section id="recenzii" aria-labelledby="reviews-title" className="mx-auto w-[90%] py-16 sm:py-20 lg:py-24">
      {/* CENTERED HEADING */}
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 id="reviews-title" className="text-4xl font-extrabold tracking-tight text-[#171717] sm:text-5xl">
          {data?.title || "Ce spun cursanții noștri?"}
        </h2>

        {data?.description && (
          <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">{data.description}</p>
        )}
      </div>

      {/* REVIEW CARDS */}
      {testimonials.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((review) => (
            <ReviewCard key={review._key} review={review} />
          ))}
        </div>
      )}

      {/* CENTERED BUTTONS */}
      {(reviewUrl || mapsUrl) && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {reviewUrl && (
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 motion-reduce:transform-none"
            >
              <Star size={17} aria-hidden="true" />
              Lasă-ne o recenzie
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          )}

          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-[#171717] transition-colors duration-200 hover:bg-white"
            >
              Vezi toate recenziile
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </section>
  );
}
