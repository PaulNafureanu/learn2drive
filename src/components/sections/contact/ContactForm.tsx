import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

type FormStatus = "idle" | "sending" | "success" | "error";

type ContactResponse = {
  success?: boolean;
  error?: string;
};

const FORM_ENDPOINT = "/api/contact";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

const inputClassName =
  "w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const sendingRef = useRef(false);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const isSending = status === "sending";
  const isConfigured = Boolean(TURNSTILE_SITE_KEY);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sendingRef.current) return;

    const form = event.currentTarget;

    // The form cannot be submitted without a valid token.
    if (!turnstileToken) {
      setStatus("error");
      setErrorMessage("Verificarea de securitate nu este completă. Încearcă din nou.");
      return;
    }

    const formData = new FormData(form);

    // Send the current Turnstile token explicitly.
    formData.set("cf-turnstile-response", turnstileToken);

    // Honeypot - reject obvious bot submissions.
    if (String(formData.get("_gotcha") ?? "").trim()) {
      setStatus("error");
      setErrorMessage("Solicitarea nu a putut fi procesată.");
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

      // Verify the backend returned JSON.
      const contentType = response.headers.get("content-type") ?? "";

      if (!contentType.includes("application/json")) {
        throw new Error("Serverul nu a returnat un răspuns valid. Încearcă din nou.");
      }

      const result = (await response.json()) as ContactResponse;

      // A successful HTTP response alone is not enough.
      if (!response.ok || result.success !== true) {
        throw new Error(result.error || "Mesajul nu a putut fi trimis.");
      }

      // Clear fields only after the server confirms success.
      form.reset();
      setStatus("success");
    } catch (err) {
      console.error("Contact form error:", err);

      setErrorMessage(err instanceof Error ? err.message : "A apărut o eroare. Încearcă din nou.");

      setStatus("error");
    } finally {
      sendingRef.current = false;

      // Turnstile tokens are single-use.
      // Generate a fresh token for the next attempt.
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    }
  }

  return (
    <div>
      <h3 className="mb-7 text-2xl font-bold text-[#171717]">Trimite un mesaj</h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="contact-website">Lasă acest câmp necompletat</label>

          <input id="contact-website" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Name */}
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
            minLength={2}
            maxLength={100}
            placeholder="Numele tău"
            className={inputClassName}
          />
        </div>

        {/* Email */}
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
            className={inputClassName}
          />
        </div>

        {/* Phone */}
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
            className={inputClassName}
          />
        </div>

        {/* Message */}
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
            className={`${inputClassName} resize-y`}
          />
        </div>

        {/* Privacy */}
        <p className="text-xs leading-relaxed text-neutral-500">
          Datele introduse vor fi folosite pentru a răspunde solicitării tale. Consultă{" "}
          <a href="/politica-de-confidentialitate" className="font-medium text-blue-600 hover:underline">
            politica de confidențialitate
          </a>
          .
        </p>

        {/* Cloudflare Turnstile */}
        {isConfigured ? (
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY!}
            options={{
              theme: "light",
              language: "ro",
              action: "contact",
            }}
            onSuccess={(token) => {
              setTurnstileToken(token);
            }}
            onExpire={() => {
              setTurnstileToken(null);
            }}
            onError={() => {
              setTurnstileToken(null);
            }}
          />
        ) : (
          <p role="alert" className="text-sm text-red-600">
            Verificarea de securitate nu este configurată.
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!isConfigured || !turnstileToken || isSending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transform-none"
        >
          {isSending ? "Se trimite..." : "Trimite mesajul"}

          <ArrowUpRight size={18} aria-hidden="true" />
        </button>

        {/* Feedback */}
        <div role="status" aria-live="polite" aria-atomic="true" className="text-sm">
          {status === "sending" && <p className="text-neutral-500">Se trimite mesajul...</p>}

          {status === "success" && (
            <p className="font-medium text-green-700">
              Mesajul a fost trimis cu succes! Îți mulțumim că ne-ai contactat.
            </p>
          )}

          {status === "error" && <p className="text-red-600">{errorMessage}</p>}
        </div>
      </form>
    </div>
  );
}
