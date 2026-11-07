import { useId, useState } from "react";

import {
  ArrowUpRight,
  Bike,
  BookOpen,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  GraduationCap,
  Info,
  Route,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import type { CourseCategory, RequiredDocument } from "./types";

type Props = {
  title: string;
  description?: string | null;
  courses: CourseCategory[];
  documents: RequiredDocument[];
};

type MetricProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

// ==========================================
// REUSABLE METRIC
// ==========================================

function Metric({ icon: Icon, label, value }: MetricProps) {
  return (
    <div className="flex min-w-0 flex-col rounded-2xl bg-[#F5F5F3] p-4 sm:p-5">
      <Icon size={22} className="mb-4 shrink-0 text-blue-600" aria-hidden="true" />

      <p className="text-xs leading-relaxed text-neutral-500">{label}</p>

      <p className="mt-2 wrap-break-word text-lg font-bold leading-snug text-[#171717] sm:text-xl">{value}</p>
    </div>
  );
}

// ==========================================
// CATEGORY SELECTOR
// ==========================================

export default function CategorySelector({ title, description, courses, documents }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("B");

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Documents are expanded by default.
  const [showDocuments, setShowDocuments] = useState(true);

  const documentsId = useId();

  // Resolve the selected category.
  const course = courses.find((item) => item.category === selectedCategory) ?? courses[0];

  if (!course) return null;

  // Training plans are managed by Sanity.
  const plans = course.plans ?? [];

  const plan = plans.find((item) => item._key === selectedPlan) ?? plans[0];

  const isMoto = ["AM", "A1", "A2", "A"].includes(course.category);

  // Change category without collapsing documents.
  function selectCategory(category: string) {
    setSelectedCategory(category);
    setSelectedPlan(null);
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="w-full overflow-hidden rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-8 lg:p-10 xl:p-12">
      {/* ======================================
          SECTION HEADING
      ====================================== */}

      <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
        <h2
          id="courses-title"
          className="text-3xl font-extrabold tracking-tight text-[#171717] sm:text-4xl lg:text-5xl"
        >
          {title}
        </h2>

        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base lg:text-lg">
            {description}
          </p>
        )}
      </div>

      {/* ======================================
          CATEGORY NAVIGATION
      ====================================== */}

      <div
        role="group"
        aria-label="Selectează categoria permisului"
        className="mb-10 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3"
      >
        {courses.map((item) => {
          const active = item.category === course.category;

          return (
            <button
              key={item._key}
              type="button"
              onClick={() => selectCategory(item.category)}
              aria-pressed={active}
              className={`min-h-12 rounded-xl border px-3 py-3 text-sm font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                active
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-neutral-200 bg-white text-[#171717] hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {item.category}
            </button>
          );
        })}
      </div>

      {/* ======================================
          MAIN CONTENT
          DESKTOP: TWO COLUMNS
          MOBILE: STACKED
      ====================================== */}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8 xl:gap-10">
        {/* ====================================
            LEFT: CATEGORY INFORMATION
        ==================================== */}

        <div className="min-w-0">
          {/* Category heading */}
          <div className="mb-7 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-bold tracking-[0.14em] text-blue-600">CATEGORIA {course.category}</p>

              <h3 className="text-xl font-extrabold tracking-tight text-[#171717] sm:text-2xl xl:text-3xl">
                {course.description}
              </h3>
            </div>

            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:size-14">
              {isMoto ? <Bike size={27} aria-hidden="true" /> : <CarFront size={27} aria-hidden="true" />}
            </div>
          </div>

          {/* Previous licence selection */}
          {plans.length > 1 && (
            <div className="mb-7">
              <label htmlFor="course-training-plan" className="mb-2 block text-sm font-semibold text-[#171717]">
                Care este situația ta?
              </label>

              <select
                id="course-training-plan"
                value={plan?._key ?? ""}
                onChange={(event) => setSelectedPlan(event.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
              >
                {plans.map((item) => (
                  <option key={item._key} value={item._key}>
                    {item.label}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                Planul final de pregătire este stabilit după verificarea permisului și a vechimii acestuia.
              </p>
            </div>
          )}

          {/* ==================================
              TRAINING REQUIREMENTS
          ================================== */}

          {plan && (
            <div className="grid grid-cols-2 gap-3">
              <Metric icon={CalendarDays} label="Vârsta minimă pentru permis" value={course.minimumAge} />

              <Metric icon={BookOpen} label="Pregătire teoretică" value={`${plan.theoryHours} ore`} />

              <Metric icon={CarFront} label="Pregătire practică" value={`${plan.practiceHours} ore`} />

              <Metric icon={Route} label="Kilometri minimi" value={`${plan.minimumKm} km`} />

              <Metric
                icon={Clock3}
                label="Durata minimă"
                value={`${plan.minimumWeeks} ${plan.minimumWeeks === 1 ? "săptămână" : "săptămâni"}`}
              />

              {course.exam && <Metric icon={GraduationCap} label="Proba practică" value={course.exam} />}
            </div>
          )}

          {/* CATEGORY DESCRIPTION / NOTE */}
          {course.note && <p className="mt-6 text-sm leading-relaxed text-neutral-600">{course.note}</p>}
        </div>

        {/* ====================================
            RIGHT: DOCUMENTS
        ==================================== */}

        {documents.length > 0 && (
          <div className="min-w-0 rounded-[24px] bg-[#F5F5F3] p-5 sm:p-7 lg:p-8">
            {/* Documents heading */}
            <h3>
              <button
                type="button"
                onClick={() => setShowDocuments((prev) => !prev)}
                aria-expanded={showDocuments}
                aria-controls={documentsId}
                className="flex w-full items-center justify-between gap-4 text-left text-base font-bold text-[#171717] transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-lg"
              >
                <span className="flex items-center gap-3">
                  <ClipboardList size={23} className="shrink-0 text-blue-600" aria-hidden="true" />
                  Documente necesare înscrierii
                </span>

                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className={`shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                    showDocuments ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>
            </h3>

            {/* Documents accordion */}
            <div
              id={documentsId}
              aria-hidden={!showDocuments}
              inert={!showDocuments}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                showDocuments ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                {/* Document items */}
                <ul className="grid gap-5 pt-7 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                  {documents.map((document) => (
                    <li key={document._key} className="flex min-w-0 items-start gap-3">
                      <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />

                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-relaxed text-[#171717]">{document.title}</p>

                        {document.description && (
                          <p className="mt-1 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                            {document.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Documents clarification */}
            {showDocuments && (
              <div className="mt-7 border-t border-black/10 pt-5">
                <p className="text-xs leading-relaxed text-neutral-500">
                  Documentele pentru înscrierea la școală pot fi diferite de cele necesare pentru examen. Contactează
                  secretariatul pentru confirmarea listei.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================
          BOTTOM: INFORMATION + CTA
      ====================================== */}

      <div className="mt-9 flex flex-col gap-6 border-t border-neutral-200 pt-7 lg:flex-row lg:items-center lg:justify-between">
        {/* Important information */}
        <div className="flex max-w-3xl min-w-0 items-start gap-3">
          <Info size={20} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />

          <div>
            <p className="text-sm font-semibold text-[#171717]">Informații importante</p>

            <p className="mt-1 text-xs leading-relaxed text-neutral-500 sm:text-sm">
              Valorile afișate reprezintă cerințele minime pentru planul selectat, nu durata garantată pentru obținerea
              permisului. Pregătirea și documentele pot varia în funcție de situația ta.
            </p>
          </div>
        </div>

        {/* Enrollment CTA */}
        <a
          href="#contact"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transform-none lg:self-auto"
        >
          Înscrie-te acum
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
