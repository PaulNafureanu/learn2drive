import { useSanityQuery } from "../../../hooks/useSanityQuery";
import { COURSE_GUIDE_QUERY, COURSE_GUIDE_LISTEN_QUERY } from "../queries";

import CategorySelector from "./CategorySelector";
import type { CourseGuideData } from "./types";

export default function Courses() {
  const { data, loading, error } = useSanityQuery<CourseGuideData>({
    loadingQuery: COURSE_GUIDE_QUERY,
    listeningQuery: COURSE_GUIDE_LISTEN_QUERY,
    loadingErrorMsg: "Failed to load course guide",
    listeningErrorMsg: "Course guide listener failed",
  });

  // Loading skeleton
  if (loading && !data) {
    return (
      <section
        id="cursuri"
        aria-label="Se încarcă informațiile despre cursuri"
        className="mx-auto w-[90%] py-16 sm:py-20 lg:py-24"
      >
        <div className="min-h-[550px] animate-pulse rounded-[28px] bg-neutral-200 motion-reduce:animate-none sm:rounded-[32px]" />
      </section>
    );
  }

  // Error or missing Sanity content
  if (!data?.courses?.length) {
    if (error) {
      console.warn("Course guide is unavailable");
    }

    return null;
  }

  return (
    <section id="cursuri" aria-labelledby="courses-title" className="mx-auto w-[90%] py-16 sm:py-20 lg:py-24">
      <CategorySelector
        title={data.title}
        description={data.description}
        courses={data.courses}
        documents={data.documents ?? []}
      />
    </section>
  );
}
