import React from 'react';
import CodeFromFile from '../components/CodeFromFile';
import DiffCodeBlock from '../components/DiffCodeBlock';
import TriggerFunction from '../components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '../components/trigger-function-config';

export default ({ next }: { next: () => void }) => (
  <>
    <h2>4. Ajouter une route POST pour créer un widget</h2>
    <p>
      Cette étape permet d’ajouter un endpoint pour créer un widget à partir
      d’un objet <code>weight</code> et <code>color</code>. Le code ci-dessous
      effectue une validation simple et retourne le widget créé.
    </p>
    {/* @ts-ignore */}
    {/* <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/create-widget.example.ts.txt')
          .default
      }
      language="typescript"
    /> */}
    <DiffCodeBlock
      before={
        require('!!raw-loader!@site/src/code-examples/list-widgets.example.ts.txt')
          .default
      }
      after={
        require('!!raw-loader!@site/src/code-examples/create-widget.example.ts.txt')
          .default
      }
      language="typescript"
      title="Ajout du POST /widgets"
    />
    {/* <StepNextButton onClick={next} stepNumber={4}>Étape suivante</StepNextButton> */}
    <TriggerFunction
      method="POST"
      url={`${TRIGGER_API_BASE_URL}/widgets`}
      body={{ weight: 42, color: 'red' }}
      label="Créer un widget"
      onStepDone={next}
    />
  </>
);
