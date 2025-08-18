/**
 * Wrapping swizzle for Docusaurus Layout/Provider.
 *
 * This allows us to inject our own UIContext.Provider at the right level,
 * after Docusaurus ColorModeProvider is available, so useColorMode works.
 *
 * See:
 *   https://docusaurus.io/docs/swizzling#wrapping
 *   https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/Layout/Provider/index.tsx
 */

import type { ReactNode } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import OriginalProvider from '@theme-original/Layout/Provider';

import { UIContext, UIContextType } from '@src/theme/UIContext';
import { getPalette } from '@src/theme/palette';
import { getT } from '@src/theme/I18n';

/**
 * Tip:
 * Call `useColorMode` (and any hook depending on a Docusaurus provider)
 * inside a child component, not directly in the swizzled provider.
 * This ensures `<OriginalProvider>` (and thus `<ColorModeProvider>`) is mounted
 * when the hook is used, avoiding the error:
 * "Hook `useColorMode` is called outside the `<ColorModeProvider>`".
 *
 * This structure exposes the UI context everywhere (`Navbar`, `Sidebar`, etc.)
 * while respecting the Docusaurus provider hierarchy.
 */
function UIContextProvider({ children }: { children: ReactNode }) {
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

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <OriginalProvider>
      <UIContextProvider>{children}</UIContextProvider>
    </OriginalProvider>
  );
}
