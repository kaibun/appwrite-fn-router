# Internes & Utilisation Avancée

Cette page documente les aspects subtils ou avancés de la bibliothèque, à la fois pour les contributeurs et les utilisateurs avancés.

## 1. Type réel de `req` dans les handlers & extensibilité

Bien que le type public soit `AppwriteRequest`/`Request`, l’objet reçu dans les handlers de routes est en réalité un `WrapperRequestType` (une fusion de votre type et du `IRequest` d’itty-router).

Cela signifie que des propriétés comme `params`, `route`, etc. sont disponibles à l’exécution, même si elles ne sont pas présentes dans le type de base AppwriteRequest. Cette fonctionnalité est fournie par [itty-router](https://itty.dev/itty-router/getting-started).

`WrapperRequestType` est également conçu pour évoluer si d’autres propriétés dynamiques doivent être exposées aux handlers. Vous pouvez l’étendre selon vos besoins :

### Exemple

```ts
// 1. Définissez votre type étendu
type MyRequest = WrapperRequestType & { user?: { id: string } };

// 2. Point d’entrée de votre fonction Appwrite
export default async function main(context) {
  // Vous pouvez enrichir req avec n’importe quelle propriété avant de le passer à handleRequest
  const req = context.req as MyRequest;
  // Par exemple, attacher un objet user après authentification :
  req.user = { id: 'user-123' };

  // Passez le req enrichi (et le reste du contexte) à handleRequest
  return await handleRequest({ ...context, req }, (router) => {
    // L’accès aux paramètres d’URL est toujours possible
    router.get('/:id', (req, res) => {
      const { id } = req.params;
      return res.json({ id });
    });

    // Et maintenant vous pouvez utiliser votre propriété personnalisée dans votre handler
    router.get('/me', (req: MyRequest, res) => {
      if (!req.user) return res.json({ error: 'Non connecté' }, 401);
      return res.json({ userId: req.user.id });
    });
  });
}
```

## 2. Normalisation globale des headers

Les headers sont automatiquement normalisés (clés insensibles à la casse) avant d’arriver dans les handlers. Cela signifie que vous pouvez toujours utiliser `req.headers['Authorization']` ou `req.headers['authorization']` de façon interchangeable dans vos handlers, quel que soit l’environnement (Node.js, Appwrite, etc.).

### Exemple

```ts
router.get('/secret', (req, res) => {
  const token = req.headers['Authorization'];
  // Identique à req.headers['authorization'], choisissez la forme que vous préférez.
  if (!token) return res.json({ error: 'Non autorisé' }, 401);
  return res.json({ secret: true });
});
```

## 3. Cinquième argument : `internals` (réservé à un usage avancé/interne)

Tous les callbacks/handlers (pas seulement les middlewares) reçoivent techniquement un cinquième argument, `internals`, qui expose une réplique de la requête native sous `internals.request`.

Cependant, il s’agit d’un détail interne d’itty-router et de la bibliothèque. L’objet `internals.request` n’est qu’une réplique approximative de la requête originale reçue par le runtime Appwrite (qui ne transmet pas la requête native à la fonction). **Il n’y a aucune raison pour les utilisateurs finaux de s’appuyer sur cet argument dans leur code ; il est uniquement utilisé en interne par la bibliothèque pour la gestion du CORS et des fonctionnalités similaires.**

## 4. Fusion dynamique des options

Les options passées à `handleRequest` sont fusionnées avec des valeurs par défaut dépendantes de l’environnement (ex : logs, gestion des erreurs), ce qui rend la bibliothèque robuste en développement comme en production. Voir [Options](/usage/handleRequest.md#options).

### Exemple

```ts
handleRequest(context, withRouter, {
  log: false, // désactive les logs
  cors: {
    allowedOrigins: [/^https:\/\/mydomain\.com$/],
    allowHeaders: ['Authorization', 'Content-Type'],
  },
  ittyOptions: {
    // Toutes les options itty-router (catch, before, finally, etc.) vont ici !
    catch: (err, req, res, log, error) => {
      log('Erreur attrapée :', err);
      return res.json({ message: 'Erreur personnalisée' }, 500);
    },
    before: [(req, res, log) => log('Avant chaque route !')],
  },
});
```
