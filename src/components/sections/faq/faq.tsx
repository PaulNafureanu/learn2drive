import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

import { useSanityQuery } from "../../../hooks/useSanityQuery";
import { FAQ_QUERY, FAQ_LISTEN_QUERY } from "../queries";

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

type FaqCardProps = {
  item: FaqItem;
  number: number;
  isOpen: boolean;
  onToggle: () => void;
};

function FaqCard({ item, number, isOpen, onToggle }: FaqCardProps) {
  const id = useId();
  const panelId = `${id}-answer`;

  const formattedNumber = String(number).padStart(2, "0");

  return (
    <article
      className={`min-w-0 overflow-hidden rounded-2xl border bg-white transition-colors duration-200 ${
        isOpen ? "border-blue-200" : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600 sm:gap-5 sm:px-7 sm:py-6"
        >
          {/* AUTOMATIC NUMBER */}
          <span
            aria-hidden="true"
            className={`shrink-0 text-sm font-bold tabular-nums transition-colors ${
              isOpen ? "text-blue-600" : "text-blue-500"
            }`}
          >
            {formattedNumber}
          </span>

          {/* QUESTION */}
          <span
            className={`min-w-0 flex-1 text-sm font-semibold leading-relaxed transition-colors sm:text-base ${
              isOpen ? "text-blue-600" : "text-[#171717]"
            }`}
          >
            {item.question}
          </span>

          {/* CHEVRON */}
          <ChevronDown
            size={20}
            aria-hidden="true"
            className={`shrink-0 transition-all duration-300 motion-reduce:transition-none ${
              isOpen ? "rotate-180 text-blue-600" : "text-neutral-500"
            }`}
          />
        </button>
      </h3>

      {/* ANSWER */}
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
          <div className="px-5 pb-6 pl-12 sm:px-7 sm:pl-[4.25rem]">
            <p className="whitespace-pre-line text-sm leading-[1.8] text-neutral-600 sm:text-base">{item.answer}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

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
      <section
        id="faq"
        aria-label="Se încarcă întrebările frecvente"
        className="mx-auto w-[90%] py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-12 w-64 animate-pulse rounded-lg bg-neutral-200 motion-reduce:animate-none" />

          <div className="mx-auto mt-4 h-5 w-96 max-w-full animate-pulse rounded-lg bg-neutral-200 motion-reduce:animate-none" />
        </div>

        <div className="mt-12 grid w-full gap-4 lg:grid-cols-2">
          {[0, 1].map((column) => (
            <div key={column} className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-2xl bg-neutral-200 motion-reduce:animate-none" />
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!data?.questions?.length) {
    if (error) {
      console.warn("FAQ is unavailable");
    }

    return null;
  }

  const questions = data.questions;

  const midpoint = Math.ceil(questions.length / 2);

  // Preserve the original position from Sanity.
  const numberedQuestions = questions.map((item, index) => ({
    ...item,
    number: index + 1,
  }));

  const leftQuestions = numberedQuestions.slice(0, midpoint);
  const rightQuestions = numberedQuestions.slice(midpoint);

  function renderQuestion(item: FaqItem & { number: number }) {
    const isOpen = openQuestion === item._key;

    return (
      <FaqCard
        key={item._key}
        item={item}
        number={item.number}
        isOpen={isOpen}
        onToggle={() => setOpenQuestion((prev) => (prev === item._key ? null : item._key))}
      />
    );
  }

  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto w-[90%] py-16 sm:py-20 lg:py-24">
      {/* CENTERED HEADING */}
      <div className="mx-auto mb-12 w-full text-center">
        <h2 id="faq-title" className="text-4xl font-extrabold tracking-tight text-[#171717] sm:text-5xl">
          {data.title}
        </h2>

        {data.description && (
          <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">{data.description}</p>
        )}
      </div>

      {/* DESKTOP: TWO INDEPENDENT COLUMNS */}
      <div className="hidden w-full grid-cols-2 items-start gap-4 lg:grid">
        <div className="min-w-0 space-y-3">{leftQuestions.map(renderQuestion)}</div>

        <div className="min-w-0 space-y-3">{rightQuestions.map(renderQuestion)}</div>
      </div>

      {/* MOBILE / TABLET: SINGLE COLUMN */}
      <div className="w-full space-y-3 lg:hidden">{numberedQuestions.map(renderQuestion)}</div>
    </section>
  );
}
