import React from 'react';
// import CodeFromFile from '../components/CodeFromFile';
import DiffCodeBlock from '../components/DiffCodeBlock';
import TriggerFunction from '../components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '../components/trigger-function-config';

export default ({ next }: { next: () => void }) => (
  <>
    <h2>5. Ajouter une route GET pour récupérer un widget par ID</h2>
    <p>
      Cette étape permet de récupérer un widget par son identifiant. Si l’ID
      n’existe pas, une erreur 404 est retournée.
    </p>
    {/* @ts-ignore */}
    {/* <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/get-widget.example.ts.txt')
          .default
      }
      language="typescript"
    /> */}
    <DiffCodeBlock
      before={
        require('!!raw-loader!@site/src/code-examples/create-widget.example.ts.txt')
          .default
      }
      after={
        require('!!raw-loader!@site/src/code-examples/get-widget.example.ts.txt')
          .default
      }
      language="typescript"
      title="Ajout du GET /widgets/:id"
    />
    {/* <StepNextButton onClick={next} stepNumber={5}>Étape suivante</StepNextButton> */}
    <TriggerFunction
      method="GET"
      url={`${TRIGGER_API_BASE_URL}/widgets/:id`}
      label="Récupérer un widget par ID"
      urlParams={['id']}
      onStepDone={next}
    />
  </>
);
