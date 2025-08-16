import React, { createContext, useContext } from 'react';
import { messages, Lang } from './TriggerFunction/I18n';
import { useDocusaurusLocale } from './useDocusaurusLocale';

/**
 * @packageDocumentation
 *
 * i18n system for UI translations:
 * - The `TFunction` type is both callable (`t('key', { params })`) and property-accessible (`t.key`).
 * - The `createT` function returns a function with all message keys as properties, allowing:
 *     `t('showLines', { start: 1, end: 5 })` // → 'Show lines 1-5'
 *     `t.showLines` // → 'Show lines {start}-{end}'
 * - Compatible with React context and TypeScript autocompletion.
 * - Messages are injected from messages[locale] and can use {placeholders} for variable replacement.
 *
 * Compatibility note:
 * - React Context does not support Proxy objects as values (they lose callability).
 * - To ensure compatibility, we use a real function and attach message keys as properties.
 * - This allows both function calls and property access, with full TypeScript autocompletion.
 *
 * Usage:
 *
 * ```js
 * const t = useI18n();
 * t('key', { var: value })
 * t.key
 * ```
 */

export type TFunction = ((
  key: keyof (typeof messages)['en'],
  params?: Record<string, any>
) => string) &
  Record<keyof (typeof messages)['en'] | string, string>;

function createT(messages: Record<string, any>, locale: string): TFunction {
  const dict = messages[locale];
  const t = ((key: keyof typeof dict, params?: Record<string, any>) => {
    let str = dict[key] || String(key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`{${k}}`, 'g'), v);
      });
    }
    return str;
  }) as TFunction;
  // Attach property access
  Object.keys(dict).forEach((k) => {
    (t as any)[k] = dict[k];
  });
  return t;
}

const I18nContext = createContext<TFunction>(createT(messages, 'fr'));

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const locale = useDocusaurusLocale();
  const t = createT(messages, locale as Lang);
  return <I18nContext.Provider value={t}>{children}</I18nContext.Provider>;
};

export function useI18n(): TFunction {
  return useContext(I18nContext);
}
