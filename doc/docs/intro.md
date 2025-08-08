---
title: ''
slug: /
sidebar_position: 1
---

<h1 style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
  <img src="/img/afr-logo-maze.png" alt="Logo" style={{height: '2.2em', marginRight: '0.2em', verticalAlign: 'middle'}} />
  <p style={{margin: 0}}>Appwrite Function Router</p>
</h1>

**This library is a wrapper for [Itty’s `Router`](https://itty.dev/itty-router/concepts), tailored to the constraints of [Appwrite’s FaaS](https://appwrite.io/docs/products/functions/develop) implementation.**

---

[Appwrite Functions](https://appwrite.io/products/functions) provide a powerful way to extend your backend, but they lack a built-in routing system.

This means that handling different URL paths or HTTP methods often requires complex if/else blocks, which can quickly become difficult to manage. Not every function benefits from being atomic, there are many use-cases and reasons for a multi-endpoints function handler: saving on execution costs, consolidating an API surface area, aiming for a smoother maintenance, etc.

This library solves that problem by bringing a simple yet powerful routing layer to your Appwrite Functions. It wraps the popular and lightweight [itty-router](https://itty.dev/itty-router/), allowing you to define clear and declarative routes for your functions.

The library automatically handles the conversion between [Appwrite's function context](https://appwrite.io/docs/products/functions/develop#context-object) and the standard [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request)/[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) objects used by the router, so you can focus on writing your application logic. It also takes care of implementation details such as CORS configuration, TypeScript typings, and whatnot.

## In a nutshell

```ts
// highlight-start
import type { Context, JSONObject, ResponseObject } from "appwrite-fn-router"
import { handleRequest } from "appwrite-fn-router";
import { myRouteHandler } from "./routes";
// highlight-end

// highlight-start
// Optionally define a custom JSON response schema:
type MyJSONResponse = {
  status: 'success' | 'error';
  message: string;
  error?: string;
} & JSONObject;
// highlight-end

// This async function is your regular Appwrite’s mandatory function handler:
export default async (context: Context) => {
  // One may leverage Appwrite’s provided context properties if need be:
  // const { req, res, log, error } = context;

  // Your job is to call handleRequest with both Appwrite’s context,
  // and a callback defining route handlers returning Appwrite’s ResponseObject
  // values (usually crafted using Appwrite’s res helper methods).
  // highlight-next-line
  return handleRequest(context, (router) => {
    // In a route handler, request is a native Request object, while req is the
    // Appwrite’s specific request flavor. You also get access to the rest of
    // Appwrite’s function’s context: res, log and error objects. Having all of
    // these as arguments allows for importing route handlers defined outside
    // this very closure (see myRouteHandler below).
    // highlight-start
    router.get('/hello', (request, req, res, log, error) => {
      return res.json({
        status: 'success',
        message: 'Hello, world!',
      }) satisfies ResponseObject<MyJSONResponse>;
    });
    // highlight-end

    // A route handler may be asynchronous, as long as it eventually returns an
    // Appwrite’s ResponseObject.
    // highlight-start
    router.post('/data', async (request, req, res, log, error) => {
      const data = await req.bodyJson;
      return res.json({
        received: data,
      });
    });
  // highlight-end

    // Despite being defined outside the closure, myRouteHandler still has
    // access to the function’s context, through it’s params. How handy!
    // highlight-start
    router.get("/mystery", myRouteHandler);
  }
  // highlight-end
);
```
