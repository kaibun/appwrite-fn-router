import { inspect } from 'node:util';
import { cors, RouterOptions, Router } from 'itty-router';
import type {
  Context as AppwriteContext,
  Request as AppwriteRequest,
  Response as AppwriteResponse,
  DefaultLogger,
  ErrorLogger,
  Options,
  RouterJSONResponse,
  WrapperRequestType,
} from '../types/core';
import '../types/global.d.ts'; // Import global declarations

const $ = globalThis;

/**
 * @internal
 */
export function tracePrototypeChainOf(object: object) {
  var proto = object.constructor.prototype;
  var result = '';

  while (proto) {
    result += ' -> ' + proto.constructor.name + '.prototype';
    proto = Object.getPrototypeOf(proto);
  }

  result += ' -> null';
  return result;
}

// TODO: https://github.com/kaibun/appwrite-fn-router/issues/6
// WrapperRequestType is now defined in types/core.ts

// Creating an AutoRouter instance, adjusting types to match the Appwrite context
export function createRouter({
  ...args
}: RouterOptions<
  WrapperRequestType,
  [AppwriteRequest, AppwriteResponse, DefaultLogger, ErrorLogger] & any[]
> = {}) {
  return Router<
    WrapperRequestType,
    [AppwriteRequest, AppwriteResponse, DefaultLogger, ErrorLogger] & any[],
    AppwriteResponse
  >({
    ...args,
  });
}

// Exporting a function to run the router with Appwrite's context
export async function runRouter(
  router: ReturnType<typeof createRouter>,
  { req, res, log, error }: AppwriteContext
) {
  const { headers, method, url } = req;
  const route = new URL(url);
  log('\n[router] Running router with the following request:');
  const request = new Request(route, {
    headers,
    method,
  });
  log(
    JSON.stringify({
      method,
      route,
      headers: JSON.stringify(headers),
    })
  );

  // Passing along the request and misc. objects from the Appwrite context
  const response = await router.fetch(
    request, // IRequest
    req, // The original Appwrite’s Request
    res, // The original Appwrite’s Response
    log, // The original or muted Appwrite’s DefaultLogger
    error // The original or muted Appwrite’s ErrorLogger
  );

  log('\n[router] Router has fetched a response.');
  return response;
}

export async function handleRequest(
  context: AppwriteContext,
  // Accepting a function that receives the router instance, so the end-user
  // may define their own routes, customize that router’s behavior, etc.
  withRouter: (router: ReturnType<typeof createRouter>) => void,
  options: Options = { globals: true, env: true, log: true, errorLog: true }
) {
  let { req, res, log: apwLog, error: apwError } = context;
  options.log && apwLog('[router] Function is starting...');

  try {
    const log = options.log ? apwLog : () => {};
    const error = options.errorLog ? apwError : () => {};

    if (options.globals) {
      globalThis.log = log;
      globalThis.error = error;
    }
    if (options.env) {
      process.env.APPWRITE_FUNCTION_API_KEY =
        req.headers['x-appwrite-key'] || '';
    }

    // Dynamically set allowed origins based on the environment.
    const allowedOrigins: (string | RegExp)[] =
      options.cors?.allowedOrigins ?? [];
    if (process.env.NODE_ENV !== 'production') {
      // Add development origins if not already present.
      if (!allowedOrigins.includes('http://localhost:3001')) {
        allowedOrigins.push('http://localhost:3001');
      }
      if (!allowedOrigins.includes('https://localhost:3001')) {
        allowedOrigins.push('https://localhost:3001');
      }
    }

    // Initialize CORS with a dynamic origin validation function.
    // This is required because itty-router's `cors` helper does not
    // support a mixed array of strings and RegExps.
    const { preflight, corsify } = cors({
      origin: (origin) => {
        if (!origin) return;
        for (const allowed of allowedOrigins) {
          if (typeof allowed === 'string' && allowed === origin) {
            return origin;
          }
          if (allowed instanceof RegExp && allowed.test(origin)) {
            return origin;
          }
        }
      },
      allowMethods: options.cors?.allowMethods ?? [
        'GET',
        'POST',
        'PATCH',
        'DELETE',
        'OPTIONS',
      ],
      allowHeaders: options.cors?.allowHeaders ?? [
        'Content-Type',
        'Authorization',
      ],
    });

    // console.log(JSON.stringify(process.env, null, 2));
    const router = createRouter({
      // The `before` middleware handles preflight (OPTIONS) requests.
      before: [
        async (req, req_appwrite, res, log, error) => {
          // itty-router's `preflight` expects a native `Request` object.
          const response = preflight(req);
          if (response) {
            // Convert the native `Response` from `preflight` to an Appwrite-compatible response object.
            const body = await response.text();
            const statusCode = response.status;
            const headers = Object.fromEntries(response.headers.entries());
            return res.send(body, statusCode, headers);
          }
        },
      ],
      // The `finally` middleware applies CORS headers to the outgoing response.
      finally: [
        async (responseFromRoute, request, req_appwrite, res, log, error) => {
          if (responseFromRoute) {
            // Re-create a native `Response` to pass it to `corsify`.
            // The `Response` constructor throws if a body is provided with a 204 status.
            const nativeResponse = new Response(
              responseFromRoute.statusCode === 204
                ? null
                : responseFromRoute.body,
              {
                status: responseFromRoute.statusCode,
                headers: responseFromRoute.headers,
              }
            );
            // `corsify` adds the necessary CORS headers to the response.
            const corsifiedResponse = corsify(nativeResponse, request);

            // Convert the final native `Response` back to an Appwrite-compatible response object.
            const body = await corsifiedResponse.text();
            const statusCode = corsifiedResponse.status;
            const headers = Object.fromEntries(
              corsifiedResponse.headers.entries()
            );
            return res.send(body, statusCode, headers);
          }
        },
      ],
    });
    withRouter(router);

    log('\n[router] Router has been augmented with routes:');
    const rr = router.routes.map(([method, regex, handlers, path]) => [
      method,
      regex.toString(),
      handlers.map((h) => h.toString()),
      path,
    ]);
    rr.forEach((r) => log(JSON.stringify(r)));

    const response = await runRouter(router, { req, res, log, error });
    apwLog('\n[router] Router has fetched with result:');
    apwLog(inspect(response, { depth: null }));

    if (!response) {
      // TODO: abide by request’s Accept header (fallback to Content-type, then to text/plain)
      return res.text('Not Found', 404);
    }

    apwLog('\n[router] Router response received');
    // Debug: response body access would need proper Response interface handling
    // log(tracePrototypeChainOf(response));
    // Object.getOwnPropertyNames(response).forEach((key) => {
    //   log(`Key: ${key}`);
    // });

    return response;
  } catch (err) {
    // TODO: support reporting to a monitoring service
    options.errorLog &&
      apwError(
        `\n[router] Function has failed: ${err instanceof Error ? err.stack : String(err)}`
      );
    const message = err instanceof Error ? err.message : String(err);
    // if (options.onError) {
    //   return options.onError(err);
    // }
    // TODO: abide by request’s Accept header (fallback to Content-type, then to text/plain)
    if (
      ['/json', '/ld+json'].some((type) =>
        req.headers['content-type']?.endsWith(type)
      )
    ) {
      return res.json(
        {
          status: 'error',
          message,
          // TODO: ? don’t expose "cause" error messages in production ?
          error:
            err instanceof Error && err.cause instanceof Error
              ? err.cause.message
              : 'Reason unknown',
        } satisfies RouterJSONResponse,
        500
      );
    }
    return res.text(message, 500);
  }
}
