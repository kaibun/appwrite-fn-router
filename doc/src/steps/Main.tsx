import React from 'react';
import CodeFromFile from '../components/CodeFromFile';
import StepNextButton from '../components/StepNextButton';

export default ({ next }: { next: () => void }) => (
  <>
    {/* Titre géré dans le MDX */}
    <p>
      Créez un fichier <code>main.ts</code> dans votre fonction Appwrite :
    </p>
    <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/main.example.ts.txt')
          .default
      }
      language="typescript"
    />
    <StepNextButton onClick={next}>Étape suivante</StepNextButton>
  </>
);
