import { useUIContext } from '@src/theme/UIContext';
import TriggerFunction from '@src/components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '@src/components/TriggerFunction/config';
import DiffCodeBlockFoldable from '@src/components/DiffCodeBlock/FoldableDiffCodeBlock';

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
      <h2>{t.step8Title}</h2>
      <p>{t.bulkCreateWidgetsDescription}</p>
      <DiffCodeBlockFoldable
        before={
          require('!!raw-loader!@site/src/code-examples/delete-widget.example.ts.txt')
            .default
        }
        after={
          require('!!raw-loader!@site/src/code-examples/bulk-create-widgets.example.ts.txt')
            .default
        }
        language="typescript"
        // title={t.bulkCreateWidgetsDiffTitle}
      />
      <TriggerFunction
        method="POST"
        url={`${TRIGGER_API_BASE_URL}/widgets/bulk`}
        body={[
          { weight: 42, color: 'red' },
          { weight: 15, color: 'blue' },
          { weight: 78, color: 'green' },
        ]}
        label={t.bulkCreateWidgetsLabel}
        onStepDone={next}
      />
      step={8}
    </>
  );
};
