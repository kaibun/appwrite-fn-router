// import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { messages, Lang } from '../components/TriggerFunction/I18n';

export type TFunction = (
  key: keyof (typeof messages)['en'],
  params?: Record<string, any>
) => string & Record<string, string>;

export function createT(
  messages: Record<string, any>,
  locale: string
): TFunction {
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
  Object.keys(dict).forEach((k) => {
    (t as any)[k] = dict[k];
  });
  return t;
}

export function getT(locale: string): TFunction {
  return createT(messages, locale as Lang);
}
