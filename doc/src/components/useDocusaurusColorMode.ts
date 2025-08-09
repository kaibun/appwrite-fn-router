import { useContext } from 'react';
// Docusaurus v2: le color mode est dans le context ThemeContext
// eslint-disable-next-line @typescript-eslint/no-var-requires

import { useColorMode } from '@docusaurus/theme-common';

export function useDocusaurusColorMode(): 'light' | 'dark' {
  const { colorMode } = useColorMode();
  return colorMode || 'light';
}
