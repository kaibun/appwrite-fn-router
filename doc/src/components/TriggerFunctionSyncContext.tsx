import React, { createContext, useContext, useState, ReactNode } from 'react';
// Ce contexte permet de synchroniser l’id du dernier widget créé (POST /widgets)
// entre plusieurs exemples <TriggerFunction /> dans la documentation interactive.
// Lorsqu’un widget est créé, son id est stocké ici et injecté automatiquement
// dans les paramètres d’URL (ex : /widgets/:id) des autres exemples, pour
// permettre de tester GET/PATCH/DELETE sur le même id sans copier-coller.
//
// Utilisation :
// <TriggerFunctionSyncProvider>
//   <TriggerFunction ... />
//   <TriggerFunction ... />
// </TriggerFunctionSyncProvider>
//
// Voir doc/docs/usage/step-by-step.mdx pour un exemple d’intégration.

interface TriggerFunctionSyncState {
  lastWidgetId?: string;
  setLastWidgetId: (id: string) => void;
  lastWidgetBody?: any;
  setLastWidgetBody: (body: any) => void;
  lastWidgetHeaders?: Record<string, string>;
  setLastWidgetHeaders: (headers: Record<string, string>) => void;
}

const TriggerFunctionSyncContext = createContext<
  TriggerFunctionSyncState | undefined
>(undefined);

export function TriggerFunctionSyncProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [lastWidgetId, setLastWidgetId] = useState<string | undefined>(
    undefined
  );
  const [lastWidgetBody, setLastWidgetBody] = useState<any>(undefined);
  const [lastWidgetHeaders, setLastWidgetHeaders] = useState<
    Record<string, string> | undefined
  >(undefined);
  return (
    <TriggerFunctionSyncContext.Provider
      value={{
        lastWidgetId,
        setLastWidgetId,
        lastWidgetBody,
        setLastWidgetBody,
        lastWidgetHeaders,
        setLastWidgetHeaders,
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
