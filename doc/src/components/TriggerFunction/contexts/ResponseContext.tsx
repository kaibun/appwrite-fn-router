import { createContext, useContext } from 'react';

export interface ResponseContextType {
  response: Response | null;
  httpError: boolean; // basically response.status >= 400
}

export const ResponseContext = createContext<ResponseContextType>({
  response: null,
  httpError: false,
});

export const useResponseContext = () => {
  const ctx = useContext(ResponseContext);
  if (!ctx)
    throw new Error(
      'useResponseContext must be used within a ResponseContext.Provider'
    );
  return ctx;
};
