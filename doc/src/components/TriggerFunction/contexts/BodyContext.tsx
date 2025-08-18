// BodyContext: provides request body and setter
// All comments must be in English. Max line length: 80 chars.
import { createContext, useContext } from 'react';

export const BodyContext = createContext<{
  body: string;
  setBody: (b: string) => void;
  bodyJsonError?: string | null;
}>({ body: '', setBody: () => {}, bodyJsonError: null });

export function useBody() {
  const ctx = useContext(BodyContext);
  if (!ctx) throw new Error('useBody must be used within BodyContext.Provider');
  return ctx;
}
