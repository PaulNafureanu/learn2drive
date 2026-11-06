export default function HeroScheleton() {
  return (
    <section id="acasa" className="mx-auto w-[90%] py-10">
      <div
        role="status"
        aria-label="Se încarcă secțiunea principală"
        className="grid animate-pulse items-center gap-10 lg:grid-cols-2 lg:gap-16 motion-reduce:animate-none"
      >
        <div className="space-y-5">
          <div className="h-14 w-4/5 rounded-lg bg-neutral-200" />
          <div className="h-14 w-3/5 rounded-lg bg-neutral-200" />
          <div className="h-5 w-full rounded bg-neutral-200" />
          <div className="h-5 w-4/5 rounded bg-neutral-200" />
        </div>

        <div className="min-h-[300px] rounded-[24px] bg-neutral-200 sm:min-h-[440px] lg:min-h-[540px]" />
      </div>
    </section>
  );
}
