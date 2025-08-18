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
      <h2>{t.step7Title}</h2>
      <p>{t.deleteWidgetDescription}</p>
      <FoldableDiffCodeBlock
        before={
          require('!!raw-loader!@site/src/code-examples/patch-widget.example.ts.txt')
            .default
        }
        after={
          require('!!raw-loader!@site/src/code-examples/delete-widget.example.ts.txt')
            .default
        }
        language="typescript"
        // title={t.deleteWidgetDiffTitle}
      />
      <TriggerFunction
        method="DELETE"
        url={`${TRIGGER_API_BASE_URL}/widgets/:id`}
        label={t.deleteWidgetLabel}
        urlParams={['id']}
        step={7}
        onStepDone={next}
      />
    </>
  );
};
