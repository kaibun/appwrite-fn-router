// Utilitaire pour récupérer le numéro d'étape depuis l'URL
export function getStepFromUrl(defaultStep: number = 1): number {
  if (typeof window === 'undefined') return defaultStep;
  const params = new URLSearchParams(window.location.search);
  const stepStr = params.get('step');
  const step = stepStr ? parseInt(stepStr, 10) : defaultStep;
  return isNaN(step) ? defaultStep : step;
}
