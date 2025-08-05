import { inspect } from 'node:util';
import { AutoRouter, IRequest } from 'itty-router';
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

// Creating an AutoRouter instance, adjusting types to match the Appwrite context
export function createRouter() {
  return AutoRouter<
    // AppwriteRequest & IRequestStrict,
    IRequest,
    [AppwriteRequest, AppwriteResponse, DefaultLogger, ErrorLogger] & any[],
    AppwriteResponseObject
  >();
}

// Exporting a function to run the router with Appwrite's context
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
  options: Options = { globals: true, env: true, log: true }
) {
  const { req, res, log, error } = context;
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

    // Calling router.fetch, passing along the request and the Appwrite context.

    // Version 1: .then() chaining
    // return router
    //   .fetch(
    //     // request, // IRequest
    //     req,
    //     req, // The original Appwrite’s Request
    //     res, // The original Appwrite’s Response
    //     log,
    //     error // The original Appwrite’s ErrorLogger
    //   )
    //   .then((response) => {
    //     log('\n[router] Router has fetched with result:');
    //     log(tracePrototypeChainOf(response));
    //     log(inspect(response, { depth: null }));
    //     Object.getOwnPropertyNames(response).forEach((key) => {
    //       log(`Key: ${key}`);
    //     });
    //   });

    // Version 2: awaiting the router's fetch method
    const response = await router.fetch(
      // request, // IRequest
      req,
      req, // The original Appwrite’s Request
      res, // The original Appwrite’s Response
      log,
      error // The original Appwrite’s ErrorLogger
    ); // satisfies AppwriteResponseObject;
    log('\n[router] Router has fetched with result:');
    log(tracePrototypeChainOf(response));
    log(inspect(response, { depth: null }));
    Object.getOwnPropertyNames(response).forEach((key) => {
      log(`Key: ${key}`);
    });
    return response;
  } catch (err) {
    // TODO: support reporting to a monitoring service
    options.log &&
      error(
        `\n[router] Function has failed: ${err instanceof Error ? err.stack : String(err)}`
      );
    const message = err instanceof Error ? err.message : String(err);
    // if (options.onError) {
    //   return options.onError(err);
    // }
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
