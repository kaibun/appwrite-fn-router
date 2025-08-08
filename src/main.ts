import { inspect } from 'node:util';
import { cors, RouterOptions, Router } from 'itty-router';
import type { Request as UndiciRequestType } from 'undici';
import type {
  AFRContextArgs,
  InternalObjects,
  AppwriteContext,
  AppwriteRequest,
  AppwriteResponse,
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
 * CORS preflight middleware for itty-router (to use in before[])
 */
export async function corsPreflightMiddleware(
  req: AppwriteRequest,
  res: AppwriteResponse,
  log: DefaultLogger,
  error: ErrorLogger,
  internals: InternalObjects & {
    preflight: (req: UndiciRequestType) => Response | undefined;
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
 * CORS finalization middleware for itty-router (to use in finally[])
 */
export async function corsFinallyMiddleware(
  responseFromRoute: any,
  request: AppwriteRequest,
  res: AppwriteResponse,
  log: DefaultLogger,
  error: ErrorLogger,
  internals: InternalObjects & {
    corsify: (res: Response, req: UndiciRequestType) => Response;
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
 * Internal Itty Router middlewares (e.g. preflight/corsify) can access the native Request object (Fetch API) via a fifth argument corresponding to `InternalObjects`.
 */
export function createRouter({
  ...args
}: RouterOptions<
  WrapperRequestType,
  [AppwriteResponse, DefaultLogger, ErrorLogger, InternalObjects] & any[]
> = {}) {
  return Router<
    WrapperRequestType,
    [AppwriteResponse, DefaultLogger, ErrorLogger, InternalObjects] & any[],
    AppwriteResponse
  >({
    ...args,
  });
}

/**
 * @internal
 * Normalizes Appwrite request headers (case-insensitive keys).
 *
 * You can use either `Authorization` or `authorization` keys in your handlers, for example.
 */
export function normalizeHeaders(req: AppwriteRequest) {
  if (req && req.headers && typeof req.headers === 'object') {
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
}

/**
 * @internal
 * Builds the final options from user options and environment.
 */
export function buildFinalOptions(
  options: Options,
  apwLog: DefaultLogger,
  apwError: ErrorLogger
): Options {
  const isNotProduction = process.env.NODE_ENV !== 'production';
  return {
    globals: options.globals ?? true,
    env: options.env ?? true,
    log: options.log ?? isNotProduction,
    errorLog: options.errorLog ?? isNotProduction,
    ...options,
  };
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
  if (process.env.NODE_ENV !== 'production') {
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
  let nativeRequest: Request;
  if (typeof Request !== 'undefined') {
    nativeRequest = new Request(url, { headers, method });
  } else {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { Request: UndiciRequest } = require('undici');
      nativeRequest = new UndiciRequest(url, { headers, method });
    } catch {
      throw new Error(
        'No compatible Request constructor found in this environment.'
      );
    }
  }

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
 * Centralized error handling for handleRequest.
 */
export function handleRequestError(
  err: unknown,
  finalOptions: Options,
  req: AppwriteRequest,
  res: AppwriteResponse,
  log: DefaultLogger,
  error: ErrorLogger,
  internals?: InternalObjects
) {
  log(`[appwrite-fn-router] handleRequestError triggered: ${inspect(err)}`);
  if (typeof finalOptions.ittyOptions.catch === 'function') {
    finalOptions.ittyOptions.catch(err, req, res, log, error, internals);
  } else if (process.env.NODE_ENV !== 'production') {
    // Show the real error in development
    // eslint-disable-next-line no-console
    console.error('[appwrite-fn-router] Unhandled error:', err);
  }
  finalOptions.errorLog &&
    error(
      `\n[router] Function has failed: ${err instanceof Error ? err.stack : String(err)}`
    );
  const message = err instanceof Error ? err.message : String(err);
  if (
    ['/json', '/ld+json'].some((type) =>
      req.headers['content-type']?.endsWith(type)
    )
  ) {
    return res.json(
      {
        status: 'error',
        message,
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

export async function handleRequest(
  context: AppwriteContext,
  withRouter: (router: ReturnType<typeof createRouter>) => void,
  options: Options = {}
) {
  let { req, res, log: apwLog, error: apwError } = context;
  let finalOptions: Options = {};
  let log: (...args: any[]) => void = () => {};
  let error: (...args: any[]) => void = () => {};

  try {
    normalizeHeaders(req);

    finalOptions = buildFinalOptions(options, apwLog, apwError);
    finalOptions.log && apwLog('[router] Function is starting...');

    log = finalOptions.log ? apwLog : () => {};
    error = finalOptions.errorLog ? apwError : () => {};
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
    log(
      '[DEBUG] router.routes (after withRouter call):',
      JSON.stringify(
        router.routes,
        (k, v) =>
          typeof v === 'function' ? `[Function: ${v.name || 'anonymous'}]` : v,
        2
      )
    );

    const response = await runRouter(router, { req, res, log, error });

    log('-------- Response from router:');
    log(inspect(response, { depth: null }));

    if (!response) {
      return res.text('Not Found', 404);
    }
    return response;
  } catch (err) {
    // As we’re handling a thrown error which breaks free of the routing cycle,
    // there is no `internals` object available here (e.g. no `internals.request`,
    // although you shouldn’t need it anyway as everything about the request is
    // readily available through `req`).
    return handleRequestError(err, finalOptions, req, res, log, error);
  }
}
