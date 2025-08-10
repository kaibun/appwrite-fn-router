import React from 'react';
import CodeFromFile from '../components/CodeFromFile';
import TriggerFunction from '../components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '../components/trigger-function-config';

export default ({ next }: { next: () => void }) => (
  <>
    {/* Titre géré dans le MDX */}
    <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/get-widget.example.ts.txt')
          .default
      }
      language="typescript"
    />
    <TriggerFunction
      method="GET"
      url={`${TRIGGER_API_BASE_URL}/widgets`}
      label="Lister les widgets"
      onStepDone={next}
    />
  </>
);
