// Vérifie si un header est CORS-safelisted
export function isCorsSimpleHeader(key: string, value: string): boolean {
  const k = key.trim().toLowerCase();
  if (k === 'accept' || k === 'accept-language' || k === 'content-language')
    return true;
  if (k === 'content-type') {
    const v = value.trim().toLowerCase();
    return (
      v === 'application/x-www-form-urlencoded' ||
      v === 'multipart/form-data' ||
      v === 'text/plain'
    );
  }
  return false;
}
// Fonctions utilitaires
// Extrait les :param dans /widgets/:id mais ignore les ports (ex :3000)
// On considère qu'un port est :<nombre> juste après 'localhost' ou un domaine
// On ne veut pas matcher :3000 dans http://localhost:3000/widgets/:id
export function extractParams(url: string): string[] {
  const matches = url.match(/:([a-zA-Z_][a-zA-Z0-9_]*)/g); // n'accepte pas :<nombre> seul
  return matches ? matches.map((m) => m.slice(1)) : [];
}

// Autres utilitaires à ajouter
