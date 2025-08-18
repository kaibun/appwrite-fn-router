import React, { createContext, useContext } from 'react';
import type { TFunction } from './I18n';

export interface UIContextType {
  t: TFunction;
  palette: Record<string, string>;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUIContext = () => {
  const ctx = useContext(UIContext);
  if (!ctx)
    throw new Error('useUIContext must be used within UIContext.Provider');
  return ctx;
};
