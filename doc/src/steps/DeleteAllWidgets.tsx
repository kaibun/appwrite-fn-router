import React from 'react';
import CodeFromFile from '../components/CodeFromFile';
import TriggerFunction from '../components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '../components/trigger-function-config';

export default ({ next }: { next: () => void }) => (
  <>
    {/* Titre géré dans le MDX */}
    <p>
      Pour le tutoriel, il peut être utile de pouvoir réinitialiser la
      collection de widgets d’un coup. Attention, ce genre d’opération est
      puissante et doit être réservée à des cas bien identifiés (admin, démo,
      etc.).
    </p>
    {/* @ts-ignore */}
    <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/delete-all-widgets.example.ts.txt')
          .default
      }
      language="typescript"
    />
    <TriggerFunction
      method="DELETE"
      url={`${TRIGGER_API_BASE_URL}/widgets`}
      label="Supprimer tous les widgets (purge)"
      onStepDone={next}
    />
  </>
);
