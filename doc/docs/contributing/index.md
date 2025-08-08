---
sidebar_position: 1
---

# Contributing to AFR

Here are advanced elements that will help you understand the source code and contribute to its development.

## Options and Context Architecture

- Options passed to `handleRequest` are split:
  - Library-specific options (`log`, `env`, etc.) are handled internally.
  - All other options for itty-router must be placed in the `ittyOptions` property: they are transparently forwarded to `createRouter`.
- `before` and `finally` middlewares are composed:
  CORS middlewares are prepended/appended, then user-provided ones.

### Code sample:

```typescript
const {
  before: userBefore = [],
  finally: userFinally = [],
  ...ittyOptions
} = finalOptions.ittyOptions || {};

const before = [
  (req, res, log, error, internals, ...args) =>
    corsPreflightMiddleware(req, res, log, error, {
      ...(internals || {}),
      preflight,
    }),
  ...[].concat(userBefore),
];

const finallyArr = [
  ...[].concat(userFinally),
  (responseFromRoute, request, res, log, error, internals, ...args) =>
    corsFinallyMiddleware(responseFromRoute, request, res, log, error, {
      ...(internals || {}),
      corsify,
    }),
];

const router = createRouter({
  before,
  finally: finallyArr,
  ...ittyOptions,
});
```

## Handler Typing

- All handlers and middlewares receive arguments typed via `AFRContextArgs`:
  - `(req, res, log, error, internals, ...args)`
- The `internals` type is optional in the global catch, as it may not always be available outside the router cycle.

### Type sample:

```typescript
export type AFRContextArgs = [
  AFRContext['req'],
  AFRContext['res'],
  AFRContext['log'],
  AFRContext['error'],
  AFRContext['internals'],
  ...any[],
];
```
