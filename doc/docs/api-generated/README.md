@kaibun/appwrite-fn-router / [Exports](modules.md)

# Appwrite Function Router

This library is a wrapper for [Itty’s `AutoRouter`](https://itty.dev/itty-router/concepts), tailored to the constraints of [Appwrite’s FaaS](https://appwrite.io/docs/products/functions/develop) implementation.

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

## Local development

### Testing

> Reference: https://appwrite.io/blog/post/functions-local-development-guide

Prerequisites:

- [Docker](https://www.docker.com/) is installed and running
- `npm install -g appwrite-cli@latest`
- `appwrite login` (_no need to "appwrite init project" etc. it’s all setup already_)

The [./functions/Test/](https://github.com/kaibun/appwrite-fn-router/tree/main/functions/Test/) folder contains an Appwrite function you may run to test against the library code developped in [./src/](https://github.com/kaibun/appwrite-fn-router/tree/main/src/).

The strategy is kinda brut-force: copy the library code (./src) over to ./function/Test/src/lib, then run the function with `npm install && npm run build` as its setup command within the container, which will ensure the library code is globally available, thus callable by the function handler.

```sh
npm run test # copy the library code over and run the function locally with Docker
```
