---
sidebar_position: 2
---

# `handleRequest`

## Philosophie : une API familière, des entrailles surchargées

Lorsque vous utilisez cette bibliothèque, vos gestionnaires de route reçoivent toujours quatre arguments : `req`, `res`, `log` et `error`. Cela correspond exactement à l’API Appwrite standard, donc l’adoption du routeur ne change ni votre logique ni la structure de votre code.

**API simplifiée :** Le paramètre `req` est strictement un objet AppwriteRequest, sans fusion ni surcouche. L’API utilisateur reste donc 100% compatible Appwrite, sans surprise ni comportement caché. Le routeur utilise en interne un objet Request natif si besoin, mais cela ne concerne pas l’utilisateur.

**Note :** Si vous avez un besoin avancé d’accéder à l’objet Request natif (Web API), il peut être exposé en cinquième argument optionnel, mais ce n’est pas documenté pour l’utilisateur standard.

La fonction `handleRequest` est le point d'entrée principal de votre fonction Appwrite lorsque vous utilisez ce routeur. Elle configure l'environnement, initialise le routeur avec vos routes et votre configuration, et gère les requêtes entrantes.

C'est probablement la seule méthode que vous aurez besoin d'appeler pour utiliser cette bibliothèque.

## Signature

```typescript
async function handleRequest(
  context: AppwriteContext,
  withRouter: (router: ReturnType<typeof createRouter>) => void,
  options?: Options
): Promise<AppwriteResponseObject | undefined>;
```

- `context` : L'objet de contexte de fonction Appwrite standard (`req`, `res`, `log`, `error`).
- `withRouter` : Une fonction de rappel où vous définissez toutes vos routes en appelant des méthodes sur l'instance `router` fournie.
- `options` : Un objet de configuration facultatif pour personnaliser le comportement du routeur.

## Options

L'objet `options` vous permet de configurer divers aspects du routeur :

| Option     | Type                                                                                                  | Défaut      | Description                                                                                                                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `globals`  | `boolean`                                                                                             | `true`      | Si `true`, rend `log` et `error` disponibles en tant que fonctions globales.                                                                                                                                                            |
| `env`      | `boolean`                                                                                             | `true`      | Si `true`, définit la variable d'environnement `APPWRITE_FUNCTION_API_KEY` à partir de l'en-tête `x-appwrite-key`.                                                                                                                      |
| `log`      | `boolean`                                                                                             | `true`      | Active ou désactive la journalisation.                                                                                                                                                                                                  |
| `errorLog` | `boolean`                                                                                             | `true`      | Active ou désactive la journalisation des erreurs.                                                                                                                                                                                      |
| `onError`  | `(err: unknown, req: AppwriteRequest, res: AppwriteResponse, log: Function, error: Function) => void` | `undefined` | Fonction appelée à chaque erreur non interceptée dans un handler ou middleware. Reçoit l'erreur et le contexte Appwrite (`req`, `res`, `log`, `error`). Permet de logger, reporter ou personnaliser la gestion des erreurs globalement. |
| `cors`     | `object`                                                                                              | `{...}`     | Configuration pour le partage des ressources entre origines (CORS). Voir ci-dessous pour plus de détails.                                                                                                                               |

### Gestion globale des erreurs avec `onError`

Vous pouvez fournir un gestionnaire d’erreurs personnalisé via l’option `onError`. Ce callback est invoqué à chaque fois qu’une erreur non interceptée survient dans un handler ou un middleware. Il reçoit l’erreur ainsi que le contexte Appwrite (`req`, `res`, `log`, `error`). Utilisez-le pour logger, envoyer à un service de monitoring, ou personnaliser la réponse d’erreur globalement.

```typescript
import { handleRequest } from 'appwrite-fn-router';

export default async ({ req, res, log, error }) => {
  return await handleRequest(
    { req, res, log, error },
    (router) => {
      // Définissez vos routes ici
    },
    {
      onError: (err, req, res, log, error) => {
        // Log ou reporting custom avec tout le contexte
        log('Erreur interceptée par onError :', err);
        // Vous pouvez aussi utiliser req, res, error, etc.
      },
    }
  );
};
```

### Configuration CORS

Vous pouvez fournir une configuration CORS flexible pour contrôler la manière dont votre fonction répond aux requêtes provenant de différentes origines.

L'objet d'option `cors` a les propriétés suivantes :

- `allowedOrigins` : Un tableau de chaînes de caractères ou d'objets `RegExp` pour les origines autorisées.
- `allowMethods` : Un tableau des méthodes HTTP autorisées.
- `allowHeaders` : Un tableau des en-têtes de requête autorisés.

## Exemple

Voici à quoi devrait ressembler l’utilisation de `handleRequest`, y compris la configuration CORS pour autoriser les requêtes provenant, dans cet exemple, de votre domaine de production.

```typescript
// src/main.ts
import { handleRequest } from 'appwrite-fn-router';

export default async ({ req, res, log, error }) => {
  return await handleRequest(
    { req, res, log, error },
    (router) => {
      // Définissez vos routes ici
      // Exemple :
      router.get('/', (req, res, log, error) => {
        return res.send('Bonjour, le monde !');
      });
      router.get('/', () => ({ message: 'Bonjour le monde !' }));
    },
    {
      cors: {
        allowedOrigins: [
          'https://my-domain.com',
          /.*\.subdomain\.somedomain\.tld$/, // vous pouvez utiliser des regex
        ],
        allowMethods: ['GET', 'POST', 'PUT'],
        allowHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
      },
    }
  );
};
```

**Remarque :** Pour le développement local, `http://localhost:3000` (la [fonction de test](https://github.com/kaibun/appwrite-fn-router/tree/main/functions/Test)) et `https://localhost:3001` ([ce même processus Docusaurus](https://github.com/kaibun/appwrite-fn-router/tree/main/doc)) sont automatiquement ajoutés à la liste `allowedOrigins`, à condition que `NODE_ENV` ne soit pas défini sur `production`. Cela permet d'envoyer des requêtes CORS entre les différents ports du localhost.
