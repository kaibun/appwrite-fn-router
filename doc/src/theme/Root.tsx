import type { Props } from '@theme/Root';
import { useColorMode } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { UIContext, UIContextType } from './UIContext';
import { getPalette } from './palette';
import { getT } from './I18n';

/**
 * @packageDocumentation
 *
 * @see https://docusaurus.io/docs/swizzling#wrapper-your-site-with-root
 */

export default function Root({ children }: Props) {
  const { colorMode } = useColorMode();
  const { i18n } = useDocusaurusContext();
  const locale = i18n?.currentLocale || 'en';
  const t = getT(locale);
  const palette = getPalette(colorMode === 'dark' ? 'dark' : 'light');

  const uiContextValue: UIContextType = { t, palette };

  return (
    <UIContext.Provider value={uiContextValue}>{children}</UIContext.Provider>
  );
}
