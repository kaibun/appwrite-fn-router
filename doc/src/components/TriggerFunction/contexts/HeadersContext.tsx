// HeadersContext: provides custom headers and setter
// All comments must be in English. Max line length: 80 chars.
import { createContext, useContext } from 'react';

type Header = { key: string; value: string };

export const HeadersContext = createContext<{
  headers: Header[];
  setHeaders: (headers: Header[]) => void;
  hasNonSimpleCustomHeader: boolean;
  effectiveHeaders: Record<string, string>;
  useAuth: boolean;
  setUseAuth: (v: boolean) => void;
}>({
  headers: [],
  setHeaders: () => {},
  hasNonSimpleCustomHeader: false,
  effectiveHeaders: {},
  useAuth: false,
  setUseAuth: () => {},
});

export function useHeaders() {
  return useContext(HeadersContext);
}
