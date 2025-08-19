import { hexToRgba } from '@src/utils/hexToRgba';

export type Palette = {
  mode: 'light' | 'dark';
  light: boolean;
  dark: boolean;
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
  prism: {
    comment: string;
    punctuation: string;
    property: string;
    boolean: string;
    string: string;
    operator: string;
    keyword: string;
    function: string;
    regex: string;
    bold: string;
    italic: string;
    entity: string;
  };
};

export type PaletteWithHelpers = Palette & {
  toRGBA: typeof hexToRgba;
};

export function getPalette(
  mode: 'light' | 'dark' = 'light'
): PaletteWithHelpers {
  if (mode === 'dark') {
    return {
      mode: 'dark',
      dark: true,
      light: false,
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
      prism: {
        comment: '#6a9955',
        punctuation: '#d4d4d4',
        property: '#e06c75',
        boolean: '#b5cea8',
        string: '#ce9178',
        operator: '#d4d4d4',
        keyword: '#569cd6',
        function: '#dcdcaa',
        regex: '#d16969',
        bold: 'bold',
        italic: 'italic',
        entity: 'help',
      },
      toRGBA: hexToRgba,
    };
  }
  return {
    mode: 'light',
    light: true,
    dark: false,
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
    prism: {
      comment: '#708090',
      punctuation: '#999999',
      property: '#990055',
      boolean: '#990055',
      string: '#669900',
      operator: '#a67f59',
      keyword: '#0077aa',
      function: '#dd4a68',
      regex: '#ee9900',
      bold: 'bold',
      italic: 'italic',
      entity: 'help',
    },
    toRGBA: hexToRgba,
  };
}
