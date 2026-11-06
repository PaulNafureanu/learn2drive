import { Star } from "lucide-react";
import type { Testimonial } from "./types";

type Props = {
  review: Testimonial;
};

export default function ReviewCard({ review }: Props) {
  return (
    <article className="flex h-full flex-col rounded-[24px] border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
      {review.rating != null && (
        <div className="mb-5 flex gap-1 text-yellow-400" aria-label={`${review.rating} din 5 stele`}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={18}
              aria-hidden="true"
              className={index < review.rating ? "fill-current" : "text-neutral-200"}
            />
          ))}
        </div>
      )}

      <p className="mb-7 whitespace-pre-line text-sm leading-relaxed text-neutral-700 sm:text-base">{review.text}</p>

      <div className="mt-auto border-t border-neutral-100 pt-5">
        <p className="font-semibold text-[#171717]">{review.author}</p>

        {review.date && (
          <p className="mt-1 text-xs text-neutral-500">
            {new Intl.DateTimeFormat("ro-RO", {
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(`${review.date}T12:00:00Z`))}
          </p>
        )}
      </div>
    </article>
  );
}
