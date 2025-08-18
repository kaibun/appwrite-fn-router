import CodeBlock from '@theme/CodeBlock';

/**
 * Displays the source code of a file inside a CodeBlock component.
 *
 * Usage:
 *
 * ```jsx
 * <CodeFromFile
 *   file={require('!!raw-loader!../code-examples/bulk-create-example.ts').default}
 *   language="typescript"
 * />
 * ```
 */

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
