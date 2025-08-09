import { inspect } from 'node:util';

import type {
  AppwriteContext,
  CatchHandler,
} from '@kaibun/appwrite-fn-router/types';
import { createRouter, handleRequest } from '@kaibun/appwrite-fn-router';
import widgetsRouter from './routes/widgets.ts';
import errorsRouter from './routes/errors.ts';

// Optionally define a custom JSON response schema:
// Already available as RouterJSONResponse from the core library

function routes(router: ReturnType<typeof createRouter>) {
  // TODO: test with an async/await handler as well

  router.get('/', (_request, res, log, _error) => {
    return res.text('Root route hit!');
  });
  router.all('/widgets*', widgetsRouter.fetch);
  router.all('/errors*', errorsRouter.fetch);
}

// TODO: publish a lib allowing to whitelist/blacklist well-known URIs
// CSV is available at https://www.iana.org/assignments/well-known-uris/well-known-uris.xhtml
// For now, let’s brute-force ignore any request starting with these paths:
// TODO: use a route handler to handle these (but can a route handler match
// on a list or regex?)
const ignoredRoutes = ['/favicon.ico', '/robots.txt', '/.well-known/'];

/**
 * Test function
 */
export default async (context: AppwriteContext) => {
  const { req, res, log, error } = context;
  let greetings = `${req.method} ${req.path}`;
  // log(inspect(req, { depth: null }));
  // log('---\n');
  const ignoreRoute = ignoredRoutes.some((route) => req.path.startsWith(route));
  if (ignoreRoute) {
    log(greetings + ' (ignored)');
    // TODO: abide by request’s Accept header (fallback to Content-type, then to text/plain)
    return res.text("I'm a teapot", 418);
  }
  log(greetings + '\n');

  const CatchHandler: CatchHandler = (err, req, res, log, error, internals) => {
    log(err ? inspect(err) : 'Unknown error');
    // Catching E2E tests’ errors.
    if (req.path.startsWith('/errors')) {
      return res.json(
        {
          status: 'error',
          message: 'E2E_CUSTOM_ERROR_TRIGGERED',
          error: err instanceof Error ? err.message : String(err),
        },
        500
      );
    }
    throw err; // Otherwise, re-throw to trigger library’s default error handling.
  };

  const response = await handleRequest(context, routes, {
    logs: process.env.NODE_ENV === 'development',
    cors: {
      allowHeaders: ['Content-Type', 'Authorization', 'X-widget-user-id'],
    },
    ittyOptions: {
      catch: CatchHandler,
    },
  });

  // log('\nFINAL RESPONSE:');
  log(inspect(response, { depth: null }));
  // log(response.constructor.name);
  // log(response.constructor.toString());
  // Object.keys(response).forEach((key) => {
  //   log(`Key: ${key}`);
  // });
  // Object.getOwnPropertyNames(response).forEach((key) => {
  //   log(`Prop: ${key}`);
  // });
  // log(response.statusCode.toString());
  // log(response.body!.toString());
  // log(JSON.stringify(response.headers));
  // log('--- LEAVING THE FUNCTION HANDLER ---');
  log('\n');

  return response;
};
