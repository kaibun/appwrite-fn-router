import CodeFromFile from '@src/components/CodeFromFile';

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
