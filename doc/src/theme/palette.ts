export type Palette = {
  accent: string;
  accent2: string;
  border: string;
  debugBg: string;
  errorText: string;
  errorBg: string;
  inputBg: string;
  inputBgEditable: string;
  inputBgReadonly: string;
  inputText: string;
  inputBorder: string;
  resultBg: string;
  resultErrorBg: string;
  resultErrorText: string;
  sectionBg: string;
  subtext: string;
  text: string;
  textContrast: string;
  mode: 'light' | 'dark';
};

export function getPalette(mode: 'light' | 'dark' = 'light'): Palette {
  if (mode === 'dark') {
    return {
      // dark theme
      accent: '#BCD0F0FF',
      accent2: '#93C4CDFF',
      border: '#26324a',
      debugBg: '#FFDC84FF',
      errorText: '#ffb3b3',
      errorBg: '#2a1a1a',
      inputBg: '#232b3a',
      inputBgEditable: '#2d3440', // gris foncé
      inputBgReadonly: 'transparent',
      inputText: '#eaf2ff',
      inputBorder: '#3b82f6',
      resultBg: '#63BE51FF',
      resultErrorBg: '#E41F1FFF',
      resultErrorText: '#ffffff',
      sectionBg: '#E1D9D9FF',
      subtext: '#b3bedc',
      text: '#ffffff',
      textContrast: '#000000',
      mode: 'dark',
    };
  }
  return {
    // light theme
    accent: '#3b82f6',
    accent2: '#6366f1',
    border: '#e5e7eb',
    debugBg: '#FFDC84FF',
    errorText: '#ef4444',
    errorBg: '#fee2e2',
    inputBg: '#f3f4f6',
    inputBgEditable: '#f9fafb', // blanc cassé
    inputBgReadonly: 'transparent',
    inputText: '#111827',
    inputBorder: '#d1d5db',
    resultBg: '#63BE51FF',
    resultErrorBg: '#E41F1FFF',
    resultErrorText: '#ffffff',
    sectionBg: '#1A68EFFF',
    subtext: '#6b7280',
    text: '#000000',
    textContrast: '#ffffff',
    mode: 'light',
  };
}
