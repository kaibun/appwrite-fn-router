---
sidebar_position: 1
---

# Contribuer à AFR

Voici des éléments avancés qui, je l’espère, vous permettront de prendre en main le code source pour contribuer à son développement.

## Architecture des options et du contexte

- Les options passées à `handleRequest` sont séparées :
  - Les options propres à la lib (`log`, `env`, etc.) sont traitées en interne.
  - Toutes les autres options destinées à itty-router doivent être placées dans la propriété `ittyOptions` : elles sont transmises telles quelles à `createRouter`.
- Les middlewares `before` et `finally` sont composés :  
  les middlewares CORS sont ajoutés en tête/queue, puis ceux de l’utilisateur.

### Extrait de code :

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

## Typage des handlers

- Tous les handlers et middlewares reçoivent les arguments typés via `AFRContextArgs` :
  - `(req, res, log, error, internals, ...args)`
- Le type `internals` est optionnel dans le catch global, car il n’est pas toujours disponible hors du cycle du routeur.

### Extrait de type :

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
