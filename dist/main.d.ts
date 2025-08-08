import * as itty_router from 'itty-router';
import { IRequest, RouterOptions as RouterOptions$1 } from 'itty-router';
import { Request } from 'undici';

// Core types for Appwrite Functions and itty-router integration



type DefaultLogger = (message: string) => void;
type ErrorLogger = (message: string) => void;

type InternalObjects = {
  request: Request;
  [key: any]: unknown; // Allows for additional properties to be added dynamically
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
  cors?: {
    allowedOrigins?: (string | RegExp)[];
    allowMethods?: string[];
    allowHeaders?: string[];
  };
  ittyOptions?: // [key: string]: (
  //   err: unknown,
  //   req: AppwriteRequest,
  //   res: AppwriteResponse,
  //   log: DefaultLogger,
  //   error: ErrorLogger,
  //   internals: InternalObjects
  //   [key: string]: any;
  // ) => void;
  RouterOptions<
    WrapperRequestType,
    [AppwriteResponse, DefaultLogger, ErrorLogger, InternalObjects] & any[]
  >;
};

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
 * CORS preflight middleware for itty-router (to use in before[])
 */
declare function corsPreflightMiddleware(req: AppwriteRequest, res: AppwriteResponse, log: DefaultLogger, error: ErrorLogger, internals: InternalObjects & {
    preflight: (req: Request) => Response | undefined;
}): Promise<ResponseObject<string> | undefined>;
/**
 * @internal
 * CORS finalization middleware for itty-router (to use in finally[])
 */
declare function corsFinallyMiddleware(responseFromRoute: any, request: AppwriteRequest, res: AppwriteResponse, log: DefaultLogger, error: ErrorLogger, internals: InternalObjects & {
    corsify: (res: Response, req: Request) => Response;
}): Promise<ResponseObject<string> | undefined>;
/**
 * The router propagates a standard Appwrite signature to handlers:
 * `req, res, log, error` typed as `AppwriteRequest`, `AppwriteResponse`,
 * `DefaultLogger`, `ErrorLogger` respectively.
 *
 * Internal Itty Router middlewares (e.g. preflight/corsify) can access the native Request object (Fetch API) via a fifth argument corresponding to `InternalObjects`.
 */
declare function createRouter({ ...args }?: RouterOptions$1<WrapperRequestType, [
    AppwriteResponse,
    DefaultLogger,
    ErrorLogger,
    InternalObjects
] & any[]>): itty_router.RouterType<WrapperRequestType, [AppwriteResponse, DefaultLogger, ErrorLogger, InternalObjects] & any[], AppwriteResponse>;
/**
 * @internal
 * Normalizes Appwrite request headers (case-insensitive keys).
 *
 * You can use either `Authorization` or `authorization` keys in your handlers, for example.
 */
declare function normalizeHeaders(req: AppwriteRequest): void;
/**
 * @internal
 * Builds the final options from user options and environment.
 */
declare function buildFinalOptions(options: Options, apwLog: DefaultLogger, apwError: ErrorLogger): Options;
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
 * Centralized error handling for handleRequest.
 */
declare function handleRequestError(err: unknown, finalOptions: Options, req: AppwriteRequest, res: AppwriteResponse, log: DefaultLogger, error: ErrorLogger, internals?: InternalObjects): ResponseObject<string> | ResponseObject<{
    status: "error";
    message: string;
    error: string;
}>;
declare function handleRequest(context: AppwriteContext, withRouter: (router: ReturnType<typeof createRouter>) => void, options?: Options): Promise<AppwriteResponse | ResponseObject<string> | ResponseObject<{
    status: "error";
    message: string;
    error: string;
}>>;

export { buildCorsOptions, buildFinalOptions, corsFinallyMiddleware, corsPreflightMiddleware, createRouter, handleRequest, handleRequestError, normalizeHeaders, runRouter, setupEnvVars, setupGlobalLoggers };
