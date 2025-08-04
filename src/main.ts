import { AutoRouter, IRequestStrict } from 'itty-router';
import type {
  Context as AppwriteContext,
  JSONObject,
  ResponseObject as AppwriteResponseObject,
  Request as AppwriteRequest,
  Response as AppwriteResponse,
  DefaultLogger,
  ErrorLogger,
} from './env.d.ts';

type RouterJSONResponse = {
  status: 'success' | 'error';
  message: string;
  error?: string;
} & JSONObject;

export type Options = {
  globals?: boolean;
  env?: boolean;
  log?: boolean;
  onError?: (err: unknown) => void;
};

const $ = globalThis;

// Creating an AutoRouter instance, adjusting types to match the Appwrite context
export function createRouter() {
  return AutoRouter<
    AppwriteRequest & IRequestStrict,
    [AppwriteResponse, DefaultLogger, ErrorLogger] & any[],
    AppwriteResponseObject
  >();
}

// Exporting a function to run the router with Appwrite's context
export async function runRouter(
  router: ReturnType<typeof createRouter>,
  { req, res, log, error }: AppwriteContext
) {
  // Passing along the request and misc. objects from the Appwrite context
  return await router.fetch(req, { res, log, error });
}

export async function handleRequest(
  { req, res, log, error }: AppwriteContext,
  // Accepting a function that receives the router instance, so the end-user
  // may define their own routes, customize that router’s behavior, etc.
  withRouter: (router: ReturnType<typeof createRouter>) => void,
  options: Options = { globals: true, env: true, log: true }
) {
  options.log && log('[router] Function is starting...');
  try {
    if (options.globals) {
      globalThis.log = log;
      globalThis.error = error;
    }
    if (options.env) {
      process.env.APPWRITE_FUNCTION_API_KEY =
        req.headers['x-appwrite-key'] || '';
    }
    // console.log(JSON.stringify(process.env, null, 2));
    const router = createRouter();
    withRouter(router);
    return runRouter(router, { req, res, log, error });
  } catch (err) {
    // TODO: support reporting to a monitoring service
    options.log &&
      error(
        `[router] Function has failed: ${err instanceof Error ? err.stack : String(err)}`
      );
    const message = err instanceof Error ? err.message : String(err);
    if (options.onError) {
      return options.onError(err);
    }
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
