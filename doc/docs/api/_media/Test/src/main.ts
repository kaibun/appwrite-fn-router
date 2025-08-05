import { inspect } from 'node:util';
import type { Context, JSONObject, ResponseObject } from './lib/env.d.ts';
import { handleRequest, tracePrototypeChainOf } from './lib/main.ts';
// import { myRouteHandler } from './routes.ts';

// Upon build, the `handleRequest` function will be available globally.
// declare global {
//   var handleRequest: typeof import('../../../src/main.ts').handleRequest;
// }

// Optionally define a custom JSON response schema:
export type MyJSONResponse = {
  status: 'success' | 'error';
  message: string;
  error?: string;
} & JSONObject;

/**
 * Test function
 */
export default async (context: Context) => {
  // const { req, res, log, error } = context;

  const toto = await handleRequest(context, (router) => {
    // router.get('/', (req, res, _log, _error) => {
    //   return context.res.text('Hello, world! This is a test function!');
    // });
    // TODO: test with an async/await handler as well

    router.get('/', (_request, _req, res, log, _error) => {
      log('\n--- Root route hit:');
      log(inspect(res));
      const response = res.text('Root route hit!', 201, {
        'Content-Type': 'text/plain',
      });
      log('  -');
      log(tracePrototypeChainOf(response));
      log(inspect(response, { depth: null }));
      log('---');
      return response;
    });

    router.all('*', (_request, _req, res, log, _error) => {
      log('\n--- Catchall route hit:');
      log(inspect(res));
      const response = res.text('Catchall route!', 201, {
        'Content-Type': 'text/plain',
      });
      log('  -');
      log(tracePrototypeChainOf(response));
      log(inspect(response, { depth: null }));
      log('---');
      return response;
    });

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
  });

  context.log('\nFINAL RESPONSE:');
  context.log(tracePrototypeChainOf(toto));
  context.log(inspect(toto, { depth: null }));
  // context.log(toto.constructor.name);
  // context.log(toto.constructor.toString());
  Object.keys(toto).forEach((key) => {
    context.log(`Key: ${key}`);
  });
  Object.getOwnPropertyNames(toto).forEach((key) => {
    context.log(`Prop: ${key}`);
  });
  // context.log(response.body!.toString());
  // context.log(response.statusCode.toString());
  // context.log(JSON.stringify(response.headers));
  context.log('--- End of response ---');

  return toto;

  // return context.res.text('Hello, world! This is a test function!');
  // return context.res.json({
  //   message: 'Hello, world! This is a test function!.',
  // });
};
