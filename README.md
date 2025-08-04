# Appwrite Function Router

This library is a wrapper for [Itty’s `AutoRouter`](https://itty.dev/itty-router/concepts), tailored to the constraints of the Appwrite’s FaaS implementation.

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
  handleRequest(context, (router) => {
    // Here’s the fuction’s context back again:
    router.get('/hello', (req, res, _log, _error) => {
      return res.json({
        status: 'success',
        message: 'Hello, world!',
      }) satisfies ResponseObject<MyJSONResponse>;
    });

    router.post('/data', async (req, res, _log, _error) => {
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

## Local development

### Testing

```sh
npm run sync # copy the library files inside functions/Test/src/lib
npm run test # run the function locally with Docker
```

TODO: investigate using `npm link` instead of copying files over, but it’s challenging with Docker.
