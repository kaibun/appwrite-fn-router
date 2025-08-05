---
sidebar_position: 3
---

# `runRouter`

The `runRouter` function is responsible for executing the router against an incoming request from the Appwrite environment. It constructs a standard `Request` object from the Appwrite context and passes it to the router's `fetch` method.

:::caution
This function is currently not used directly in the main `handleRequest` flow and is kept for potential future use or for advanced scenarios where you might need to run a router instance manually. The core request handling logic is integrated within `handleRequest`.
:::

## Signature

```typescript
async function runRouter(
  router: ReturnType<typeof createRouter>,
  context: AppwriteContext
): Promise<AppwriteResponseObject>;
```

-   `router`: An instance of the router created with `createRouter`.
-   `context`: The Appwrite function context (`req`, `res`, `log`, `error`).

## Usage

If you need to manually invoke the router, you can use `runRouter` like this:

```typescript
import { createRouter, runRouter, handleRequest } from 'appwrite-fn-router';

export default async (context) => {
  // This is a simplified example. 
  // In a real-world scenario, you would use handleRequest.
  
  const router = createRouter();
  router.get('/', () => ({ message: 'Manual router execution!' }));

  const response = await runRouter(router, context);
  
  // The response is already an AppwriteResponseObject, but you might
  // need to manually send it if you are outside handleRequest.
  context.res.send(response.body, response.statusCode, response.headers);
};
```
