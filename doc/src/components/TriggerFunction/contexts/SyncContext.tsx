import { createContext, useContext, useState, ReactNode } from 'react';

/**
 * @packageDocumentation
 *
 * This context synchronizes the id of the last created widget (POST /widgets)
 * between multiple `<TriggerFunction />` examples in the interactive
 * documentation.
 *
 * When a widget is created, its id is stored here and automatically injected
 * into the URL parameters (e.g.: /widgets/:id) of other examples, to
 * allow testing GET/PATCH/DELETE on the same id without copy-pasting.
 *
 * Usage:
 *
 * ```jsx
 * <TriggerFunctionSyncProvider>
 *   <TriggerFunction ... />
 *   <TriggerFunction ... />
 * </TriggerFunctionSyncProvider>
 * ```
 *
 * See doc/docs/usage/step-by-step.mdx for an integration example.
 */

interface TriggerFunctionSyncState {
  /**
   * Synchronized URL parameters (e.g. id, userId, etc.)
   */
  urlParameters: Record<string, string>;
  /**
   * Update a single URL parameter value
   */
  setUrlParameter: (name: string, value: string) => void;
  lastWidgetBody?: any;
  setLastWidgetBody: (body: any) => void;
  lastWidgetHeaders?: Record<string, string>;
  setLastWidgetHeaders: (headers: Record<string, string>) => void;
  history: { req: any; res: any }[];
  addHistory: (item: { req: any; res: any }) => void;
}

const TriggerFunctionSyncContext = createContext<
  TriggerFunctionSyncState | undefined
>(undefined);

export function TriggerFunctionSyncProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Synchronized URL parameters (id, userId, ...)
  const [urlParameters, setUrlParameters] = useState<Record<string, string>>(
    {}
  );
  const setUrlParameter = (name: string, value: string) => {
    setUrlParameters((prev) => ({ ...prev, [name]: value }));
  };
  const [lastWidgetBody, setLastWidgetBody] = useState<any>(undefined);
  const [lastWidgetHeaders, setLastWidgetHeaders] = useState<
    Record<string, string> | undefined
  >(undefined);
  const [history, setHistory] = useState<{ req: any; res: any }[]>([]);
  const addHistory = (item: { req: any; res: any }) => {
    setHistory((h) => [item, ...h].slice(0, 5));
  };
  return (
    <TriggerFunctionSyncContext.Provider
      value={{
        urlParameters,
        setUrlParameter,
        lastWidgetBody,
        setLastWidgetBody,
        lastWidgetHeaders,
        setLastWidgetHeaders,
        history,
        addHistory,
      }}
    >
      {children}
    </TriggerFunctionSyncContext.Provider>
  );
}

export function useTriggerFunctionSync() {
  const ctx = useContext(TriggerFunctionSyncContext);
  if (!ctx)
    throw new Error(
      'useTriggerFunctionSync must be used within TriggerFunctionSyncProvider'
    );
  return ctx;
}
