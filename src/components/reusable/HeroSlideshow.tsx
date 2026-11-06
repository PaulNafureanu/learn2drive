import { useEffect, useState } from "react";

export type Slide = {
  _key: string;
  url: string;
  alt?: string | null;
};

type Props = {
  images: Slide[];
  intervalMs?: number;
};

export default function HeroSlideshow({ images, intervalMs = 5000 }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const [timerKey, setTimerKey] = useState(0);

  const active = images.length ? activeIndex % images.length : 0;
  const hasMultipleImages = images.length > 1;

  // Listen for changes to the user's reduced-motion preference.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function handleChange(event: MediaQueryListEvent) {
      setReducedMotion(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Automatic slideshow.
  useEffect(() => {
    if (!hasMultipleImages || intervalMs <= 0 || paused || reducedMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [hasMultipleImages, images.length, intervalMs, paused, reducedMotion, timerKey]);

  function goToSlide(index: number) {
    setActiveIndex(index);
    setTimerKey((prev) => prev + 1);
  }

  function nextSlide() {
    if (!hasMultipleImages) return;

    goToSlide((active + 1) % images.length);
  }

  if (!images.length) return null;

  return (
    <div
      className="relative min-h-[300px] overflow-hidden rounded-[24px] bg-neutral-300 sm:min-h-[440px] lg:min-h-[540px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Clickable image area */}
      <button
        type="button"
        onClick={nextSlide}
        disabled={!hasMultipleImages}
        aria-label="Afișează imaginea următoare"
        className={`absolute inset-0 h-full w-full overflow-hidden ${
          hasMultipleImages ? "cursor-pointer" : "cursor-default"
        }`}
      >
        {images.map((image, index) => (
          <img
            key={image._key}
            src={image.url}
            alt={index === active ? image.alt || "" : ""}
            aria-hidden={index !== active}
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover
              transition-opacity duration-700 ease-in-out
              motion-reduce:transition-none
              ${index === active ? "opacity-100" : "opacity-0"}`}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
          />
        ))}
      </button>

      {/* Navigation dots */}
      {hasMultipleImages && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((image, index) => (
            <button
              key={image._key}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Afișează imaginea ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all duration-300
                motion-reduce:transition-none
                ${index === active ? "w-7 bg-white" : "w-2.5 bg-white/60 hover:bg-white"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
