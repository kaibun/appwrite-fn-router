import React from 'react';
import CodeFromFile from '../components/CodeFromFile';
import TriggerFunction from '../components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '../components/trigger-function-config';

export default ({ next }: { next: () => void }) => (
  <>
    {/* Titre géré dans le MDX */}
    <p>
      Cette étape permet de supprimer un widget existant par son ID. Si l’ID
      n’existe pas, une erreur 404 est retournée.
    </p>
    {/* @ts-ignore */}
    <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/delete-widget.example.ts.txt')
          .default
      }
      language="typescript"
    />
    <TriggerFunction
      method="DELETE"
      url={`${TRIGGER_API_BASE_URL}/widgets/:id`}
      label="Supprimer le widget"
      urlParams={['id']}
      onStepDone={next}
    />
  </>
);
