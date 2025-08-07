// src/main.ts
import { inspect } from "util";

// ../../src/main.ts
import { cors, Router } from "itty-router";
function createRouter({
  ...args
} = {}) {
  return Router({
    ...args
  });
}
async function runRouter(router2, { req, res, log, error }) {
  const { headers, method, url } = req;
  const route = new URL(url);
  const request = new Request(route, {
    headers,
    method
  });
  const response = await router2.fetch(
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
    const router2 = createRouter({
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
    withRouter(router2);
    const rr = router2.routes.map(([method, regex, handlers, path]) => [
      method,
      regex.toString(),
      handlers.map((h) => h.toString()),
      path
    ]);
    const response = await runRouter(router2, { req, res, log, error });
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

// src/routes/widgets.ts
var router = createRouter({ base: "/widgets" });
router.get("/", (_request, _req, res, _log, _error) => {
  const response = res.json({
    items: [
      { id: "widget1", weight: 10, color: "red" },
      { id: "widget2", weight: 20, color: "blue" }
    ]
  });
  return response;
});
router.post("/", async (request, req, res, _log, _error) => {
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
    return res.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred"
      },
      500
    );
  }
});
router.get("/secret", (request, _req, res, _log, _error) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ code: "UNAUTHORIZED", message: "Unauthorized" }, 401);
  }
  return res.json({ id: "widget-secret", weight: 200, color: "gold" });
});
router.get("/:id", (request, _req, res, _log, _error) => {
  const { id } = request.params;
  if (id === "not-found") {
    return res.json({ code: "NOT_FOUND", message: "Widget not found" }, 404);
  }
  return res.json({ id, weight: 10, color: "red" });
});
router.patch("/:id", async (request, req, res, _log, _error) => {
  try {
    const { id } = request.params;
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
    return res.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred"
      },
      500
    );
  }
});
router.delete("/:id", (request, _req, res, _log, _error) => {
  const { id } = request.params;
  if (id === "not-found") {
    return res.json({ code: "NOT_FOUND", message: "Widget not found" }, 404);
  }
  return res.send("", 204);
});
router.post("/:id", (request, _req, res, _log, _error) => {
  const { id } = request.params;
  return res.json({
    statusCode: 200,
    id,
    analysis: "This widget is amazing!"
  });
});
var widgets_default = router;

// src/main.ts
function routes(router2) {
  router2.get("/", (_request, _req, res, log, _error) => {
    const response = res.text("Root route hit!");
    return response;
  });
  router2.all("/widgets*", widgets_default.fetch);
}
var ignoredRoutes = ["/favicon.ico", "/robots.txt", "/.well-known/"];
var main_default = async (context) => {
  const { req, res, log, error } = context;
  let greetings = `${req.method} ${req.path}`;
  const ignoreRoute = ignoredRoutes.some((route) => req.path.startsWith(route));
  if (ignoreRoute) {
    log(greetings + " (ignored)");
    return res.text("I'm a teapot", 418);
  }
  log(greetings + "\n");
  const response = await handleRequest(context, routes, {
    log: false,
    errorLog: true
  });
  log(inspect(response, { depth: null }));
  log("\n");
  return response;
};
export {
  main_default as default
};
//# sourceMappingURL=main.js.map