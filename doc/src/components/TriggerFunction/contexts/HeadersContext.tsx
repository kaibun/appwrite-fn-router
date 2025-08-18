// HeadersContext: provides custom headers and setter
// All comments must be in English. Max line length: 80 chars.
import { createContext, useContext, Dispatch, SetStateAction } from 'react';

export type Header = {
  key: string;
  value: string;
  enabled: boolean;
  corsEnabled?: boolean;
};

export const HeadersContext = createContext<{
  headers: Header[];
  setHeaders: Dispatch<SetStateAction<Header[]>>;
  hasNonSimpleCustomHeader: boolean;
  effectiveHeaders: Record<string, string>;
}>({
  headers: [],
  setHeaders: () => {},
  hasNonSimpleCustomHeader: false,
  effectiveHeaders: {},
});

export function useHeaders() {
  const ctx = useContext(HeadersContext);
  if (!ctx)
    throw new Error('useHeaders must be used within HeadersContext.Provider');
  return ctx;
}
