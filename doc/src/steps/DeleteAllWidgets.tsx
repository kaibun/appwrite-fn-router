import TriggerFunction from '@src/components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '@src/components/TriggerFunction/config';
import { useI18n } from '@src/components/I18nProvider';
import DiffCodeBlockFoldable from '../components/DiffCodeBlock/DiffCodeBlockFoldable';

export default ({
  next,
  stepNumber,
}: {
  next: () => void;
  stepNumber: number;
}) => {
  const t = useI18n();
  return (
    <>
      <h2>{t.step9Title}</h2>
      <p>{t.deleteAllWidgetsDescription}</p>
      <DiffCodeBlockFoldable
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
