import { messages, Lang } from './I18nDict';

/**
 * @packageDocumentation
 *
 * Custom i18n system for UI components and runtime translations.
 *
 * Docusaurus provides i18n for static content (docs, pages, menus), but
 * does not cover dynamic UI, runtime messages, or React component props.
 * This module enables:
 * - Consistent translation for all UI elements, including buttons,
 *   tooltips, error messages, etc.
 * - Parameterized strings (e.g. t('greeting', { name: 'John' })).
 * - Centralized message management for maintainability and type safety.
 * - Fallback for missing keys, so UI never breaks on missing translation.
 *
 * Use this system for all runtime and interactive UI text, while keeping
 * Docusaurus i18n for static site content.
 */

export type TFunction = ((
  key: keyof (typeof messages)['en'],
  params?: Record<string, any>
) => string) & {
  [K in keyof (typeof messages)['en']]: string;
};

/**
 * Creates a translation function for a given locale.
 * - The returned function can be called as t('key', params) to get a
 *   translated string.
 * - All translation keys are also attached as properties (t.key) for direct
 *   access.
 * - Supports parameter replacement (e.g. t('greeting', { name: 'John' })).
 */
export function createT(
  messages: Record<string, any>,
  locale: string
): TFunction {
  const dict = messages[locale];
  const t = ((key: keyof typeof dict, params?: Record<string, any>) => {
    let str = dict[key];
    if (params && str !== undefined) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`{${k}}`, 'g'), v);
      });
    }
    return str as string;
  }) as TFunction;
  Object.keys(dict).forEach((k) => {
    (t as any)[k] = dict[k];
  });
  return t;
}

/**
 * Returns a memoized translation function for the given locale.
 * - Uses createT to build the function and attaches all translation keys as
 *   properties.
 * - Wraps the function in a Proxy to provide a fallback: if a key is missing,
 *   returns 't.keyName'.
 * - Ensures only one translation function per locale is created and reused.
 */
export function getT(locale: string): TFunction {
  // Memoize translation function per locale
  const self = getT as any;
  if (!self._cache) self._cache = {};
  if (!self._cache[locale]) {
    const rawT = createT(messages, locale as Lang);
    // Proxy to handle fallback for missing keys
    const proxyT = new Proxy(rawT, {
      apply(target, thisArg, argArray) {
        const key = argArray[0];
        const params = argArray[1];
        // Directly call the wrapped function to handle interpolation
        const str = target(key, params);
        if (str !== undefined) {
          return str;
        }
        // Fallback for missing keys
        return `t.${String(key)}`;
      },
      get(target, prop) {
        if (typeof prop === 'string' && !(prop in target)) {
          return `t.${prop}`;
        }
        return target[prop as keyof typeof target];
      },
    });
    self._cache[locale] = proxyT;
  }
  return self._cache[locale];
}
