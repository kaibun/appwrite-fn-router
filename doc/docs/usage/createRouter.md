---
sidebar_position: 3
---

# `createRouter`

The `createRouter` function is a factory that returns an instance of itty-router’s [`Router`](https://itty.dev/itty-router/routers/), only tailored for the [Appwrite Functions runtime](https://appwrite.io/products/functions). It's a lightweight and powerful router that allows you to define routes and handle requests with ease.

This wrapper around itty-router’s `Router` is typed to work seamlessly within the [Appwrite functions context](https://appwrite.io/docs/products/functions/develop#context-object).

You typically don't need to call `createRouter` yourself, as an instance is created for you and passed to the `withRouter` callback in [`handleRequest`](./handleRequest.md). But you may use it to organize your routes with nested routers.

## Signature

```typescript
function createRouter(
  options?: RouterOptions<
    AppwriteRequest,
    [AppwriteResponse, DefaultLogger, ErrorLogger] & any[]
  >
): Router<
  AppwriteRequest,
  [AppwriteResponse, DefaultLogger, ErrorLogger] & any[],
  AppwriteResponseObject
>;
```

- `options`: An optional configuration object from `itty-router`. You can use this to define a base path for all routes, or to add global middleware (`before`, `finally`).

## Usage with nested routers

`createRouter` is very useful for creating nested or "sub-routers" to better organize your routes.

Here is how you can create a sub-router for a `/categories` API endpoint and attach it to your main router (nested routers abide by their root parent’s configuration, so no need to setup CORS config etc. unless you do require a specific configuration for that routing zone):

**`src/routes/categories.ts`**

```typescript
import { createRouter } from 'appwrite-fn-router';

// 1. Create a router with a base path.
//    All routes defined here will be prefixed with /categories.
const categoriesRouter = createRouter({ base: '/categories' });

// This will handle GET /categories
categoriesRouter.get('/', () => {
  return { message: 'Listing all categories' };
});

// This will handle GET /categories/123
categoriesRouter.get('/:id', (request) => {
  const { id } = request.params;
  return { message: `Details for category ${id}` };
});

export default categoriesRouter;
```

**`src/main.ts`**

```typescript
import { handleRequest } from 'appwrite-fn-router';
import categoriesRouter from './routes/categories.ts';

export default async (context) => {
  await handleRequest(context, (mainRouter) => {
    mainRouter.get('/', () => ({ message: 'This is the main router' }));

    // 2. Attach the sub-router.
    //    The .all() method forwards any request matching /categories/*
    //    to the categoriesRouter.
    mainRouter.all('/categories/*', categoriesRouter.fetch);
  });
};
```

This approach helps keep your code modular and easier to maintain as your API grows.
