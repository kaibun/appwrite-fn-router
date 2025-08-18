// HeadersContext: provides custom headers and setter
// All comments must be in English. Max line length: 80 chars.
import { createContext, useContext } from 'react';

export const HeadersContext = createContext<{
  headers: { key: string; value: string }[];
  setHeaders: (h: { key: string; value: string }[]) => void;
}>({ headers: [], setHeaders: () => {} });

export function useHeaders() {
  return useContext(HeadersContext);
}
