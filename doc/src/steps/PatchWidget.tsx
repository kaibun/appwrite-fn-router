import React from 'react';
// import CodeFromFile from '../components/CodeFromFile';
import DiffCodeBlock from '../components/DiffCodeBlock';
import TriggerFunction from '../components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '../components/trigger-function-config';

export default ({ next }: { next: () => void }) => (
  <>
    <h2>6. Ajouter une route PATCH pour mettre à jour un widget</h2>
    <p>
      Cette étape permet de mettre à jour un widget existant. Si l’ID n’existe
      pas, une erreur 404 est retournée. Le code ci-dessous met à jour le poids
      et la couleur du widget.
    </p>
    {/* @ts-ignore */}
    {/* <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/patch-widget.example.ts.txt')
          .default
      }
      language="typescript"
    /> */}
    <DiffCodeBlock
      before={
        require('!!raw-loader!@site/src/code-examples/get-widget.example.ts.txt')
          .default
      }
      after={
        require('!!raw-loader!@site/src/code-examples/patch-widget.example.ts.txt')
          .default
      }
      language="typescript"
      title="Ajout du PATCH /widgets/:id"
    />
    {/* <StepNextButton onClick={next} stepNumber={6}>Étape suivante</StepNextButton> */}
    <TriggerFunction
      method="PATCH"
      url={`${TRIGGER_API_BASE_URL}/widgets/:id`}
      label="PATCHer le widget"
      urlParams={['id']}
      body={{ weight: 15, color: 'blue' }}
      onStepDone={next}
    />
  </>
);
