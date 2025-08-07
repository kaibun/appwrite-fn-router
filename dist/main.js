// src/main.ts
import { cors, Router } from "itty-router";
function tracePrototypeChainOf(object) {
  var proto = object.constructor.prototype;
  var result = "";
  while (proto) {
    result += " -> " + proto.constructor.name + ".prototype";
    proto = Object.getPrototypeOf(proto);
  }
  result += " -> null";
  return result;
}
function createRouter({
  ...args
} = {}) {
  return Router({
    ...args
  });
}
async function runRouter(router, { req, res, log, error }) {
  const { headers, method, url } = req;
  const route = new URL(url);
  const request = new Request(route, {
    headers,
    method
  });
  const response = await router.fetch(
    request,
    // IRequest
    req,
    // The original Appwrite’s Request
    res,
    // The original Appwrite’s Response
    log,
    // The original or muted Appwrite’s DefaultLogger
    error
    // The original or muted Appwrite’s ErrorLogger
  );
  return response;
}
async function handleRequest(context, withRouter, options = {}) {
  const isNotProduction = process.env.NODE_ENV !== "production";
  const finalOptions = {
    globals: options.globals ?? true,
    env: options.env ?? true,
    log: options.log ?? isNotProduction,
    errorLog: options.errorLog ?? isNotProduction,
    ...options
  };
  let { req, res, log: apwLog, error: apwError } = context;
  finalOptions.log && apwLog("[router] Function is starting...");
  try {
    const log = finalOptions.log ? apwLog : () => {
    };
    const error = finalOptions.errorLog ? apwError : () => {
    };
    if (finalOptions.globals) {
      globalThis.log = log;
      globalThis.error = error;
    }
    if (finalOptions.env) {
      process.env.APPWRITE_FUNCTION_API_KEY = req.headers["x-appwrite-key"] || "";
    }
    const allowedOrigins = finalOptions.cors?.allowedOrigins ?? [];
    if (process.env.NODE_ENV !== "production") {
      if (!allowedOrigins.includes("http://localhost:3001")) {
        allowedOrigins.push("http://localhost:3001");
      }
      if (!allowedOrigins.includes("https://localhost:3001")) {
        allowedOrigins.push("https://localhost:3001");
      }
    }
    const { preflight, corsify } = cors({
      origin: (origin) => {
        if (!origin) return;
        for (const allowed of allowedOrigins) {
          if (typeof allowed === "string" && allowed === origin) {
            return origin;
          }
          if (allowed instanceof RegExp && allowed.test(origin)) {
            return origin;
          }
        }
      },
      allowMethods: finalOptions.cors?.allowMethods ?? [
        "GET",
        "POST",
        "PATCH",
        "DELETE",
        "OPTIONS"
      ],
      allowHeaders: finalOptions.cors?.allowHeaders ?? [
        "Content-Type",
        "Authorization"
      ]
    });
    const router = createRouter({
      // The `before` middleware handles preflight (OPTIONS) requests.
      before: [
        async (req2, req_appwrite, res2, log2, error2) => {
          const response2 = preflight(req2);
          if (response2) {
            const body = await response2.text();
            const statusCode = response2.status;
            const headers = Object.fromEntries(response2.headers.entries());
            return res2.send(body, statusCode, headers);
          }
        }
      ],
      // The `finally` middleware applies CORS headers to the outgoing response.
      finally: [
        async (responseFromRoute, request, req_appwrite, res2, log2, error2) => {
          if (responseFromRoute) {
            const nativeResponse = new Response(
              responseFromRoute.statusCode === 204 ? null : responseFromRoute.body,
              {
                status: responseFromRoute.statusCode,
                headers: responseFromRoute.headers
              }
            );
            const corsifiedResponse = corsify(nativeResponse, request);
            const body = await corsifiedResponse.text();
            const statusCode = corsifiedResponse.status;
            const headers = Object.fromEntries(
              corsifiedResponse.headers.entries()
            );
            return res2.send(body, statusCode, headers);
          }
        }
      ]
    });
    withRouter(router);
    const rr = router.routes.map(([method, regex, handlers, path]) => [
      method,
      regex.toString(),
      handlers.map((h) => h.toString()),
      path
    ]);
    const response = await runRouter(router, { req, res, log, error });
    if (!response) {
      return res.text("Not Found", 404);
    }
    return response;
  } catch (err) {
    finalOptions.errorLog && apwError(
      `
[router] Function has failed: ${err instanceof Error ? err.stack : String(err)}`
    );
    const message = err instanceof Error ? err.message : String(err);
    if (["/json", "/ld+json"].some(
      (type) => req.headers["content-type"]?.endsWith(type)
    )) {
      return res.json(
        {
          status: "error",
          message,
          // TODO: ? don’t expose "cause" error messages in production ?
          error: err instanceof Error && err.cause instanceof Error ? err.cause.message : "Reason unknown"
        },
        500
      );
    }
    return res.text(message, 500);
  }
}
export {
  createRouter,
  handleRequest,
  runRouter,
  tracePrototypeChainOf
};
//# sourceMappingURL=main.js.map