// Hook pour récupérer la langue courante Docusaurus (client), fallback navigator.language
import { useContext } from 'react';
// @ts-ignore
import DocusaurusContext from '@docusaurus/context';

export function useDocusaurusLocale(): string {
  // DocusaurusContext est exposé par @docusaurus/useDocusaurusContext
  // Mais certains environnements (dev mono-langue) ne l’exposent pas
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const useDocusaurusContext =
      require('@docusaurus/useDocusaurusContext').default;
    const ctx = useDocusaurusContext();
    if (ctx && ctx.i18n && ctx.i18n.currentLocale) {
      return ctx.i18n.currentLocale;
    }
  } catch {}
  // Fallback navigateur
  if (typeof navigator !== 'undefined') {
    if (navigator.language.startsWith('fr')) return 'fr';
    if (navigator.language.startsWith('en')) return 'en';
  }
  return 'fr';
}
