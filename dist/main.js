// src/main.ts
import { inspect } from "util";
import { cors, Router } from "itty-router";
var noop = (...args) => {
};
var isBoolean = (obj) => typeof obj === "boolean";
var isFunction = (obj) => obj instanceof Function;
var isDevelopment = process.env.NODE_ENV === "development" || process.env.APP_ENV === "development";
var isTest = process.env.NODE_ENV === "test" || process.env.APP_ENV === "test";
var defaultLogFn = (mode) => isDevelopment || isTest;
var isJSONLikeRequest = (req) => (
  // There so many JSON-like content types, our best bet is to be agnostic.
  // @see https://www.iana.org/assignments/media-types/media-types.xhtml
  req.headers["content-type"]?.endsWith("+json")
);
async function corsPreflightMiddleware(req, res, log2, error2, internals) {
  const response = internals.preflight(internals.request);
  if (response) {
    const body = await response.text();
    const statusCode = response.status;
    const headers = Object.fromEntries(response.headers.entries());
    return res.send(body, statusCode, headers);
  }
}
async function corsFinallyMiddleware(responseFromRoute, request, res, log2, error2, internals) {
  if (responseFromRoute) {
    const nativeResponse = new Response(
      responseFromRoute.statusCode === 204 ? null : responseFromRoute.body,
      {
        status: responseFromRoute.statusCode,
        headers: responseFromRoute.headers
      }
    );
    const corsifiedResponse = internals.corsify(
      nativeResponse,
      internals.request
    );
    const body = await corsifiedResponse.text();
    const statusCode = corsifiedResponse.status;
    const headers = Object.fromEntries(corsifiedResponse.headers.entries());
    return res.send(body, statusCode, headers);
  }
}
function createRouter({
  ...args
} = {}) {
  return Router({
    ...args
  });
}
function normalizeHeaders(req) {
  if (!req || !req.headers || typeof req.headers !== "object") return;
  const normalized = {};
  for (const k in req.headers) {
    if (Object.prototype.hasOwnProperty.call(req.headers, k)) {
      normalized[k.toLowerCase()] = req.headers[k];
    }
  }
  req.headers = new Proxy(normalized, {
    get(target, prop) {
      if (typeof prop === "string") {
        return target[prop.toLowerCase()];
      }
      return void 0;
    },
    has(target, prop) {
      if (typeof prop === "string") {
        return prop.toLowerCase() in target;
      }
      return false;
    },
    ownKeys(target) {
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(target, prop) {
      if (typeof prop === "string" && prop.toLowerCase() in target) {
        return Object.getOwnPropertyDescriptor(target, prop.toLowerCase());
      }
      return void 0;
    }
  });
}
function buildFinalOptions(options) {
  return {
    globals: options.globals ?? true,
    env: options.env ?? true,
    log: isBoolean(options.logs) ? options.logs : isFunction(options.logs) ? options.logs("log") : defaultLogFn("log"),
    errorLog: isBoolean(options.logs) ? options.logs : isFunction(options.logs) ? options.logs("errorLog") : defaultLogFn("errorLog"),
    ...options
  };
}
function setupGlobalLoggers(finalOptions, log2, error2) {
  if (finalOptions.globals) {
    globalThis.log = log2;
    globalThis.error = error2;
  }
}
function setupEnvVars(finalOptions, req) {
  if (finalOptions.env) {
    process.env.APPWRITE_FUNCTION_API_KEY = req.headers["x-appwrite-key"] || "";
  }
}
function buildCorsOptions(finalOptions) {
  const allowedOrigins = finalOptions.cors?.allowedOrigins ?? [];
  if (isDevelopment) {
    if (!allowedOrigins.includes("http://localhost:3001")) {
      allowedOrigins.push("http://localhost:3001");
    }
    if (!allowedOrigins.includes("https://localhost:3001")) {
      allowedOrigins.push("https://localhost:3001");
    }
  }
  return {
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
  };
}
async function runRouter(router, { req, res, log: log2, error: error2 }) {
  const { headers, method, url } = req;
  const route = new URL(url);
  let nativeRequest = new Request(url, { headers, method });
  const response = await router.fetch(
    req,
    // AppwriteRequest (an itty-router’s RequestLike object)
    res,
    // AppwriteResponse
    log2,
    // DefaultLogger
    error2,
    // ErrorLogger
    {
      request: nativeRequest
      // FetchObjects.FetchRequest i.e. a native Request object
    }
  );
  return response;
}
function handleRequestError(err, options, req, res, log2, error2) {
  if (options.errorLog) {
    error2(`[appwrite-fn-router] handleRequestError triggered: ${inspect(err)}`);
  }
  const message = isDevelopment ? err instanceof Error ? err.message : String(err) : "An error occurred during request processing the request.";
  const errorDetails = isDevelopment ? err instanceof Error && err.cause instanceof Error ? err.cause.message : "Reason unknown" : "Error details are not available unless in development mode.";
  if (isJSONLikeRequest(req)) {
    return res.json(
      {
        status: "error",
        message,
        error: errorDetails
      },
      500
    );
  }
  return res.text(message + " " + errorDetails, 500);
}
async function handleRequest(context, withRouter, options = {}) {
  let { req, res, log: apwLog, error: apwError } = context;
  let finalOptions = { log: false, errorLog: false };
  try {
    normalizeHeaders(req);
    finalOptions = buildFinalOptions(options);
    const log2 = finalOptions.log ? apwLog : noop;
    const error2 = finalOptions.errorLog ? apwError : noop;
    setupGlobalLoggers(finalOptions, log2, error2);
    setupEnvVars(finalOptions, req);
    const corsOptions = buildCorsOptions(finalOptions);
    const { preflight, corsify } = cors(corsOptions);
    const { ittyOptions = {} } = finalOptions;
    const { before: userBefore = [], finally: userFinally = [] } = ittyOptions;
    const before = [
      (req2, res2, log3, error3, internals, ...args) => corsPreflightMiddleware(req2, res2, log3, error3, {
        ...internals || {},
        preflight
      }),
      ...[].concat(userBefore)
    ];
    const finallyArr = [
      ...[].concat(userFinally),
      (responseFromRoute, request, res2, log3, error3, internals, ...args) => corsFinallyMiddleware(responseFromRoute, request, res2, log3, error3, {
        ...internals || {},
        corsify
      })
    ];
    const router = createRouter({
      before,
      finally: finallyArr,
      ...ittyOptions
      // catch, etc. sont transmis automatiquement
    });
    withRouter(router);
    const response = await runRouter(router, { req, res, log: log2, error: error2 });
    if (!response) {
      return res.text("Not Found", 404);
    }
    return response;
  } catch (err) {
    return handleRequestError(err, finalOptions, req, res, log, error);
  }
}
export {
  buildCorsOptions,
  buildFinalOptions,
  corsFinallyMiddleware,
  corsPreflightMiddleware,
  createRouter,
  defaultLogFn,
  handleRequest,
  handleRequestError,
  normalizeHeaders,
  runRouter,
  setupEnvVars,
  setupGlobalLoggers
};
//# sourceMappingURL=main.js.map