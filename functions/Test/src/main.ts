import type { Context, JSONObject, ResponseObject } from './lib/env.d.ts';
import { handleRequest } from './lib/main.ts';
import { myRouteHandler } from './routes.ts';

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

  return await handleRequest(context, (router) => {
    router.get('/hello', (req, res, _log, _error) => {
      return res.json({
        status: 'success',
        message: 'Hello, world!',
      }) satisfies ResponseObject<MyJSONResponse>;
    });

    router.post('/mirror', async (req, res, _log, _error) => {
      const data = await req.bodyJson;
      return res.json({
        received: data,
      });
    });

    router.get('/mystery', myRouteHandler);
  });
};
