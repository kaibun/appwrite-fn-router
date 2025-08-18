import { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';

import { useUIContext } from '@src/theme/UIContext';
import { DiffBlock, addMagicCommentsToDiff } from './diffFoldUtils';
import styles from './FoldableCodeBlock.module.css';

interface FoldableCodeBlockProps {
  language?: string;
  block: DiffBlock;
}

export default function FoldableCodeBlock({
  language = 'typescript',
  block,
  isFirst = false,
  isLast = false,
}: FoldableCodeBlockProps & { isFirst?: boolean; isLast?: boolean }) {
  const { t } = useUIContext();

  const { type, code, startLine, endLine, folded } = block;
  const [isFolded, setIsFolded] = useState(folded);
  const showFoldButton = type === 'unchanged' && folded;
  const codeWithMagic = addMagicCommentsToDiff(code);
  const generatedClass = [
    styles.block,
    isFirst ? styles.firstBlock : '',
    isLast ? styles.lastBlock : '',
    type === 'unchanged' && folded ? styles.foldedBlock : '',
    type === 'added' ? styles.addedBlock : '',
    type === 'removed' ? styles.removedBlock : '',
    type === 'changed' ? styles.changedBlock : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <>
      {showFoldButton && isFolded && (
        <button
          className={styles.foldButton}
          onClick={() => setIsFolded(false)}
        >
          {startLine && endLine
            ? t('showLines', { start: startLine, end: endLine })
            : t('show')}
        </button>
      )}
      {showFoldButton && !isFolded && (
        <button className={styles.foldButton} onClick={() => setIsFolded(true)}>
          {t('fold')}{' '}
          {startLine && endLine
            ? t('lines', { start: startLine, end: endLine })
            : t('fold')}
        </button>
      )}
      {!isFolded && (
        <CodeBlock
          language={language}
          showLineNumbers={startLine}
          className={[
            styles.block,
            isFirst ? styles.firstBlock : '',
            isLast ? styles.lastBlock : '',
            type === 'unchanged' && folded ? styles.foldedBlock : '',
            type === 'added' ? styles.addedBlock : '',
            type === 'removed' ? styles.removedBlock : '',
            type === 'changed' ? styles.changedBlock : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {codeWithMagic}
        </CodeBlock>
      )}
    </>
  );
}
