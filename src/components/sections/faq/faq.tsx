import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { useSanityQuery } from "../../../hooks/useSanityQuery";
import { FAQ_QUERY, FAQ_LISTEN_QUERY } from "./../queries";

type FaqItem = {
  _key: string;
  question: string;
  answer: string;
};

type FaqData = {
  title: string;
  description?: string | null;
  questions?: FaqItem[] | null;
};

export default function Faq() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const { data, loading, error } = useSanityQuery<FaqData>({
    loadingQuery: FAQ_QUERY,
    listeningQuery: FAQ_LISTEN_QUERY,
    loadingErrorMsg: "Failed to load FAQ",
    listeningErrorMsg: "FAQ listener failed",
  });

  if (loading && !data) {
    return (
      <section className="mx-auto w-[90%] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-12 w-64 animate-pulse rounded-lg bg-neutral-200" />
          <div className="mx-auto mt-4 h-5 w-96 max-w-full animate-pulse rounded-lg bg-neutral-200" />
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-2xl bg-neutral-200" />
          ))}
        </div>
      </section>
    );
  }

  if (!data || !data.questions?.length) {
    if (error) console.warn("FAQ is unavailable");
    return null;
  }

  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto w-[90%] py-16 sm:py-20 lg:py-24">
      {/* Centered heading */}
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 id="faq-title" className="text-4xl font-extrabold tracking-tight text-[#171717] sm:text-5xl">
          {data.title}
        </h2>

        {data.description && (
          <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">{data.description}</p>
        )}
      </div>

      {/* Accordion */}
      <div className="mx-auto max-w-4xl space-y-3">
        {data.questions.map((item) => {
          const isOpen = openQuestion === item._key;
          const panelId = `faq-answer-${item._key}`;

          return (
            <div key={item._key} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenQuestion((prev) => (prev === item._key ? null : item._key))}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-5 px-6 py-6 text-left text-base font-semibold text-[#171717] transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-600 sm:px-8 sm:text-lg"
                >
                  <span>{item.question}</span>

                  <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className={`shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-hidden={!isOpen}
                inert={!isOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="whitespace-pre-line px-6 pb-6 leading-relaxed text-neutral-600 sm:px-8 sm:pb-8">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
