---
sidebar_position: 4
---

# `tracePrototypeChainOf`

This is a utility function for debugging purposes. It takes an object and returns a string representing its prototype chain. This can be useful when you need to understand the inheritance of an object, especially when dealing with complex objects or when debugging unexpected behavior.

## Signature

```typescript
function tracePrototypeChainOf(object: object): string;
```

-   `object`: The object whose prototype chain you want to trace.

## Usage

You can use this function within your routes or middleware to log the prototype chain of an object.

```typescript
import { handleRequest, tracePrototypeChainOf } from 'appwrite-fn-router';

export default async (context) => {
  await handleRequest(context, (router) => {
    router.get('/debug', (request, req_appwrite, res, log) => {
      
      log('Tracing prototype chain of the request object:');
      log(tracePrototypeChainOf(request));
      
      // It will log something like:
      // -> Request.prototype -> Object.prototype -> null

      return { status: 'ok' };
    });
  });
};
```
