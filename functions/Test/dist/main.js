// src/main.ts
import { inspect as inspect2 } from "util";

// ../../src/main.ts
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
async function runRouter(router3, { req, res, log: log2, error: error2 }) {
  const { headers, method, url } = req;
  const route = new URL(url);
  let nativeRequest = new Request(url, { headers, method });
  const response = await router3.fetch(
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
    const router3 = createRouter({
      before,
      finally: finallyArr,
      ...ittyOptions
      // catch, etc. sont transmis automatiquement
    });
    withRouter(router3);
    const response = await runRouter(router3, { req, res, log: log2, error: error2 });
    if (!response) {
      return res.text("Not Found", 404);
    }
    return response;
  } catch (err) {
    return handleRequestError(err, finalOptions, req, res, log, error);
  }
}

// src/routes/widgets.ts
var router = createRouter({ base: "/widgets" });
router.get("/", (_req, res, _log, _error) => {
  const response = res.json({
    items: [
      { id: "widget1", weight: 10, color: "red" },
      { id: "widget2", weight: 20, color: "blue" }
    ]
  });
  return response;
});
router.post("/", async (req, res, _log, _error) => {
  try {
    const body = req.bodyJson;
    if (typeof body.weight !== "number" || !body.color) {
      return res.json(
        {
          code: "VALIDATION_ERROR",
          message: "Missing required fields",
          errors: ["weight and color are required"]
        },
        400
      );
    }
    const newWidget = {
      id: `widget-${Date.now()}`,
      weight: body.weight,
      color: body.color
    };
    return res.json(newWidget, 201);
  } catch (e) {
    if (e instanceof SyntaxError) {
      return res.json(
        {
          code: "BAD_REQUEST",
          message: "Invalid JSON in request body"
        },
        400
      );
    }
    _error(String(e));
    throw e;
  }
});
router.get("/secret", (req, res, _log, _error) => {
  const authHeader = req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ code: "UNAUTHORIZED", message: "Unauthorized" }, 401);
  }
  return res.json({ id: "widget-secret", weight: 200, color: "gold" });
});
router.get("/:id", (req, res, _log, _error) => {
  const { id } = req.params;
  if (id === "not-found") {
    return res.json({ code: "NOT_FOUND", message: "Widget not found" }, 404);
  }
  return res.json({ id, weight: 10, color: "red" });
});
router.patch("/:id", async (req, res, _log, _error) => {
  try {
    const { id } = req.params;
    if (id === "not-found") {
      return res.json({ code: "NOT_FOUND", message: "Widget not found" }, 404);
    }
    const body = req.bodyJson;
    const updatedWidget = {
      id,
      weight: body.weight ?? 10,
      color: body.color ?? "red"
    };
    return res.json(updatedWidget);
  } catch (e) {
    if (e instanceof SyntaxError) {
      return res.json(
        {
          code: "BAD_REQUEST",
          message: "Invalid JSON in request body"
        },
        400
      );
    }
    _error(String(e));
    throw e;
  }
});
router.delete("/:id", (req, res, _log, _error) => {
  const { id } = req.params;
  if (id === "not-found") {
    return res.json({ code: "NOT_FOUND", message: "Widget not found" }, 404);
  }
  return res.send("", 204);
});
router.post("/:id", (req, res, _log, _error) => {
  const { id } = req.params;
  return res.json({
    statusCode: 200,
    id,
    analysis: "This widget is amazing!"
  });
});
var widgets_default = router;

// src/routes/errors.ts
var router2 = createRouter({ base: "/errors" });
router2.get("/throw", (_req, res, log2, _error) => {
  throw new Error("E2E: This is a test error from /throw");
});
var errors_default = router2;

// src/main.ts
function routes(router3) {
  router3.get("/", (_request, res, log2, _error) => {
    return res.text("Root route hit!");
  });
  router3.all("/widgets*", widgets_default.fetch);
  router3.all("/errors*", errors_default.fetch);
}
var ignoredRoutes = ["/favicon.ico", "/robots.txt", "/.well-known/"];
var main_default = async (context) => {
  const { req, res, log: log2, error: error2 } = context;
  let greetings = `${req.method} ${req.path}`;
  const ignoreRoute = ignoredRoutes.some((route) => req.path.startsWith(route));
  if (ignoreRoute) {
    log2(greetings + " (ignored)");
    return res.text("I'm a teapot", 418);
  }
  log2(greetings + "\n");
  const CatchHandler = (err, req2, res2, log3, error3, internals) => {
    log3(err ? inspect2(err) : "Unknown error");
    if (req2.path.startsWith("/errors")) {
      return res2.json(
        {
          status: "error",
          message: "E2E_CUSTOM_ERROR_TRIGGERED",
          error: err instanceof Error ? err.message : String(err)
        },
        500
      );
    }
    throw err;
  };
  const response = await handleRequest(context, routes, {
    logs: process.env.NODE_ENV === "development",
    ittyOptions: {
      catch: CatchHandler
    }
  });
  log2(inspect2(response, { depth: null }));
  log2("\n");
  return response;
};
export {
  main_default as default
};
//# sourceMappingURL=main.js.map