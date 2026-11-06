var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/index.ts
var RECIPIENT = "paul.nafureanu@gmail.com";
var SENDER = "contact@learn2drive.ro";
var MAX_BODY_SIZE = 2e4;
var ALLOWED_HOSTS = /* @__PURE__ */ new Set(["preview.learn2drive.ro", "learn2drive.ro", "www.learn2drive.ro"]);
function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
__name(jsonResponse, "jsonResponse");
async function readFormData(request) {
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
      "Content-Type": contentType
    }
  });
  return response.formData();
}
__name(readFormData, "readFormData");
function getTextField(form, key) {
  const values = form.getAll(key);
  if (values.length > 1) return null;
  if (values.length === 0) return "";
  const value = values[0];
  return typeof value === "string" ? value.trim() : null;
}
__name(getTextField, "getTextField");
async function verifyTurnstile(token, env) {
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token
    }),
    signal: AbortSignal.timeout(1e4)
  });
  if (!response.ok) {
    throw new Error("TURNSTILE_UNAVAILABLE");
  }
  const result = await response.json();
  return result.success === true && typeof result.hostname === "string" && ALLOWED_HOSTS.has(result.hostname) && result.action === "contact";
}
__name(verifyTurnstile, "verifyTurnstile");
async function handleContact(request, env) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data") && !contentType.includes("application/x-www-form-urlencoded")) {
    return jsonResponse({ success: false, error: "Tip de con\u021Binut invalid." }, 415);
  }
  const declaredSize = request.headers.get("content-length");
  if (declaredSize !== null && Number(declaredSize) > MAX_BODY_SIZE) {
    return jsonResponse({ success: false, error: "Mesajul este prea mare." }, 413);
  }
  let form;
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
  if (name === null || email === null || phone === null || message === null || token === null || honeypot === null) {
    return jsonResponse({ success: false, error: "Formular invalid." }, 400);
  }
  if (honeypot.length > 0) {
    return jsonResponse({ success: false, error: "Solicitare invalid\u0103." }, 400);
  }
  if (name.length < 2 || name.length > 100 || !email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length > 30 || message.length < 10 || message.length > 3e3) {
    return jsonResponse(
      {
        success: false,
        error: "Verific\u0103 datele introduse \xEEn formular."
      },
      400
    );
  }
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error("Missing TURNSTILE_SECRET_KEY binding");
    return jsonResponse(
      {
        success: false,
        error: "Serviciul de contact nu este disponibil."
      },
      503
    );
  }
  if (!token || token.length > 2048) {
    return jsonResponse(
      {
        success: false,
        error: "Verificarea de securitate lipse\u0219te."
      },
      400
    );
  }
  let verified = false;
  try {
    verified = await verifyTurnstile(token, env);
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return jsonResponse(
      {
        success: false,
        error: "Verificarea de securitate nu este disponibil\u0103."
      },
      503
    );
  }
  if (!verified) {
    return jsonResponse(
      {
        success: false,
        error: "Verificarea de securitate a e\u0219uat."
      },
      403
    );
  }
  if (!env.EMAIL) {
    console.error("Missing EMAIL binding");
    return jsonResponse(
      {
        success: false,
        error: "Serviciul de email nu este configurat."
      },
      503
    );
  }
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
    "Trimis prin formularul de contact LEARN2DRIVE."
  ].join("\n");
  try {
    const result = await env.EMAIL.send({
      from: SENDER,
      to: RECIPIENT,
      replyTo: email,
      subject: "Mesaj nou de contact - LEARN2DRIVE",
      text: emailBody
    });
    console.info("Contact email accepted:", result.messageId);
    return jsonResponse({
      success: true
    });
  } catch (error) {
    console.error("Cloudflare email sending failed:", error);
    return jsonResponse(
      {
        success: false,
        error: "Mesajul nu a putut fi trimis. \xCEncearc\u0103 din nou mai t\xE2rziu."
      },
      502
    );
  }
}
__name(handleContact, "handleContact");
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return jsonResponse(
          {
            success: false,
            error: "Method not allowed"
          },
          405
        );
      }
      try {
        return await handleContact(request, env);
      } catch (error) {
        console.error("Unhandled contact API error:", error);
        return jsonResponse(
          {
            success: false,
            error: "A ap\u0103rut o eroare de server."
          },
          500
        );
      }
    }
    if (url.pathname.startsWith("/api/")) {
      return jsonResponse({ success: false, error: "Not found" }, 404);
    }
    return env.ASSETS.fetch(request);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-es3my0/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-es3my0/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
