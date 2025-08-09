import { inspect } from 'node:util';
import { cors, RouterOptions, Router } from 'itty-router';

import type {
  AFRContextArgs,
  InternalObjects,
  AppwriteContext,
  AppwriteRequest,
  AppwriteResponse,
  DefaultLogger,
  ErrorLogger,
  Options,
  FinalOptions,
  RouterJSONResponse,
  AFRRequest,
  logEnableFn,
} from '../types/core';
import '../types/global.d.ts'; // Import global declarations

const $ = globalThis;

const noop = (...args: any[]) => {};
const isBoolean = (obj: unknown): obj is boolean => typeof obj === 'boolean';
const isFunction = (obj: unknown): obj is CallableFunction =>
  obj instanceof Function;
const isDevelopment =
  process.env.NODE_ENV === 'development' ||
  process.env.APP_ENV === 'development';
const isTest =
  process.env.NODE_ENV === 'test' || process.env.APP_ENV === 'test';

/**
 * Default log activation callback: logs are enabled only in development.
 * Users can override this by passing their own function to handleRequest.
 */
export const defaultLogFn: logEnableFn = (mode: 'log' | 'errorLog') =>
  isDevelopment || isTest;

const isJSONLikeRequest = (req: AppwriteRequest) =>
  // There so many JSON-like content types, our best bet is to be agnostic.
  // @see https://www.iana.org/assignments/media-types/media-types.xhtml
  req.headers['content-type']?.endsWith('+json');

/**
 * @internal
 * CORS preflight middleware that’s Appwrite-compatible (to be used first in before[]).
 */
export async function corsPreflightMiddleware(
  req: AppwriteRequest,
  res: AppwriteResponse,
  log: DefaultLogger,
  error: ErrorLogger,
  internals: InternalObjects & {
    preflight: (req: Request) => Response | undefined;
  }
) {
  const response = internals.preflight(internals.request);
  if (response) {
    const body = await response.text();
    const statusCode = response.status;
    const headers = Object.fromEntries(response.headers.entries());
    return res.send(body, statusCode, headers);
  }
}

/**
 * @internal
 * CORS finalization middleware that’s Appwrite-compatible (to be used last in finally[]).
 */
