import { inspect } from 'node:util';
import { cors, RouterOptions, Router } from 'itty-router';
import type {
  AFRContextArgs,
  InternalObjects,
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
 * Middleware CORS preflight pour itty-router (à utiliser dans before[])
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
 * Middleware CORS finalisation pour itty-router (à utiliser dans finally[])
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
 * Le routeur propage une signature standard Appwrite aux handlers :
 * `req, res, log, error` typés `AppwriteRequest`, `AppwriteResponse`,
 * `DefaultLogger`, `ErrorLogger` respectivement.
 *
 * Les middlewares internes à Itty Router (par ex. preflight/corsify) peuvent
 * eux accéder à l’objet Request natif (Fetch API) via un cinquième argument
 * correspondant à `FetchObjects`.
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
 * Normalise les headers d'une requête Appwrite (clés insensibles à la casse).
 *
 * Vous pouvez ainsi utiliser indifféremment les clés `Authorization` ou
 * `authorization` dans vos handlers, par exemple.
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
 * Construit les options finales à partir des options utilisateur et de
 * l'environnement.
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
 * Propage les fonctions de logging d’Appwrite dans le contexte global, si
 * demandé.
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
 * Met à jour la variable d'environnement `APPWRITE_FUNCTION_API_KEY`, si
 * demandé.
 */
export function setupEnvVars(finalOptions: Options, req: AppwriteRequest) {
  if (finalOptions.env) {
    process.env.APPWRITE_FUNCTION_API_KEY = req.headers['x-appwrite-key'] || '';
  }
}

/**
 * @internal
 * Active la configuration CORS dynamique.
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
 * Exécute le routeur avec le contexte Appwrite, ainsi qu’une `Request` native
 * pour le bon fonctionnement de CORS, etc. dans le routeur Itty.
 */
export async function runRouter(
  router: ReturnType<typeof createRouter>,
  { req, res, log, error }: AppwriteContext
) {
  const { headers, method, url } = req;
  const route = new URL(url);

  // Construit la nativeRequest pour usage interne (CORS, etc.)
  let nativeRequest: Request;
  if (typeof Request !== 'undefined') {
    nativeRequest = new Request(route, { headers, method });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Request: UndiciRequest } = require('undici');
    nativeRequest = new UndiciRequest(url, {
      headers,
      method,
    }) as unknown as Request;
  }

  const response = await router.fetch(
    req, // AppwriteRequest (an itty-router’s RequestLike object)
    res, // AppwriteResponse
    log, // DefaultLogger
    error, // ErrorLogger
    {
      request: nativeRequest, // FetchObjects.FetchRequest ie. a native Request object
    } as InternalObjects
  );
  return response;
}

/**
 * @internal
 * Gestion d’erreur centralisée pour handleRequest.
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
    // Affiche l’erreur réelle en développement
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
    // As we’re handling a thrown error which break free of the routing cycle,
    // there is no `internals` object available here (eg. no `internals.request`,
    // although you shouldn’t need it anyway as everything about the request is
    // readily available through `req`).
    return handleRequestError(err, finalOptions, req, res, log, error);
  }
}
