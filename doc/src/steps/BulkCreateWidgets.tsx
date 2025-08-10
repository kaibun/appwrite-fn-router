import React from 'react';
import CodeFromFile from '../components/CodeFromFile';
import TriggerFunction from '../components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '../components/trigger-function-config';

export default ({ next }: { next: () => void }) => (
  <>
    {/* Titre géré dans le MDX */}
    <p>
      Il est tout à fait RESTful d’exposer un endpoint permettant de créer
      plusieurs ressources d’un coup, tant que le groupe est bien identifié et
      manipulé de façon sûre. Cela permet d’optimiser les coûts et les
      performances (moins d’appels réseau, moins de latence, etc.).
    </p>
    <p>
      Voici comment adapter l’implémentation de l’étape 4 pour supporter la
      création groupée :
    </p>
    {/* @ts-ignore */}
    <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/bulk-create-example.example.ts.txt')
          .default
      }
      language="typescript"
    />
    <TriggerFunction
      method="POST"
      url={`${TRIGGER_API_BASE_URL}/widgets`}
      body={[
        { weight: 42, color: 'red' },
        { weight: 15, color: 'blue' },
        { weight: 78, color: 'green' },
      ]}
      label="Créer des widgets en bulk"
      onStepDone={next}
    />
  </>
);
