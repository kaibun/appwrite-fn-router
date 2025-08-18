import { useUIContext } from '@src/theme/UIContext';
import DiffCodeBlockFoldable from '@site/src/components/DiffCodeBlock/FoldableDiffCodeBlock';
import TriggerFunction from '@src/components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '@src/components/TriggerFunction/config';

export default ({
  stepNumber,
  next,
}: {
  stepNumber: number;
  next: () => void;
}) => {
  const { t } = useUIContext();

  return (
    <>
      <h2>{t.step3Title}</h2>
      <DiffCodeBlockFoldable
        before={
          require('!!raw-loader!@site/src/code-examples/main.example.ts.txt')
            .default
        }
        after={
          require('!!raw-loader!@site/src/code-examples/list-widgets.example.ts.txt')
            .default
        }
        language="typescript"
        // title={t.listWidgetsDiffTitle}
        // contextEnd={0}
      />
      <TriggerFunction
        method="GET"
        url={`${TRIGGER_API_BASE_URL}/widgets`}
        label={t.listWidgetsLabel}
        step={3}
        onStepDone={next}
        showDebugInfo={false}
      />
    </>
  );
};
