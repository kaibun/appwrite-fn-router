import { inspect } from 'node:util';
import { cors, IRequest, RouterOptions, Router } from 'itty-router';
import type {
  Context as AppwriteContext,
  JSONObject,
  ResponseObject as AppwriteResponseObject,
  Request as AppwriteRequest,
  Response as AppwriteResponse,
  DefaultLogger,
  ErrorLogger,
} from './env.d.ts';
import { before } from 'node:test';

type RouterJSONResponse = {
  status: 'success' | 'error';
  message: string;
  error?: string;
} & JSONObject;

export type Options = {
  globals?: boolean;
  env?: boolean;
  log?: boolean;
  errorLog?: boolean;
  onError?: (err: unknown) => void;
};

const $ = globalThis;

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
// export type WrapperRequestType = AppwriteRequest & IRequest;
export type WrapperRequestType = IRequest;

const { preflight, corsify } = cors();

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
    AppwriteResponseObject
  >({
    ...args,
  });
}

// Exporting a function to run the router with Appwrite's context
// TODO: function is not used anymore, but should be. Reify it, split the other one.
export async function runRouter(
  router: ReturnType<typeof createRouter>,
  { req, res, log, error }: AppwriteContext
) {
  const { headers, method, host, scheme, query, queryString, port, url, path } =
    req;
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
      // request: request.toString(),
    })
  );
  // Passing along the request and misc. objects from the Appwrite context
  // const response = (await router.fetch(request, {
  const response = (await router.fetch(request, {
    req,
    res,
    log,
    error,
  })) as AppwriteResponseObject;
  log('\n[router] Router has fetched with result:');
  log(tracePrototypeChainOf(response));
  log(response.toString());
  Object.getOwnPropertyNames(response).forEach((key) => {
    log(`Key: ${key}`);
  });
  // log(JSON.stringify(response.body));
  // log(response.statusCode.toString());
  // log(JSON.stringify(response.headers));
  // Returning the response object
  // if (result instanceof Response) {
  //   return result;
  // }
  // if (typeof result === 'string') {
  //   return res.text(result);
  // }
  // if (typeof result === 'object' && 'body' in result) {
  //   // Assuming result is of type AppwriteResponseObject
  //   return res.json(result.body, result.statusCode, result.headers);
  // }
  // // Fallback to a simple text response
  // log('[router] Returning a fallback text response');
  // if (typeof result === 'object') {
  //   return res.text(JSON.stringify(result));
  // }
  // if (typeof result === 'number') {
  //   return res.text(String(result));
  // }
  // if (result === null || result === undefined) {
  //   return res.text('No content', 204);
  // }
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
    // console.log(JSON.stringify(process.env, null, 2));
    const router = createRouter({
      before: [
        async (req, req_appwrite, res, log, error) => {
          const response = preflight(req);
          if (response) {
            const body = await response.text();
            const statusCode = response.status;
            const headers = Object.fromEntries(response.headers.entries());
            return res.send(body, statusCode, headers);
          }
        },
      ],
      finally: [
        async (responseFromRoute, request, req_appwrite, res, log, error) => {
          if (responseFromRoute) {
            // Re-create a native Response to be able to pass it to corsify
            const nativeResponse = new Response(responseFromRoute.body, {
              status: responseFromRoute.statusCode,
              headers: responseFromRoute.headers,
            });
            const corsifiedResponse = corsify(nativeResponse, request);

            const body = await corsifiedResponse.text();
            const statusCode = corsifiedResponse.status;
            const headers = Object.fromEntries(
              corsifiedResponse.headers.entries()
            );
            return res.send(body, statusCode, headers);
          }
        },
      ],
      // before: [preflight],
      // finally: [corsify],
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

    // const response = await runRouter(router, { req, res, log, error });
    // log('\n[router] Router has been run');
    // log(response.toString());

    const { headers, method, url } = req;
    const route = new URL(url);
    log('\n[router] Running router with the following request:');
    const request = new Request(route, {
      // const request = new Request(url, {
      // @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
      headers,
      method,
    });
    log(
      JSON.stringify({
        route,
        // url,
        method,
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
    ); // satisfies AppwriteResponseObject;
    apwLog('\n[router] Router has fetched with result:');
    apwLog(inspect(response, { depth: null }));

    if (!response) {
      // TODO: abide by request’s Accept header (fallback to Content-type, then to text/plain)
      return res.text('Not Found', 404);
    }

    apwLog(inspect(response.body!.toString()));
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
