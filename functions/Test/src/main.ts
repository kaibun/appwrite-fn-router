import { inspect } from 'node:util';

import type { Context, JSONObject } from './lib/env.d.ts';
import {
  createRouter,
  handleRequest,
  tracePrototypeChainOf,
} from './lib/main.ts';
import widgetsRouter from './routes/widgets.ts';

// Optionally define a custom JSON response schema:
export type MyJSONResponse = {
  status: 'success' | 'error';
  message: string;
  error?: string;
} & JSONObject;

function routes(router: ReturnType<typeof createRouter>) {
  // TODO: test with an async/await handler as well

  router.get('/', (_request, _req, res, log, _error) => {
    // log('\n--- Root route hit:');
    // log(inspect(res));
    const response = res.text('Root route hit!');
    // log('  -');
    // log(tracePrototypeChainOf(response));
    // log(inspect(response, { depth: null }));
    // log('---');
    return response;
  });

  router.all('/widgets*', widgetsRouter.fetch);

  // router.all('*', (_request, _req, res, log, _error) => {
  //   log('\n--- Catchall route hit:');
  //   log(inspect(res));
  //   const response = res.text('Catchall route!', 201, {
  //     'Content-Type': 'text/plain',
  //   });
  //   log('  -');
  //   log(tracePrototypeChainOf(response));
  //   log(inspect(response, { depth: null }));
  //   log('---');
  //   const response = res.text('Catchall route!', 404, {
  //     'Content-Type': 'text/plain',
  //   });
  //   return response;
  // });

  //   router.get('/hello', (req, res, _log, _error) => {
  //     return res.json({
  //       status: 'success',
  //       message: 'Hello, world!',
  //     }) satisfies ResponseObject<MyJSONResponse>;
  //   });
  //   router.post('/mirror', async (req, res, _log, _error) => {
  //     const data = await req.bodyJson;
  //     return res.json({
  //       received: data,
  //     });
  //   });
  //   router.get('/mystery', myRouteHandler);
}

// TODO: publish a lib allowing to whitelist/blacklist well-known URIs
// CSV is available at https://www.iana.org/assignments/well-known-uris/well-known-uris.xhtml
// For now, let’s brute-force ignore any request starting with these paths:
const ignoredRoutes = ['/favicon.ico', '/robots.txt', '/.well-known/'];

/**
 * Test function
 */
export default async (context: Context) => {
  const { req, res, log, error } = context;
  let greetings = `${req.method} ${req.path}`;
  // log(inspect(req, { depth: null }));
  // log('---\n');
  const ignoreRoute = ignoredRoutes.some((route) => req.path.startsWith(route));
  if (ignoreRoute) {
    log(greetings + ' (ignored)\n');
    // TODO: abide by request’s Accept header (fallback to Content-type, then to text/plain)
    return res.text("I'm a teapot", 418);
  }
  log(greetings);

  const response = await handleRequest(context, routes, {
    log: false,
    errorLog: true,
  });

  // log('\nFINAL RESPONSE:');
  // log(tracePrototypeChainOf(response));
  log(inspect(response, { depth: null }));
  // log(response.constructor.name);
  // log(response.constructor.toString());
  // Object.keys(response).forEach((key) => {
  //   log(`Key: ${key}`);
  // });
  // Object.getOwnPropertyNames(response).forEach((key) => {
  //   log(`Prop: ${key}`);
  // });
  log(response.statusCode.toString());
  log(response.body!.toString());
  // log(JSON.stringify(response.headers));
  // log('--- LEAVING THE FUNCTION HANDLER ---');
  log('\n');

  return response;
};
