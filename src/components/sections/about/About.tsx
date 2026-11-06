import { useSanityQuery } from "../../../hooks/useSanityQuery";
import { ABOUT_QUERY, ABOUT_LISTEN_QUERY } from "../queries";

import Roadmap from "./Roadmap";
import type { AboutData } from "./types";

export default function About() {
  const { data, loading, error } = useSanityQuery<AboutData>({
    loadingQuery: ABOUT_QUERY,
    listeningQuery: ABOUT_LISTEN_QUERY,
    loadingErrorMsg: "Failed to load About section",
    listeningErrorMsg: "About listener failed",
  });

  if (loading && !data) {
    return (
      <section
        id="despre"
        className="mx-auto w-[90%] py-16 sm:py-20 lg:py-24"
        aria-label="Se încarcă secțiunea despre noi"
      >
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="mx-auto h-12 w-3/4 animate-pulse rounded-lg bg-neutral-200 motion-reduce:animate-none" />
          <div className="mx-auto h-5 w-1/2 animate-pulse rounded-lg bg-neutral-200 motion-reduce:animate-none" />
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-60 animate-pulse rounded-3xl bg-neutral-200 motion-reduce:animate-none" />
          ))}
        </div>
      </section>
    );
  }

  // Keep existing content visible during refresh errors.
  if (!data) {
    if (error) console.warn("About section is unavailable");
    return null;
  }

  const steps = data.steps ?? [];

  return (
    <section
      id="despre"
      aria-labelledby="about-title"
      className="mx-auto w-[90%] bg-transparent py-16 sm:py-20 lg:py-24"
    >
      {/* Introduction */}
      <div className="mx-auto mb-14 text-center sm:mb-16">
        <h2
          id="about-title"
          className="text-4xl leading-tight font-extrabold tracking-tight text-[#171717] sm:text-5xl lg:text-6xl"
        >
          {data.title}

          {data.highlight && (
            <>
              {" "}
              <span className="text-blue-600">{data.highlight}</span>
            </>
          )}
        </h2>

        {data.description && (
          <p className="mx-auto mt-6 text-base leading-relaxed text-neutral-600 sm:text-lg">{data.description}</p>
        )}
      </div>

      {/* Roadmap */}
      {steps.length > 0 && (
        <div>
          {data.roadmapTitle && (
            <h3 className="mb-10 text-center text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
              {data.roadmapTitle}
            </h3>
          )}

          <Roadmap steps={steps} />
        </div>
      )}
    </section>
  );
}
