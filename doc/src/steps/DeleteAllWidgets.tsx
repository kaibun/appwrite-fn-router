import { useUIContext } from '@src/theme/UIContext';
import TriggerFunction from '@src/components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '@src/components/TriggerFunction/config';
import FoldableDiffCodeBlock from '../components/DiffCodeBlock/FoldableDiffCodeBlock';

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
      <h2>{t.step9Title}</h2>
      <p>{t.deleteAllWidgetsDescription}</p>
      <FoldableDiffCodeBlock
        before={
          require('!!raw-loader!@site/src/code-examples/bulk-create-widgets.example.ts.txt')
            .default
        }
        after={
          require('!!raw-loader!@site/src/code-examples/delete-all-widgets.example.ts.txt')
            .default
        }
        language="typescript"
        // title={t.deleteAllWidgetsDiffTitle}
      />
      <TriggerFunction
        method="DELETE"
        url={`${TRIGGER_API_BASE_URL}/widgets`}
        label={t.deleteAllWidgetsLabel}
        step={9}
        onStepDone={next}
      />
    </>
  );
};
