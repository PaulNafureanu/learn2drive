import { Award, BookOpen, CarFront, ClipboardList, CreditCard, ShieldCheck } from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { RoadmapIcon, RoadmapStep } from "./types";

type Props = {
  steps: RoadmapStep[];
};

const icons: Record<RoadmapIcon, LucideIcon> = {
  clipboard: ClipboardList,
  book: BookOpen,
  car: CarFront,
  award: Award,
  license: CreditCard,
  shield: ShieldCheck,
};

export default function Roadmap({ steps }: Props) {
  if (!steps.length) return null;

  return (
    <ol className="relative grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
      {steps.map((step, index) => {
        const Icon = icons[step.icon ?? "car"] ?? CarFront;

        return (
          <li key={step._key} className="relative min-w-0">
            <article className="group flex h-full flex-col rounded-[28px] border border-neutral-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md motion-reduce:transform-none sm:p-8">
              {/* Header */}
              <div className="mb-8 flex items-center justify-between">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={30} strokeWidth={1.8} aria-hidden="true" />
                </div>

                <span className="text-5xl font-extrabold tracking-tight text-neutral-100 transition-colors group-hover:text-blue-100">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col">
                <span className="mb-3 text-xs font-bold tracking-[0.15em] text-blue-600">
                  PASUL {String(index + 1).padStart(2, "0")}
                </span>

                <h4 className="text-xl font-bold tracking-tight text-[#171717] sm:text-2xl">{step.title}</h4>

                <p className="mt-5 text-sm leading-[1.85] text-neutral-600 sm:text-base">{step.description}</p>
              </div>

              {/* Decorative progress bar */}
              <div aria-hidden="true" className="mt-8 h-1 w-12 rounded-full bg-blue-600" />
            </article>
          </li>
        );
      })}
    </ol>
  );
}
