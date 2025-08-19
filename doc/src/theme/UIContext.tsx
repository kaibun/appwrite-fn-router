import { createContext, useContext } from 'react';
import type { TFunction } from './I18n';
import type { PaletteWithHelpers } from './palette';

export interface UIContextType {
  t: TFunction;
  palette: PaletteWithHelpers;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUIContext = () => {
  const ctx = useContext(UIContext);
  if (!ctx)
    throw new Error('useUIContext must be used within UIContext.Provider');
  return ctx;
};
