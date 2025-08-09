---
id: best-practices
slug: /usage/best-practices
sidebar_position: 5
sidebar_label: Best Practices
title: Best Practices
---

# Best Practices

This page lists recommendations and common pitfalls to avoid when using the Appwrite Function Router library.

## 1. Ne pas dupliquer la gestion des erreurs internes

La librairie gère automatiquement les erreurs non interceptées (exceptions) et renvoie une réponse HTTP 500 "Internal Server Error". Il est donc inutile de retourner manuellement ce type d’erreur dans vos routes :

```typescript
// À éviter :
try {
  // ...
} catch (e) {
  _error(String(e));
  return res.json(
    {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
    500
  );
}
```

Préférez simplement relancer l’exception pour laisser la librairie gérer :

```typescript
try {
  // ...
} catch (e) {
  _error(String(e));
  throw e; // Laissez la librairie gérer l’erreur
}
```

## 2. Utiliser les helpers de validation et de parsing

Utilisez les helpers fournis par la librairie pour valider et parser les entrées utilisateur, afin de garantir des réponses cohérentes et des erreurs explicites.

## 3. Centraliser la logique métier

Essayez de garder vos routes aussi simples que possible, et déplacez la logique métier complexe dans des fonctions ou services dédiés.

## 4. Documenter les cas d’erreur spécifiques

Documentez les cas d’erreur métier (ex : validation, non trouvé, non autorisé) dans vos routes, mais laissez la gestion des erreurs internes à la librairie.

## 5. Garder les exemples de documentation synchronisés avec le code source

Veillez à ce que les exemples de code dans la documentation (OpenAPI, Markdown, etc.) reflètent toujours la réalité du code source.
