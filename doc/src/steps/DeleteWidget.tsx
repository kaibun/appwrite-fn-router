import React from 'react';
// import CodeFromFile from '../components/CodeFromFile';
import DiffCodeBlock from '../components/DiffCodeBlock';
import TriggerFunction from '../components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '../components/trigger-function-config';

export default ({ next }: { next: () => void }) => (
  <>
    <h2>7. Ajouter une route DELETE pour supprimer un widget</h2>
    <p>
      Cette étape permet de supprimer un widget existant par son ID. Si l’ID
      n’existe pas, une erreur 404 est retournée.
    </p>
    {/* @ts-ignore */}
    {/* <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/delete-widget.example.ts.txt')
          .default
      }
      language="typescript"
    /> */}
    <DiffCodeBlock
      before={
        require('!!raw-loader!@site/src/code-examples/patch-widget.example.ts.txt')
          .default
      }
      after={
        require('!!raw-loader!@site/src/code-examples/delete-widget.example.ts.txt')
          .default
      }
      language="typescript"
      title="Ajout du DELETE /widgets/:id"
    />
    {/* <StepNextButton onClick={next} stepNumber={7}>Étape suivante</StepNextButton> */}
    <TriggerFunction
      method="DELETE"
      url={`${TRIGGER_API_BASE_URL}/widgets/:id`}
      label="Supprimer le widget"
      urlParams={['id']}
      onStepDone={next}
    />
  </>
);
