// RequestContext: provides method, urlTemplate, computedUrl, params, setParams
// All comments must be in English. Max line length: 80 chars.
import { createContext, useContext } from 'react';
import type { Param } from '../Types';

export interface RequestContextType {
  method: string;
  urlTemplate: string;
  computedUrl: string;
  params: Param[];
  setParams: (ps: Param[]) => void;
  body: string;
  setBody: (body: string) => void;
  bodyJsonError: string | null;
  readOnlyBody: boolean;
  isBodySynced: boolean;
}

export const RequestContext = createContext<RequestContextType | undefined>(
  undefined
);

export function useRequestContext() {
  const ctx = useContext(RequestContext);
  if (!ctx)
    throw new Error(
      'useRequestContext must be used within RequestContext.Provider'
    );
  return ctx;
}
