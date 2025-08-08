# Internals & Advanced Usage

This page documents subtle or advanced aspects of the library, both for contributors and advanced users.

## 1. Actual Type of `req` in Handlers & Extensibility

Although the public type is `AppwriteRequest`/`Request`, the object received in route handlers is actually a `WrapperRequestType` (a merge of your type and itty-router's `IRequest`).

This means properties like `params`, `route`, etc. are available at runtime, even if not present in the base AppwriteRequest type. This feature is provided by [itty-router](https://itty.dev/itty-router/getting-started).

`WrapperRequestType` is also designed to evolve if more dynamic properties need to be exposed to handlers. You can extend it for your own needs:

### Example

```ts
// 1. Define your extended type
type MyRequest = WrapperRequestType & { user?: { id: string } };

// 2. Your Appwrite function entrypoint
export default async function main(context) {
  // You can enrich req with any property you want before passing it to handleRequest
  const req = context.req as MyRequest;
  // For example, attach a user object after authentication:
  req.user = { id: 'user-123' };

  // Pass the enriched req (and the rest of the context) to handleRequest
  return await handleRequest({ ...context, req }, (router) => {
    // Accessing URL params is always a possibility
    router.get('/:id', (req, res) => {
      const { id } = req.params;
      return res.json({ id });
    });

    // And now you can use your custom property in your handler
    router.get('/me', (req: MyRequest, res) => {
      if (!req.user) return res.json({ error: 'Not logged in' }, 401);
      return res.json({ userId: req.user.id });
    });
  });
}
```

## 2. Global Header Normalization

Headers are automatically normalized (case-insensitive keys) before reaching handlers. This means you can always use `req.headers['Authorization']` or `req.headers['authorization']` interchangeably in your handlers, regardless of the environment (Node.js, Appwrite, etc.).

### Example

```ts
router.get('/secret', (req, res) => {
  const token = req.headers['Authorization'];
  // Same as req.headers['authorization'] so pick the one you prefer.
  if (!token) return res.json({ error: 'Unauthorized' }, 401);
  return res.json({ secret: true });
});
```

## 3. Fifth Argument: `internals` (for advanced/internal use only)

All callbacks/handlers (not just middlewares) technically receive a fifth argument, `internals`, which exposes a replica of the native `Request` as `internals.request`.

However, this is an internal detail of itty-router and the library. The `internals.request` object is only a best-effort replica of the original request received by the Appwrite runtime (which does not transmit the native Request to the function). There is no reason for end-users to rely on this argument in their code; it is only used internally by the library for CORS and similar features.

## 4. Dynamic Option Merging

Options passed to `handleRequest` are merged with environment-dependent defaults (e.g., logging, error handling), making the library robust in both dev and prod. See [Options](../usage/handleRequest.md#options).

### Example

```ts
handleRequest(context, withRouter, {
  log: false, // disables logging
  cors: {
    allowedOrigins: [/^https:\/\/mydomain\.com$/],
    allowHeaders: ['Authorization', 'Content-Type'],
  },
});
```

## 5. Centralized Error Handling

Unhandled errors in handlers are processed by a central function, which respects the request's `Content-Type` (returns JSON or text accordingly).

### Example

```ts
handleRequest(context, withRouter, {
  onError: (err) => {
    // Custom error logging or reporting.
    console.error('Custom error handler:', err);
  },
});
```
