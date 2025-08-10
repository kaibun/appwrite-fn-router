import React from 'react';
// import CodeFromFile from '../components/CodeFromFile';
import DiffCodeBlock from '../components/DiffCodeBlock';
import TriggerFunction from '../components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '../components/trigger-function-config';

export default ({ next }: { next: () => void }) => (
  <>
    <h2>9. Ajouter un endpoint DELETE /widgets pour tous les supprimer</h2>
    <p>
      Attention, ce genre d’opération est puissante donc dangereuse ! Elle
      devrait sans doute être réservée à des cas bien identifiés (admin, démo,
      etc.). Dans le cadre de ce tutoriel, c’est bien pratique ;)
    </p>
    {/* @ts-ignore */}
    {/* <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/delete-all-widgets.example.ts.txt')
          .default
      }
      language="typescript"
    /> */}
    <DiffCodeBlock
      before={
        require('!!raw-loader!@site/src/code-examples/bulk-create-widgets.example.ts.txt')
          .default
      }
      after={
        require('!!raw-loader!@site/src/code-examples/delete-all-widgets.example.ts.txt')
          .default
      }
      language="typescript"
      title="Ajout du bulk DELETE /widgets"
    />
    {/* <StepNextButton onClick={next} stepNumber={9}>Étape suivante</StepNextButton> */}
    <TriggerFunction
      method="DELETE"
      url={`${TRIGGER_API_BASE_URL}/widgets`}
      label="Supprimer tous les widgets !"
      onStepDone={next}
    />
  </>
);
