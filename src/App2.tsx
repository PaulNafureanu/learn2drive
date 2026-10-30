import { useState } from "react";
import { content } from "./content";

const links = [
  { label: "Cum funcționează", href: "#pasi" },
  { label: "Instructori", href: "#instructori" },
  { label: "Cursuri", href: "#cursuri" },
  { label: "Întrebări", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{title}</h2>
      {description && <p className="mt-4 leading-7 text-slate-600">{description}</p>}
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { hero, roadmap, instructors, offers, faq, contact } = content;

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900 antialiased">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"
          aria-label="Navigare principală"
        >
          <a href="#acasa" className="text-xl font-black tracking-tight">
            Learn<span className="text-emerald-600">2</span>Drive<span className="ml-1 text-emerald-600">.</span>
          </a>
          <div className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            className="hidden rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 lg:inline-flex"
          >
            Înscrie-te
          </a>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? "Închide ✕" : "Meniu ☰"}
          </button>
        </nav>
        {menuOpen && (
          <div id="mobile-navigation" className="border-t border-slate-200 bg-white px-5 pb-5 pt-2 lg:hidden">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 font-medium text-slate-700"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <main>
        <section id="acasa" className="overflow-hidden bg-[#052f27] text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
            <div>
              <span className="inline-flex rounded-full border border-emerald-300/30 bg-white/10 px-4 py-2 text-sm text-emerald-100">
                🚗 {hero.eyebrow}
              </span>
              <h1 className="mt-7 max-w-xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl">
                {hero.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-emerald-50/80">{hero.description}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="rounded-full bg-lime-300 px-7 py-3.5 font-bold text-emerald-950 transition hover:bg-lime-200"
                >
                  {hero.cta} <span aria-hidden="true">↗</span>
                </a>
                <a
                  href="#pasi"
                  className="rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
                >
                  Descoperă pașii
                </a>
              </div>
            </div>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-white/15 bg-emerald-900 shadow-2xl">
              {hero.imageUrl ? (
                <img src={hero.imageUrl} alt="Learn2Drive — școala de șoferi" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_70%_20%,#84cc164d,transparent_45%),linear-gradient(135deg,#155e48,#052f27)] px-8 text-center">
                  <span className="mb-5 text-7xl" aria-hidden="true">
                    🚘
                  </span>
                  <p className="text-2xl font-bold">Pornește la drum!</p>
                  <p className="mt-2 max-w-xs text-sm text-emerald-100/75">
                    Aici va apărea o fotografie reală a școlii.
                  </p>
                </div>
              )}
              <div className="absolute bottom-5 left-5 rounded-2xl border border-white/20 bg-emerald-950/70 px-5 py-3 text-sm font-semibold backdrop-blur">
                Learn2Drive <span className="ml-2 text-lime-300">●</span>
              </div>
            </div>
          </div>
        </section>

        <section id="pasi" className="scroll-mt-24 px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="Pas cu pas"
              title="Drumul tău spre permis"
              description="Un proces simplu, explicat pe înțelesul tuturor."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {roadmap.map((step, index) => (
                <article key={index} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <span className="text-3xl font-black text-emerald-600/70">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-7 text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="recenzii" className="scroll-mt-24 bg-emerald-50 px-5 py-20 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Recenzii Google</p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Experiențele cursanților contează.</h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-600">
                Descoperă recenziile autentice de pe profilul nostru Google Maps.
              </p>
            </div>
            {content.googleReviewsUrl ? (
              <a
                href={content.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 justify-center rounded-full bg-emerald-700 px-7 py-3.5 font-semibold text-white hover:bg-emerald-800"
              >
                Vezi recenziile pe Google ↗
              </a>
            ) : (
              <span className="inline-flex shrink-0 rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm text-slate-600">
                Linkul Google Maps va fi adăugat în curând
              </span>
            )}
          </div>
        </section>

        <section id="instructori" className="scroll-mt-24 px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="Echipa"
              title="Cunoaște instructorii"
              description="Oamenii alături de care înveți să conduci."
            />
            {instructors.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {instructors.map((person) => (
                  <article
                    key={person.name}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    {person.imageUrl ? (
                      <img
                        src={person.imageUrl}
                        alt={`Instructor: ${person.name}`}
                        className="aspect-[4/3] w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="flex aspect-[4/3] items-center justify-center bg-emerald-100 text-6xl"
                        aria-hidden="true"
                      >
                        🚗
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold">{person.name}</h3>
                      <p className="mt-1 text-sm font-medium text-emerald-700">{person.role}</p>
                      <p className="mt-3 leading-7 text-slate-600">{person.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50 p-10 text-slate-600">
                Fotografiile și prezentările instructorilor vor apărea aici în curând.
              </div>
            )}
          </div>
        </section>

        <section id="cursuri" className="scroll-mt-24 bg-white px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="Cursuri și oferte"
              title="Alege următorul pas"
              description="Informațiile actualizate despre cursuri și prețuri vor fi disponibile aici."
            />
            {offers.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {offers.map((offer) => (
                  <article
                    key={offer.title}
                    className="flex flex-col rounded-3xl border border-emerald-200 bg-[#f8faf9] p-7"
                  >
                    <h3 className="text-xl font-bold">{offer.title}</h3>
                    <p className="mt-3 text-slate-600">{offer.description}</p>
                    {offer.price && <p className="mt-6 text-3xl font-black text-emerald-800">{offer.price}</p>}
                    <ul className="mt-6 space-y-2 text-sm text-slate-700">
                      {offer.highlights.map((item) => (
                        <li key={item}>✓ {item}</li>
                      ))}
                    </ul>
                    <a
                      href="#contact"
                      className="mt-7 inline-flex justify-center rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
                    >
                      Cere detalii
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-emerald-950 p-8 text-white md:flex-row md:items-center">
                <div>
                  <h3 className="text-2xl font-bold">Vrei să afli mai multe despre cursuri?</h3>
                  <p className="mt-2 text-emerald-100/80">
                    Contactează-ne pentru disponibilitate și prețuri actualizate.
                  </p>
                </div>
                <a href="#contact" className="shrink-0 rounded-full bg-lime-300 px-6 py-3 font-bold text-emerald-950">
                  Cere detalii ↗
                </a>
              </div>
            )}
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <SectionTitle eyebrow="Întrebări frecvente" title="Răspunsuri pe scurt" />
            <div className="space-y-3">
              {faq.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 open:border-emerald-200"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:hidden">
                    {item.question}
                    <span className="text-2xl font-light text-emerald-700 group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 leading-7 text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 bg-[#052f27] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-lime-300">Contact</p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Pregătit să pornești la drum?</h2>
              <p className="mt-5 max-w-lg leading-8 text-emerald-100/80">
                Scrie-ne sau sună-ne și îți oferim detalii despre înscriere.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="rounded-full bg-lime-300 px-6 py-3 font-bold text-emerald-950"
                  >
                    Sună acum: {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white"
                  >
                    Trimite un email ↗
                  </a>
                )}
              </div>
              {contact.address && <p className="mt-7 text-sm text-emerald-100/90">📍 {contact.address}</p>}
              {!contact.phone && !contact.email && (
                <p className="mt-7 text-sm text-emerald-100/70">Datele de contact vor fi adăugate în curând.</p>
              )}
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/15 bg-emerald-900">
              {contact.mapEmbedUrl ? (
                <iframe
                  title="Locația Learn2Drive"
                  src={contact.mapEmbedUrl}
                  className="h-80 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-80 flex-col items-center justify-center gap-3 p-6 text-center">
                  <span className="text-4xl" aria-hidden="true">
                    📍
                  </span>
                  <p className="font-semibold">Locația Learn2Drive</p>
                  <p className="text-sm text-emerald-100/75">Harta va apărea aici după confirmarea adresei.</p>
                </div>
              )}
              {contact.mapsUrl && (
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-emerald-800 px-5 py-3 text-center text-sm font-semibold hover:bg-emerald-700"
                >
                  Deschide în Google Maps ↗
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-emerald-950 px-5 py-7 text-emerald-100/70 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm sm:flex-row">
          <p>
            © {new Date().getFullYear()} {content.schoolName}. Toate drepturile rezervate.
          </p>
          <a href="#acasa" className="hover:text-white">
            Înapoi sus ↑
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
