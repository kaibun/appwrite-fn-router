import React, { createContext, useContext } from 'react';

export interface TriggerFunctionContextType {
  method: string;
  customHeaders: { key: string; value: string }[];
  t: Record<string, string>;
}

export const TriggerFunctionContext = createContext<
  TriggerFunctionContextType | undefined
>(undefined);

export const useTriggerFunctionContext = () => {
  const ctx = useContext(TriggerFunctionContext);
  if (!ctx)
    throw new Error(
      'useTriggerFunctionContext must be used within TriggerFunctionContext.Provider'
    );
  return ctx;
};
