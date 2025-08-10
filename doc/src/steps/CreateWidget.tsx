import React from 'react';
import CodeFromFile from '../components/CodeFromFile';
import TriggerFunction from '../components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '../components/trigger-function-config';

export default ({ next }: { next: () => void }) => (
  <>
    {/* Titre géré dans le MDX */}
    <p>
      Cette étape permet d’ajouter un endpoint pour créer un widget à partir
      d’un objet <code>weight</code> et <code>color</code>. Le code ci-dessous
      effectue une validation simple et retourne le widget créé.
    </p>
    {/* @ts-ignore */}
    <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/create-widget.example.ts.txt')
          .default
      }
      language="typescript"
    />
    <TriggerFunction
      method="POST"
      url={`${TRIGGER_API_BASE_URL}/widgets`}
      body={{ weight: 42, color: 'red' }}
      label="Créer un widget"
      onStepDone={next}
    />
  </>
);
