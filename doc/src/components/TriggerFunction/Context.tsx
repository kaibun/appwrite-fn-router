import { createContext, useContext } from 'react';

export interface TriggerFunctionContextType {
  method: string;
  customHeaders: { key: string; value: string }[];
  useAuth: boolean;
  setUseAuth: React.Dispatch<React.SetStateAction<boolean>>;
  effectiveHeaders: Record<string, string>;
  computedUrl: string;
  label: string;
  setCustomHeaders: React.Dispatch<
    React.SetStateAction<{ key: string; value: string }[]>
  >;
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
