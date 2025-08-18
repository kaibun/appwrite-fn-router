import { useUIContext } from '@src/theme/UIContext';
import DiffCodeBlockFoldable from '@site/src/components/DiffCodeBlock/FoldableDiffCodeBlock';
import TriggerFunction from '@src/components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '@src/components/TriggerFunction/config';

export default ({
  next,
  stepNumber,
}: {
  next: () => void;
  stepNumber: number;
}) => {
  const { t } = useUIContext();

  return (
    <>
      <h2>{t.step6Title}</h2>
      <p>{t.patchWidgetDescription}</p>
      <DiffCodeBlockFoldable
        before={
          require('!!raw-loader!@site/src/code-examples/get-widget.example.ts.txt')
            .default
        }
        after={
          require('!!raw-loader!@site/src/code-examples/patch-widget.example.ts.txt')
            .default
        }
        language="typescript"
        // title={t.patchWidgetDiffTitle}
      />
      <TriggerFunction
        method="PATCH"
        url={`${TRIGGER_API_BASE_URL}/widgets/:id`}
        label={t.patchWidgetLabel}
        urlParams={['id']}
        body={{ weight: 15, color: 'blue' }}
        step={6}
        onStepDone={next}
      />
    </>
  );
};
