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
      <h2>{t.step5Title}</h2>
      <p>{t.getWidgetDescription}</p>
      <FoldableDiffCodeBlock
        before={
          require('!!raw-loader!@site/src/code-examples/create-widget.example.ts.txt')
            .default
        }
        after={
          require('!!raw-loader!@site/src/code-examples/get-widget.example.ts.txt')
            .default
        }
        language="typescript"
        // title={t.getWidgetDiffTitle}
      />
      <TriggerFunction
        method="GET"
        url={`${TRIGGER_API_BASE_URL}/widgets/:id`}
        label={t.getWidgetLabel}
        step={5}
        onStepDone={next}
      />
    </>
  );
};
