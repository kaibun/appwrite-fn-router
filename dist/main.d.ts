import * as itty_router from 'itty-router';
import { IRequest, RouterOptions } from 'itty-router';
import { Request as Request$2 } from 'undici';

// Core types for Appwrite Functions and itty-router integration



type DefaultLogger = (message: string) => void;
type ErrorLogger = (message: string) => void;

type InternalObjects = {
  request: Request$2;
};

type Headers = Record<string, string>;
type JSONObject = Record<string, unknown>;

type ResponseObject<T = any> = {
  body: T;
  headers: Headers;
  statusCode: number;
  toString(): string;
};

type Options = {
  globals?: boolean;
  env?: boolean;
  log?: boolean;
  errorLog?: boolean;
  catch?: (
    err: unknown,
    req: AppwriteRequest,
    res: AppwriteResponse,
    log: DefaultLogger,
    error: ErrorLogger,
    internals?: InternalObjects
  ) => void;
  cors?: {
    allowedOrigins?: (string | RegExp)[];
    allowMethods?: string[];
    allowHeaders?: string[];
  };
};

type Request$1 = {
  get body(): JSONObject | string;
  get bodyRaw(): string;
  get bodyText(): string;
  get bodyJson(): JSONObject;
  get bodyBinary(): Buffer;
  headers: Headers;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
  host: string;
  scheme: 'http' | 'https';
  query: JSONObject;
  queryString: string;
  port: string;
  url: string;
  path: string;
};

type BufferFromArgTypes = Parameters<typeof Buffer.from>[0];
type Response$1 = {
  send: (
    body: string,
    statusCode?: number,
    headers?: Headers
  ) => ResponseObject<string>;
  text: (
    body: string,
    statusCode?: number,
    headers?: Headers
  ) => ResponseObject<string>;
  binary: (
    data: BufferFromArgTypes,
    statusCode?: number,
    headers?: Headers
  ) => ResponseObject<string>;
  json<DataType = JSONObject>(
    data: DataType,
    statusCode?: number,
    headers?: Headers
  ): ResponseObject<DataType>;
  empty: () => ResponseObject;
  redirect: (
    url: string,
    statusCode?: number,
    headers?: Headers
  ) => ResponseObject<string>;
};

type Context = {
  req: Request$1;
  res: Response$1;
  log: DefaultLogger;
  error: ErrorLogger;
};

/**
 * itty-router injects properties at runtime, such as params, query and route. TypeScript has to know about that to avoid type errors in route handlers.
 * @see https://github.com/kwhitley/itty-router/blob/v5.x/src/Router.ts
 */
type WrapperRequestType = IRequest & AppwriteRequest;

// Global type declarations for the library



declare global {
  var log: DefaultLogger;
  var error: ErrorLogger;

  namespace NodeJS {
    interface ProcessEnv {
      APPWRITE_FUNCTION_API_ENDPOINT: string;
      APPWRITE_FUNCTION_PROJECT_ID: string;
      APPWRITE_FUNCTION_API_KEY: string;
      //   APPWRITE_DATABASE_ID: string;
      //   APPWRITE_COLLECTION_ID: string;
    }
  }
}

/**
 * @internal
 * Middleware CORS preflight pour itty-router (à utiliser dans before[])
 */
declare function corsPreflightMiddleware(req: Request$1, res: Response$1, log: DefaultLogger, error: ErrorLogger, internals: InternalObjects & {
    preflight: (req: Request) => Response | undefined;
}): Promise<ResponseObject<string> | undefined>;
/**
 * @internal
 * Middleware CORS finalisation pour itty-router (à utiliser dans finally[])
 */
declare function corsFinallyMiddleware(responseFromRoute: any, request: Request$1, res: Response$1, log: DefaultLogger, error: ErrorLogger, internals: InternalObjects & {
    corsify: (res: Response, req: Request) => Response;
}): Promise<ResponseObject<string> | undefined>;
/**
 * Le routeur propage une signature standard Appwrite aux handlers :
 * `req, res, log, error` typés `AppwriteRequest`, `AppwriteResponse`,
 * `DefaultLogger`, `ErrorLogger` respectivement.
 *
 * Les middlewares internes à Itty Router (par ex. preflight/corsify) peuvent
 * eux accéder à l’objet Request natif (Fetch API) via un cinquième argument
 * correspondant à `FetchObjects`.
 */
declare function createRouter({ ...args }?: RouterOptions<WrapperRequestType, [
    Response$1,
    DefaultLogger,
    ErrorLogger,
    InternalObjects
] & any[]>): itty_router.RouterType<any, [Response$1, DefaultLogger, ErrorLogger, InternalObjects] & any[], Response$1>;
/**
 * @internal
 * Normalise les headers d'une requête Appwrite (clés insensibles à la casse).
 *
 * Vous pouvez ainsi utiliser indifféremment les clés `Authorization` ou
 * `authorization` dans vos handlers, par exemple.
 */
declare function normalizeHeaders(req: Request$1): void;
/**
 * @internal
 * Construit les options finales à partir des options utilisateur et de
 * l'environnement.
 */
declare function buildFinalOptions(options: Options, apwLog: DefaultLogger, apwError: ErrorLogger): Options;
/**
 * @internal
 * Propage les fonctions de logging d’Appwrite dans le contexte global, si
 * demandé.
 */
declare function setupGlobalLoggers(finalOptions: Options, log: DefaultLogger, error: ErrorLogger): void;
/**
 * @internal
 * Met à jour la variable d'environnement `APPWRITE_FUNCTION_API_KEY`, si
 * demandé.
 */
declare function setupEnvVars(finalOptions: Options, req: Request$1): void;
/**
 * @internal
 * Active la configuration CORS dynamique.
 */
declare function buildCorsOptions(finalOptions: Options): {
    origin: (origin: string) => string | undefined;
    allowMethods: string[];
    allowHeaders: string[];
};
/**
 * Exécute le routeur avec le contexte Appwrite, ainsi qu’une `Request` native
 * pour le bon fonctionnement de CORS, etc. dans le routeur Itty.
 */
declare function runRouter(router: ReturnType<typeof createRouter>, { req, res, log, error }: Context): Promise<Response$1>;
/**
 * @internal
 * Gestion d’erreur centralisée pour handleRequest.
 */
declare function handleRequestError(err: unknown, finalOptions: Options, req: Request$1, res: Response$1, log: DefaultLogger, error: ErrorLogger): ResponseObject<string> | ResponseObject<{
    status: "error";
    message: string;
    error: string;
}>;
declare function handleRequest(context: Context, withRouter: (router: ReturnType<typeof createRouter>) => void, options?: Options): Promise<Response$1 | ResponseObject<string> | ResponseObject<{
    status: "error";
    message: string;
    error: string;
}>>;

export { buildCorsOptions, buildFinalOptions, corsFinallyMiddleware, corsPreflightMiddleware, createRouter, handleRequest, handleRequestError, normalizeHeaders, runRouter, setupEnvVars, setupGlobalLoggers };
