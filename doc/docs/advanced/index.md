# Advanced Usage

This page documents subtle or advanced aspects of the library, both for contributors and advanced users.

## Actual Type of `req` in Handlers & Extensibility

Although the first argument of callbacks is often referred to as an `AppwriteRequest`, the actual type is `AFRRequest`, which is `AppwriteRequest` extended with itty-router's `IRequest` so that the `req` object plays nice with the internal router.

This means properties like `params`, `route`, etc. are available at runtime, even if not present in the base `AppwriteRequest` type. This feature is provided by [itty-router](https://itty.dev/itty-router/getting-started).

You may extend `AFRRequest` further, adding properties that need to be exposed to handlers.

```ts
// 1. Define your extended type.
type MyRequest = AFRRequest & { user?: { id: string } };

// 2. Your Appwrite function entrypoint.
export default async function main(context) {
  // You can enrich req with any property you want.
  const req = context.req as MyRequest;
  // For example, attach a user object after authentication:
  req.user = { id: 'user-123' };

  // Pass the enriched req (and the rest of the context) to handleRequest.
  return await handleRequest({ ...context, req }, (router) => {
    // Accessing URL params is always a possibility
    router.get('/:id', (req, res) => {
      const { id } = req.params;
      return res.json({ id });
    });

    // And now you can use your custom property in your handler, for req is of
    // type MyRequest.
    router.get('/me', (req, res) => {
      if (!req.user) return res.json({ error: 'Not logged in' }, 401);
      return res.json({ userId: req.user.id });
    });
  });
}
```

## Global Header Normalization

Headers are automatically normalized (case-insensitive keys) before reaching handlers. This means you can always use `req.headers['Authorization']` or `req.headers['authorization']` interchangeably in your handlers, regardless of the environment (Node.js, Appwrite, etc.).

```ts
router.get('/secret', (req, res) => {
  const token = req.headers['Authorization'];
  // Same as req.headers['authorization'] so pick the one you prefer.
  if (!token) return res.json({ error: 'Unauthorized' }, 401);
  return res.json({ secret: true });
});
```

## The Fifth Argument: `internals`

All callbacks/handlers (not just middlewares) technically receive a fifth argument, `internals`, which exposes a replica of the native `Request` as `internals.request`.

However, this is an internal detail of itty-router and the library. The `internals.request` object is only a best-effort replica of the original request received by the Appwrite runtime (which does not transmit the native Request to the function). **There is no reason for end-users to rely on this argument in their code; it is only used internally by the library for CORS and similar features.**
