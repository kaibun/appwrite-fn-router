import type { Props } from '@theme/Root';
import { UIContext, UIContextType } from './UIContext';
import { getPalette } from './palette';
import { getT } from './I18n';
import { useColorMode } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

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
