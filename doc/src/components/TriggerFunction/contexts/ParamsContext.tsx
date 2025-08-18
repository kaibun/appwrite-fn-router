// ParamsContext: provides URL parameters and setter
// All comments must be in English. Max line length: 80 chars.
import { createContext, useContext } from 'react';
import type { Param } from '../Types';

export const ParamsContext = createContext<{
  params: Param[];
  setParams: (ps: Param[]) => void;
}>({ params: [], setParams: () => {} });

export function useParams() {
  return useContext(ParamsContext);
}
