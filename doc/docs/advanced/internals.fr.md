# Internes & usages avancés

Cette page documente les aspects subtils ou avancés de la bibliothèque, pour les contributeurs comme pour les utilisateurs avancés.

## 1. Typage réel de `req` dans les handlers & extensibilité

Même si le type public est `AppwriteRequest`/`Request`, l’objet reçu dans les handlers est en réalité un `WrapperRequestType` (fusion de ton type et de `IRequest` d’itty-router).

Cela explique la présence de propriétés comme `params`, `route`, etc. à l’exécution, même si elles n’apparaissent pas dans le type AppwriteRequest de base. Cette fonctionnalité est assurée par [itty-router](https://itty.dev/itty-router/getting-started).

Le type `WrapperRequestType` est aussi prévu pour évoluer si d’autres propriétés dynamiques doivent être exposées aux handlers. Vous pouvez l’étendre pour vos propres besoins :

### Exemple

```ts
// 1. Définissez votre type étendu
type MaRequete = WrapperRequestType & { user?: { id: string } };

// 2. Point d’entrée de votre fonction Appwrite
export default async function main(context) {
  // Vous pouvez enrichir req avec n’importe quelle propriété avant de le passer à handleRequest
  const req = context.req as MaRequete;
  // Par exemple, attacher un objet user après authentification :
  req.user = { id: 'user-123' };

  // Passez le req enrichi (et le reste du context) à handleRequest
  return await handleRequest({ ...context, req }, (router) => {
    // Accès à params toujours possible
    router.get('/:id', (req, res) => {
      const { id } = req.params;
      return res.json({ id });
    });

    // Et vous pouvez utiliser votre propriété custom dans un handler
    router.get('/me', (req: MaRequete, res) => {
      if (!req.user) return res.json({ error: 'Non connecté' }, 401);
      return res.json({ userId: req.user.id });
    });
  });
}
```

## 2. Normalisation globale des headers

Les headers sont automatiquement normalisés (clés insensibles à la casse) avant d’arriver dans les handlers. Vous pouvez donc utiliser indifféremment `req.headers['Authorization']` ou `req.headers['authorization']` dans vos handlers, quel que soit l’environnement (Node.js, Appwrite, etc.).

### Exemple

```ts
router.get('/secret', (req, res) => {
  // Les deux fonctionnent de la même façon
  const token = req.headers['Authorization'];
  if (!token) return res.json({ error: 'Unauthorized' }, 401);
  return res.json({ secret: true });
});
```

## 3. Cinquième argument : `internals` (usage avancé/interne uniquement)

Tous les callbacks/handlers (pas seulement les middlewares) reçoivent techniquement un cinquième argument, `internals`, qui expose une réplique de la `Request` native reçue par le runtime Appwrite, dans la propriété `request`.

Cependant, il s’agit d’un détail interne d’itty-router et de la présente bibliothèque. L’objet `internals.request` n’est qu’une réplique approximative de la requête d’origine reçue par le runtime Appwrite (qui ne transmet pas la Request native à la fonction Appwrite). Il n’y a donc aucune raison pour un utilisateur final d’utiliser cet argument dans son code : il n’est utilisé qu’en interne par la librairie pour gérer CORS et d’autres besoins similaires.

## 4. Fusion dynamique des options

Les options passées à `handleRequest` sont fusionnées avec des valeurs par défaut dépendant de l’environnement (`NODE_ENV`), ce qui influe sur le logging, la gestion d’erreur, etc. Voir [Options](../usage/handleRequest.md#options).

### Exemple

```ts
handleRequest(context, withRouter, {
  log: false, // désactive le log
  cors: {
    allowedOrigins: [/^https:\/\/mondomaine\.com$/],
    allowHeaders: ['Authorization', 'Content-Type'],
  },
});
```
