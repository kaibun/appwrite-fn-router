import { useUIContext } from '@src/theme/UIContext';
import FoldableDiffCodeBlock from '@site/src/components/DiffCodeBlock/FoldableDiffCodeBlock';
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
      <h2>{t.step4Title}</h2>
      <p>{t.createWidgetDescription}</p>
      <FoldableDiffCodeBlock
        before={
          require('!!raw-loader!@site/src/code-examples/list-widgets.example.ts.txt')
            .default
        }
        after={
          require('!!raw-loader!@site/src/code-examples/create-widget.example.ts.txt')
            .default
        }
        language="typescript"
        // title={t.createWidgetDiffTitle}
      />
      <TriggerFunction
        method="POST"
        url={`${TRIGGER_API_BASE_URL}/widgets`}
        body={{ weight: 42, color: 'red' }}
        label={t.createWidgetLabel}
        step={4}
        onStepDone={next}
      />
    </>
  );
};
