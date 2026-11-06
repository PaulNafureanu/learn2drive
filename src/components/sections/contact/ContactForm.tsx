import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";

type FormStatus = "idle" | "sending" | "success" | "error";

const FORM_ENDPOINT = import.meta.env.VITE_CONTACT_FORM_ENDPOINT as string | undefined;

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const sendingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sendingRef.current || !FORM_ENDPOINT) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Basic honeypot protection.
    if (String(formData.get("_gotcha") ?? "").trim()) {
      return;
    }

    sendingRef.current = true;
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        let message = "Mesajul nu a putut fi trimis.";

        try {
          const result = await response.json();

          if (Array.isArray(result.errors)) {
            message =
              result.errors
                .map((error: { message?: string }) => error.message)
                .filter(Boolean)
                .join(" ") || message;
          }
        } catch {
          // Keep the generic message.
        }

        throw new Error(message);
      }

      form.reset();
      setStatus("success");
    } catch (err) {
      console.error("Contact form error:", err);

      setErrorMessage(err instanceof Error ? err.message : "A apărut o eroare. Încearcă din nou.");

      setStatus("error");
    } finally {
      sendingRef.current = false;
    }
  }

  return (
    <div>
      <h3 className="mb-7 text-2xl font-bold text-[#171717]">Trimite un mesaj</h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot - hidden from real visitors */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="contact-website">Lasă acest câmp necompletat</label>

          <input id="contact-website" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">
            Nume complet
          </label>

          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Numele tău"
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">
            Adresă de email
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="email@exemplu.ro"
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium">
            Telefon (opțional)
          </label>

          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            placeholder="+40 7..."
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">
            Mesaj
          </label>

          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            minLength={10}
            maxLength={3000}
            placeholder="Cu ce te putem ajuta?"
            className="w-full resize-y rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
          />
        </div>

        <p className="text-xs leading-relaxed text-neutral-500">
          Datele introduse vor fi folosite pentru a răspunde solicitării tale. Consultă{" "}
          <a href="/politica-de-confidentialitate" className="font-medium text-blue-600 hover:underline">
            politica de confidențialitate
          </a>
          .
        </p>

        <button
          type="submit"
          disabled={!FORM_ENDPOINT || status === "sending"}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? "Se trimite..." : "Trimite mesajul"}

          <ArrowUpRight size={18} aria-hidden="true" />
        </button>

        <div aria-live="polite" className="text-sm">
          {status === "sending" && <p className="text-neutral-500">Se trimite mesajul...</p>}

          {status === "success" && (
            <p className="font-medium text-green-700">
              Mesajul a fost trimis cu succes! Îți mulțumim că ne-ai contactat.
            </p>
          )}

          {status === "error" && (
            <p role="alert" className="text-red-600">
              {errorMessage}
            </p>
          )}

          {!FORM_ENDPOINT && <p className="text-neutral-500">Formularul nu este configurat momentan.</p>}
        </div>
      </form>
    </div>
  );
}
