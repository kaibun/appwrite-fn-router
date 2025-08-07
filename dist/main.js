// src/main.ts
import { inspect } from "util";
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
  log("\n[router] Running router with the following request:");
  const request = new Request(route, {
    headers,
    method
  });
  log(
    JSON.stringify({
      method,
      route,
      headers: JSON.stringify(headers)
    })
  );
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
  log("\n[router] Router has fetched a response.");
  return response;
}
async function handleRequest(context, withRouter, options = { globals: true, env: true, log: true, errorLog: true }) {
  let { req, res, log: apwLog, error: apwError } = context;
  options.log && apwLog("[router] Function is starting...");
  try {
    const log = options.log ? apwLog : () => {
    };
    const error = options.errorLog ? apwError : () => {
    };
    if (options.globals) {
      globalThis.log = log;
      globalThis.error = error;
    }
    if (options.env) {
      process.env.APPWRITE_FUNCTION_API_KEY = req.headers["x-appwrite-key"] || "";
    }
    const allowedOrigins = options.cors?.allowedOrigins ?? [];
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
      allowMethods: options.cors?.allowMethods ?? [
        "GET",
        "POST",
        "PATCH",
        "DELETE",
        "OPTIONS"
      ],
      allowHeaders: options.cors?.allowHeaders ?? [
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
    log("\n[router] Router has been augmented with routes:");
    const rr = router.routes.map(([method, regex, handlers, path]) => [
      method,
      regex.toString(),
      handlers.map((h) => h.toString()),
      path
    ]);
    rr.forEach((r) => log(JSON.stringify(r)));
    const response = await runRouter(router, { req, res, log, error });
    apwLog("\n[router] Router has fetched with result:");
    apwLog(inspect(response, { depth: null }));
    if (!response) {
      return res.text("Not Found", 404);
    }
    apwLog("\n[router] Router response received");
    return response;
  } catch (err) {
    options.errorLog && apwError(
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