import React from 'react';
// import CodeFromFile from '../components/CodeFromFile';
import DiffCodeBlock from '../components/DiffCodeBlock';
import StepNextButton from '../components/StepNextButton';

export default ({
  stepNumber,
  next,
}: {
  stepNumber: number;
  next: () => void;
}) => (
  <>
    <h2>2. Créer le routeur principal</h2>
    <p>
      Créez un fichier <code>main.ts</code> qui contiendra le code source de
      base pour votre fonction Appwrite :
    </p>
    {/* <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/main.example.ts.txt')
          .default
      }
      language="typescript"
    /> */}
    <DiffCodeBlock
      before={''}
      after={
        require('!!raw-loader!@site/src/code-examples/main.example.ts.txt')
          .default
      }
      language="typescript"
      title="Nouveau fichier main.ts"
      disableDiff
    />
    <StepNextButton onClick={next} stepNumber={stepNumber}>
      Étape suivante
    </StepNextButton>
  </>
);
