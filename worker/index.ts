interface EmailSendResult {
  messageId: string;
}

interface EmailBinding {
  send(message: {
    from: string;
    to: string;
    subject: string;
    text: string;
    replyTo?: string;
  }): Promise<EmailSendResult>;
}

interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };

  EMAIL: EmailBinding;

  TURNSTILE_SECRET_KEY: string;
}

interface TurnstileResult {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
}

const RECIPIENT = "paul.nafureanu@gmail.com";
const SENDER = "contact@learn2drive.ro";

const MAX_BODY_SIZE = 20_000;

const ALLOWED_HOSTS = new Set(["preview.learn2drive.ro", "learn2drive.ro", "www.learn2drive.ro"]);

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

// Read the request body with a strict size limit.
async function readFormData(request: Request): Promise<FormData> {
  if (!request.body) {
    throw new Error("INVALID_FORM");
  }

  const reader = request.body.getReader();
  const buffer = new Uint8Array(MAX_BODY_SIZE);

  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      if (size + value.byteLength > MAX_BODY_SIZE) {
        await reader.cancel();
        throw new Error("BODY_TOO_LARGE");
      }

      buffer.set(value, size);
      size += value.byteLength;
    }
  } finally {
    reader.releaseLock();
  }

  const contentType = request.headers.get("content-type") ?? "";

  const response = new Response(buffer.slice(0, size), {
    headers: {
      "Content-Type": contentType,
    },
  });

  return response.formData();
}

// Extract a normal text field, rejecting uploaded files.
function getTextField(form: FormData, key: string): string | null {
  const values = form.getAll(key);

  if (values.length > 1) return null;
  if (values.length === 0) return "";

  const value = values[0];

  return typeof value === "string" ? value.trim() : null;
}

async function verifyTurnstile(token: string, env: Env): Promise<boolean> {
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error("TURNSTILE_UNAVAILABLE");
  }

  const result = (await response.json()) as TurnstileResult;

  return (
    result.success === true &&
    typeof result.hostname === "string" &&
    ALLOWED_HOSTS.has(result.hostname) &&
    result.action === "contact"
  );
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data") && !contentType.includes("application/x-www-form-urlencoded")) {
    return jsonResponse({ success: false, error: "Tip de conținut invalid." }, 415);
  }

  const declaredSize = request.headers.get("content-length");

  if (declaredSize !== null && Number(declaredSize) > MAX_BODY_SIZE) {
    return jsonResponse({ success: false, error: "Mesajul este prea mare." }, 413);
  }

  // Read and validate the submitted form.
  let form: FormData;

  try {
    form = await readFormData(request);
  } catch (error) {
    if (error instanceof Error && error.message === "BODY_TOO_LARGE") {
      return jsonResponse({ success: false, error: "Mesajul este prea mare." }, 413);
    }

    return jsonResponse({ success: false, error: "Formular invalid." }, 400);
  }

  const name = getTextField(form, "name");
  const email = getTextField(form, "email");
  const phone = getTextField(form, "phone");
  const message = getTextField(form, "message");

  const token = getTextField(form, "cf-turnstile-response");
  const honeypot = getTextField(form, "_gotcha");

  // Reject malformed or duplicate fields.
  if (name === null || email === null || phone === null || message === null || token === null || honeypot === null) {
    return jsonResponse({ success: false, error: "Formular invalid." }, 400);
  }

  // Honeypot protection.
  if (honeypot.length > 0) {
    return jsonResponse({ success: false, error: "Solicitare invalidă." }, 400);
  }

  // Server-side form validation.
  if (
    name.length < 2 ||
    name.length > 100 ||
    !email ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    phone.length > 30 ||
    message.length < 10 ||
    message.length > 3000
  ) {
    return jsonResponse(
      {
        success: false,
        error: "Verifică datele introduse în formular.",
      },
      400,
    );
  }

  // Check that Turnstile is configured.
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error("Missing TURNSTILE_SECRET_KEY binding");

    return jsonResponse(
      {
        success: false,
        error: "Serviciul de contact nu este disponibil.",
      },
      503,
    );
  }

  if (!token || token.length > 2048) {
    return jsonResponse(
      {
        success: false,
        error: "Verificarea de securitate lipsește.",
      },
      400,
    );
  }

  // Validate the Turnstile token.
  let verified = false;

  try {
    verified = await verifyTurnstile(token, env);
  } catch (error) {
    console.error("Turnstile verification failed:", error);

    return jsonResponse(
      {
        success: false,
        error: "Verificarea de securitate nu este disponibilă.",
      },
      503,
    );
  }

  if (!verified) {
    return jsonResponse(
      {
        success: false,
        error: "Verificarea de securitate a eșuat.",
      },
      403,
    );
  }

  // Verify the Email Service binding.
  if (!env.EMAIL) {
    console.error("Missing EMAIL binding");

    return jsonResponse(
      {
        success: false,
        error: "Serviciul de email nu este configurat.",
      },
      503,
    );
  }

  // Build the email.
  const emailBody = [
    "Mesaj nou primit de pe LEARN2DRIVE",
    "",
    `Nume: ${name}`,
    `Email: ${email}`,
    `Telefon: ${phone || "Nespecificat"}`,
    "",
    "Mesaj:",
    message,
    "",
    "---",
    "Trimis prin formularul de contact LEARN2DRIVE.",
  ].join("\n");

  // Send the email to the verified inbox.
  try {
    const result = await env.EMAIL.send({
      from: SENDER,
      to: RECIPIENT,
      replyTo: email,
      subject: "Mesaj nou de contact - LEARN2DRIVE",
      text: emailBody,
    });

    console.info("Contact email accepted:", result.messageId);

    return jsonResponse({
      success: true,
    });
  } catch (error) {
    console.error("Cloudflare email sending failed:", error);

    return jsonResponse(
      {
        success: false,
        error: "Mesajul nu a putut fi trimis. Încearcă din nou mai târziu.",
      },
      502,
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Contact API
    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return jsonResponse(
          {
            success: false,
            error: "Method not allowed",
          },
          405,
        );
      }

      try {
        return await handleContact(request, env);
      } catch (error) {
        console.error("Unhandled contact API error:", error);

        return jsonResponse(
          {
            success: false,
            error: "A apărut o eroare de server.",
          },
          500,
        );
      }
    }

    // Unknown API routes
    if (url.pathname.startsWith("/api/")) {
      return jsonResponse({ success: false, error: "Not found" }, 404);
    }

    // Everything else: React/Vite static website
    return env.ASSETS.fetch(request);
  },
};
