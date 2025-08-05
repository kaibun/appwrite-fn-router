---
sidebar_position: 4
---

# `runRouter`

The `runRouter` function is responsible for executing the router against an incoming request from the Appwrite environment. It constructs a standard [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object from the Appwrite context and passes it to the [router's `fetch` method](https://itty.dev/itty-router/concepts#whatever-you-pass-to-router-fetch-goes-to-the-handlers).

This function is called internally by `handleRequest` after the router has been configured and your routes have been attached.

## Signature

```typescript
async function runRouter(
  router: ReturnType<typeof createRouter>,
  context: AppwriteContext,
  log: DefaultLogger,
  error: ErrorLogger
): Promise<AppwriteResponseObject>;
```

- `router`: An instance of the router created with `createRouter`.
- `context`: The Appwrite function context (`req`, `res`, `log`, `error`).
- `log`: The logger instance (either the original from Appwrite or a muted one).
- `error`: The error logger instance.

## Usage

You generally don't need to call `runRouter` directly, as `handleRequest` takes care of it for you. The separation exists to keep the setup logic in `handleRequest` distinct from the execution logic in `runRouter`.

However, if you were to use it manually, it would look something like this:

```typescript
import { createRouter, runRouter } from 'appwrite-fn-router';

export default async (context) => {
  const { log, error } = context;

  const router = createRouter();
  router.get('/', () => ({ message: 'Manual router execution!' }));

  // You would need to replicate the setup logic from handleRequest here
  // (e.g., CORS, environment setup, types conversions, etc.)
  // Don’t do that. Use this library!

  const response = await runRouter(router, context, log, error);

  return response;
};
```