export async function corsFinallyMiddleware(
  responseFromRoute: any,
  request: AppwriteRequest,
  res: AppwriteResponse,
  log: DefaultLogger,
  error: ErrorLogger,
  internals: InternalObjects & {
    corsify: (res: Response, req: Request) => Response;
  }
) {
  if (responseFromRoute) {
    const nativeResponse = new Response(
      responseFromRoute.statusCode === 204 ? null : responseFromRoute.body,
      {
        status: responseFromRoute.statusCode,
        headers: responseFromRoute.headers,
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

/**
 * The router propagates a standard Appwrite signature to handlers:
 * `req, res, log, error` typed as `AppwriteRequest`, `AppwriteResponse`,
 * `DefaultLogger`, `ErrorLogger` respectively.
 *
 * Internal Itty Router middlewares (e.g. preflight/corsify) can access the
 * native Request object (Fetch API) via a fifth argument corresponding to
 * `InternalObjects`.
 */
export function createRouter({
  ...args
}: RouterOptions<
  AFRRequest,
  [AppwriteResponse, DefaultLogger, ErrorLogger, InternalObjects] & any[]
> = {}) {
  return Router<
    AFRRequest,
    [AppwriteResponse, DefaultLogger, ErrorLogger, InternalObjects] & any[],
    AppwriteResponse
  >({
    ...args,
  });
}

/**
 * @internal
 * Normalizes Appwrite request headers as case-insensitive keys, so that you can
 * use either eg. `Authorization` or `authorization` keys in your handlers.
 */
export function normalizeHeaders(req: AppwriteRequest) {
  if (!req || !req.headers || typeof req.headers !== 'object') return;
  const normalized: Record<string, string> = {};
  for (const k in req.headers) {
    if (Object.prototype.hasOwnProperty.call(req.headers, k)) {
      normalized[k.toLowerCase()] = req.headers[k];
    }
  }
  req.headers = new Proxy(normalized, {
    get(target, prop: string) {
      if (typeof prop === 'string') {
        return target[prop.toLowerCase()];
      }
      return undefined;
    },
    has(target, prop: string) {
      if (typeof prop === 'string') {
        return prop.toLowerCase() in target;
      }
      return false;
    },
    ownKeys(target) {
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(target, prop) {
      if (typeof prop === 'string' && prop.toLowerCase() in target) {
        return Object.getOwnPropertyDescriptor(target, prop.toLowerCase());
      }
      return undefined;
    },
  });
}

/**
 * @internal
 * Builds the final options from user options and environment.
 */
export function buildFinalOptions(options: Options): FinalOptions {
  return {
    globals: options.globals ?? true,
    env: options.env ?? true,
    log: isBoolean(options.logs)
      ? options.logs
      : isFunction(options.logs)
        ? options.logs('log')
        : defaultLogFn('log'),
    errorLog: isBoolean(options.logs)
      ? options.logs
      : isFunction(options.logs)
        ? options.logs('errorLog')
        : defaultLogFn('errorLog'),
    ...options,
  } satisfies FinalOptions;
}

/**
 * @internal
 * Propagates Appwrite logging functions to the global context, if requested.
 */
export function setupGlobalLoggers(
  finalOptions: Options,
  log: DefaultLogger,
  error: ErrorLogger
) {
  if (finalOptions.globals) {
    globalThis.log = log;
    globalThis.error = error;
  }
}

/**
 * @internal
 * Updates the `APPWRITE_FUNCTION_API_KEY` environment variable, if requested.
 */
export function setupEnvVars(finalOptions: Options, req: AppwriteRequest) {
  if (finalOptions.env) {
    process.env.APPWRITE_FUNCTION_API_KEY = req.headers['x-appwrite-key'] || '';
  }
}

/**
 * @internal
 * Enables dynamic CORS configuration.
 */
export function buildCorsOptions(finalOptions: Options) {
  const allowedOrigins: (string | RegExp)[] =
    finalOptions.cors?.allowedOrigins ?? [];
  if (isDevelopment) {
    if (!allowedOrigins.includes('http://localhost:3001')) {
      allowedOrigins.push('http://localhost:3001');
    }
    if (!allowedOrigins.includes('https://localhost:3001')) {
      allowedOrigins.push('https://localhost:3001');
    }
  }
  return {
    origin: (origin: string) => {
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
    allowMethods: finalOptions.cors?.allowMethods ?? [
      'GET',
      'POST',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
    allowHeaders: finalOptions.cors?.allowHeaders ?? [
      'Content-Type',
      'Authorization',
    ],
  };
}

/**
 * Runs the router with the Appwrite context, as well as a native `Request` for proper CORS, etc. in the Itty router.
 */
export async function runRouter(
  router: ReturnType<typeof createRouter>,
  { req, res, log, error }: AppwriteContext
) {
  const { headers, method, url } = req;
  const route = new URL(url);

  // Build the nativeRequest for internal use (CORS, etc.)
  // Node 18+ and all modern runtimes provide the global Request API
  let nativeRequest: Request = new Request(url, { headers, method });

  const response = await router.fetch(
    req, // AppwriteRequest (an itty-router’s RequestLike object)
    res, // AppwriteResponse
    log, // DefaultLogger
    error, // ErrorLogger
    {
      request: nativeRequest, // FetchObjects.FetchRequest i.e. a native Request object
    } as InternalObjects
  );
  return response;
}

/**
 * @internal
 * Centralized error handling for uncatched exceptions stemming from the router.
 * This function may be circumvented by a custom `catch handler in `ittyOptions`.
 */
export function handleRequestError(
  err: unknown,
  options: FinalOptions,
  req: AppwriteRequest,
  res: AppwriteResponse,
  log: DefaultLogger,
  error: ErrorLogger
) {
  if (options.errorLog) {
    error(`[appwrite-fn-router] handleRequestError triggered: ${inspect(err)}`);
  }
  const message = isDevelopment
    ? err instanceof Error
      ? err.message
      : String(err)
    : 'An error occurred during request processing the request.';
  const errorDetails = isDevelopment
    ? err instanceof Error && err.cause instanceof Error
      ? err.cause.message
      : 'Reason unknown'
    : 'Error details are not available unless in development mode.';
  if (isJSONLikeRequest(req)) {
    return res.json(
      {
        status: 'error',
        message,
        error: errorDetails,
      } satisfies RouterJSONResponse,
      500
    );
  }
  return res.text(message + ' ' + errorDetails, 500);
}

/**
 * Main entry point for handling an Appwrite function HTTP request using the router abstraction.
 *
 * This function orchestrates the full lifecycle of a request:
 *
 * - Normalizes headers for case-insensitive access.
 * - Builds the final options from user options and environment.
 * - Initializes log and error functions, and propagates them globally if requested.
 * - Updates required environment variables (e.g., Appwrite API key) if requested.
 * - Dynamically configures CORS according to environment and options.
 * - Composes middlewares (before/finally) for the router, including CORS and user-provided ones.
 * - Instantiates the router, then delegates to the user-provided `withRouter` callback to define routes.
 * - Executes the router on the request, handles the response and logging.
 * - Handles uncaught errors via handleRequestError.
 *
 * @param context   Appwrite context (req, res, log, error)
 * @param withRouter User function to define routes on the router
 * @param options   Advanced options (CORS, logs, middlewares, etc.)
 * @returns         AppwriteResponseObject generated by the router, or a formatted error
 */
export async function handleRequest(
  context: AppwriteContext,
  withRouter: (router: ReturnType<typeof createRouter>) => void,
  options: Options = {}
) {
  let { req, res, log: apwLog, error: apwError } = context;
  let finalOptions: FinalOptions = { log: false, errorLog: false };

  try {
    normalizeHeaders(req);

    finalOptions = buildFinalOptions(options);

    const log = finalOptions.log ? apwLog : noop;
    const error = finalOptions.errorLog ? apwError : noop;

    setupGlobalLoggers(finalOptions, log, error);
    setupEnvVars(finalOptions, req);

    const corsOptions = buildCorsOptions(finalOptions);
    const { preflight, corsify } = cors(corsOptions);

    const { ittyOptions = {} } = finalOptions;
    const { before: userBefore = [], finally: userFinally = [] } = ittyOptions;

    const before: Array<(...args: AFRContextArgs) => any> = [
      (req, res, log, error, internals, ...args) =>
        corsPreflightMiddleware(req, res, log, error, {
          ...(internals || {}),
          preflight,
        }),
      ...[].concat(userBefore),
    ];

    const finallyArr: Array<
      (responseFromRoute: any, ...args: AFRContextArgs) => any
    > = [
      ...[].concat(userFinally),
      (responseFromRoute, request, res, log, error, internals, ...args) =>
        corsFinallyMiddleware(responseFromRoute, request, res, log, error, {
          ...(internals || {}),
          corsify,
        }),
    ];

    const router = createRouter({
      before,
      finally: finallyArr,
      ...ittyOptions, // catch, etc. sont transmis automatiquement
    });

    withRouter(router);
    // log(
    //   '[DEBUG] router.routes (after withRouter call):',
    //   JSON.stringify(
    //     router.routes,
    //     (k, v) =>
    //       typeof v === 'function'
    //         ? `[Function: ${v.name || 'anonymous'}]`
    //         : v,
    //     2
    //   )
    // );

    const response = await runRouter(router, { req, res, log, error });
    if (!response) {
      // TODO: abide by request’s Accept header (fallback to Content-type, then to text/plain)
      return res.text('Not Found', 404);
    }
    return response;
  } catch (err) {
    // By default, in the absence of a catch handler in `ittyOptions`, itty’s
    // Router will throw an error. This is the place to handle it.
    // As we’re handling a thrown error which breaks free of the routing cycle,
    // there is no `internals` object available here (e.g. no `internals.request`,
    // although you shouldn’t need it anyway as everything about the request is
    // readily available through `req`).
    return handleRequestError(err, finalOptions, req, res, log, error);
  }
}
