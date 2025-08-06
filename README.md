# Appwrite Function Router

This library is a wrapper for [Itty’s `Router`](https://itty.dev/itty-router/concepts), tailored to the constraints of [Appwrite’s FaaS](https://appwrite.io/docs/products/functions/develop) implementation.

## Usage

```ts
import type { Context, JSONObject, ResponseObject } from "appwrite-fn-router"
import { handleRequest } from "appwrite-fn-router";
import { myRouteHandler } from "./routes";

// Optionally define a custom JSON response schema:
type MyJSONResponse = {
  status: 'success' | 'error';
  message: string;
  error?: string;
} & JSONObject;

// This async function is your regular Appwrite’s mandatory function handler:
export default async (context: Context) => {
  // One may leverage Appwrite’s provided context properties if need be:
  // const { req, res, log, error } = context;

  // Those properties would be accessible from within the routes handlers thanks
  // to the JavaScript closure, but one may import handlers from a file, so
  // the best practice here is to  pass that context alongside your routes
  // (defined using Itty’s API): the context is made available to the route
  // handlers):
  return handleRequest(context, (router) => {
    // In a route handler, request is a native Request object, while req is the
    // Appwrite’s specific request flavor. You also get access to the rest of
    // Appwrite’s function’s context: res, log and error objects.
    router.get('/hello', (request, req, res, log, error) => {
      return res.json({
        status: 'success',
        message: 'Hello, world!',
      }) satisfies ResponseObject<MyJSONResponse>;
    });

    router.post('/data', async (request, req, res, log, error) => {
      const data = await req.bodyJson;
      return res.json({
        received: data,
      });
    });

    // Despite being defined outside the closure, myRouteHandler still has
    // access to the function’s context, through it’s params. How handy!
    router.get("/mystery", myRouteHandler);
  });
```

## Local Development

For instructions on how to set up a local development environment with hot-reloading, please see the [**Contributing Guide**](./doc/docs/contributing/index.md).
