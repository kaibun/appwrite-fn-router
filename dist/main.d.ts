import * as itty_router from 'itty-router';
import { IRequest, RouterOptions as RouterOptions$1 } from 'itty-router';
import { Request as Request$1 } from 'undici';

// Core types for Appwrite Functions and itty-router integration



type DefaultLogger = (message: string) => void;
type ErrorLogger = (message: string) => void;

type InternalObjects = {
  request: Request$1;
  [key: any]: unknown; // Allows for additional properties to be added dynamically
};

type Headers = Record<string, string>;
type JSONObject = Record<string, unknown>;

type Options = {
  globals?: boolean;
  env?: boolean;
  logs?: logEnableFn | boolean;
  cors?: {
    allowedOrigins?: (string | RegExp)[];
    allowMethods?: string[];
    allowHeaders?: string[];
  };
  ittyOptions?: RouterOptions<
    AFRRequest,
    [AppwriteResponse, DefaultLogger, ErrorLogger, InternalObjects] & any[]
  >;
};

type FinalOptions = Options & { log: boolean; errorLog: boolean };

type AppwriteRequest = {
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
type AppwriteResponse = {
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

type AppwriteContext = {
  req: AppwriteRequest;
  res: AppwriteResponse;
  log: DefaultLogger;
  error: ErrorLogger;
};

/**
 * itty-router injects properties at runtime, such as params, query and route. TypeScript has to know about that to avoid type errors in route handlers. Also, it allows the end-user to inject her own properties. Basically, it’s AppwriteRequest on steroids and fit for itty-router consumption.
 * @see https://github.com/kwhitley/itty-router/blob/v5.x/src/Router.ts
 */
type AFRRequest = AppwriteRequest & IRequest; // & { [key: string]: any };

type logEnableFn = (mode: 'log' | 'errorLog') => boolean;

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
 * Default log activation callback: logs are enabled only in development.
 * Users can override this by passing their own function to handleRequest.
 */
declare const defaultLogFn: logEnableFn;
/**
 * @internal
 * CORS preflight middleware that’s Appwrite-compatible (to be used first in before[]).
 */
declare function corsPreflightMiddleware(req: AppwriteRequest, res: AppwriteResponse, log: DefaultLogger, error: ErrorLogger, internals: InternalObjects & {
    preflight: (req: Request) => Response | undefined;
}): Promise<any>;
/**
 * @internal
 * CORS finalization middleware that’s Appwrite-compatible (to be used last in finally[]).
 */
declare function corsFinallyMiddleware(responseFromRoute: any, request: AppwriteRequest, res: AppwriteResponse, log: DefaultLogger, error: ErrorLogger, internals: InternalObjects & {
    corsify: (res: Response, req: Request) => Response;
}): Promise<any>;
/**
 * The router propagates a standard Appwrite signature to handlers:
 * `req, res, log, error` typed as `AppwriteRequest`, `AppwriteResponse`,
 * `DefaultLogger`, `ErrorLogger` respectively.
 *
 * Internal Itty Router middlewares (e.g. preflight/corsify) can access the
 * native Request object (Fetch API) via a fifth argument corresponding to
 * `InternalObjects`.
 */
declare function createRouter({ ...args }?: RouterOptions$1<AFRRequest, [
    AppwriteResponse,
    DefaultLogger,
    ErrorLogger,
    InternalObjects
] & any[]>): itty_router.RouterType<AFRRequest, [AppwriteResponse, DefaultLogger, ErrorLogger, InternalObjects] & any[], AppwriteResponse>;
/**
 * @internal
 * Normalizes Appwrite request headers as case-insensitive keys, so that you can
 * use either eg. `Authorization` or `authorization` keys in your handlers.
 */
declare function normalizeHeaders(req: AppwriteRequest): void;
/**
 * @internal
 * Builds the final options from user options and environment.
 */
declare function buildFinalOptions(options: Options): FinalOptions;
/**
 * @internal
 * Propagates Appwrite logging functions to the global context, if requested.
 */
declare function setupGlobalLoggers(finalOptions: Options, log: DefaultLogger, error: ErrorLogger): void;
/**
 * @internal
 * Updates the `APPWRITE_FUNCTION_API_KEY` environment variable, if requested.
 */
declare function setupEnvVars(finalOptions: Options, req: AppwriteRequest): void;
/**
 * @internal
 * Enables dynamic CORS configuration.
 */
declare function buildCorsOptions(finalOptions: Options): {
    origin: (origin: string) => string | undefined;
    allowMethods: string[];
    allowHeaders: string[];
};
/**
 * Runs the router with the Appwrite context, as well as a native `Request` for proper CORS, etc. in the Itty router.
 */
declare function runRouter(router: ReturnType<typeof createRouter>, { req, res, log, error }: AppwriteContext): Promise<AppwriteResponse>;
/**
 * @internal
 * Centralized error handling for uncatched exceptions stemming from the router.
 * This function may be circumvented by a custom `catch handler in `ittyOptions`.
 */
declare function handleRequestError(err: unknown, options: FinalOptions, req: AppwriteRequest, res: AppwriteResponse, log: DefaultLogger, error: ErrorLogger): any;
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
declare function handleRequest(context: AppwriteContext, withRouter: (router: ReturnType<typeof createRouter>) => void, options?: Options): Promise<any>;

export { buildCorsOptions, buildFinalOptions, corsFinallyMiddleware, corsPreflightMiddleware, createRouter, defaultLogFn, handleRequest, handleRequestError, normalizeHeaders, runRouter, setupEnvVars, setupGlobalLoggers };
