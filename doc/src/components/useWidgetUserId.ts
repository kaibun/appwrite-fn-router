// Génère ou récupère un identifiant utilisateur persistant pour la démo widgets
// Utilise localStorage (clé: 'afr-widget-user-id')
export function getOrCreateWidgetUserId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('afr-widget-user-id');
  if (!id) {
    id = 'user-' + Math.random().toString(36).slice(2) + '-' + Date.now();
    localStorage.setItem('afr-widget-user-id', id);
  }
  return id;
}
