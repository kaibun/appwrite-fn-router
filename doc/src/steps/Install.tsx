import React from 'react';
import CodeFromFile from '../components/CodeFromFile';
import StepNextButton from '../components/StepNextButton';

export default ({ next }: { next: () => void }) => (
  <>
    <CodeFromFile
      file={
        require('!!raw-loader!@site/src/code-examples/install.example.ts.txt')
          .default
      }
      language="bash"
    />
  </>
);
