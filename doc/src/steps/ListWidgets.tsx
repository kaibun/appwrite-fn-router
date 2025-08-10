import React from 'react';
// import CodeFromFile from '../components/CodeFromFile';
import DiffCodeBlock from '../components/DiffCodeBlock';
import TriggerFunction from '../components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '../components/trigger-function-config';

export default ({
  stepNumber,
  next,
}: {
  stepNumber: number;
  next: () => void;
}) => (
  <>
    <h2>3. Ajouter une route GET pour lister les widgets</h2>
    {/* <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/get-widget.example.ts.txt')
          .default
      }
      language="typescript"
    /> */}
    <DiffCodeBlock
      before={
        require('!!raw-loader!@site/src/code-examples/main.example.ts.txt')
          .default
      }
      after={
        require('!!raw-loader!@site/src/code-examples/list-widgets.example.ts.txt')
          .default
      }
      language="typescript"
      title="Ajout du GET /widgets"
    />
    <TriggerFunction
      method="GET"
      url={`${TRIGGER_API_BASE_URL}/widgets`}
      label="Lister les widgets"
      onStepDone={next}
    />
  </>
);
