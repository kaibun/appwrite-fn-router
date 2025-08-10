import React from 'react';
import CodeBlock from '@theme/CodeBlock';

// Ce composant importe le code source d'un fichier et l'affiche dans un CodeBlock
// Utilisation : <CodeFromFile file={require('!!raw-loader!../code-examples/bulk-create-example.ts').default} language="typescript" />

interface CodeFromFileProps {
  file: string;
  language?: string;
}

const CodeFromFile: React.FC<CodeFromFileProps> = ({
  file,
  language = 'typescript',
}) => {
  return <CodeBlock language={language}>{file}</CodeBlock>;
};

export default CodeFromFile;
