import React from 'react';
// import CodeFromFile from '../components/CodeFromFile';
import DiffCodeBlock from '../components/DiffCodeBlock';
import TriggerFunction from '../components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '../components/trigger-function-config';

export default ({ next }: { next: () => void }) => (
  <>
    <h2>8. Ajouter un endpoint POST /bulk/widgets pour la création groupée</h2>
    <p>
      Il est tout à fait RESTful d’exposer un _endpoint_ permettant de créer
      plusieurs ressources de manière groupée, tant que le groupe est bien
      identifié et manipulé de façon sûre. Cela permet d’optimiser les coûts et
      les performances (moins d’appels réseau, de latence, de facturation,
      etc.).
    </p>
    {/* @ts-ignore */}
    {/* <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/bulk-create-example.example.ts.txt')
          .default
      }
      language="typescript"
    /> */}
    <DiffCodeBlock
      before={
        require('!!raw-loader!@site/src/code-examples/delete-widget.example.ts.txt')
          .default
      }
      after={
        require('!!raw-loader!@site/src/code-examples/bulk-create-widgets.example.ts.txt')
          .default
      }
      language="typescript"
      title="Ajout du bulk POST /widgets"
    />
    {/* <StepNextButton onClick={next} stepNumber={8}>Étape suivante</StepNextButton> */}
    <TriggerFunction
      method="POST"
      url={`${TRIGGER_API_BASE_URL}/widgets/bulk`}
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
