// import CodeFromFile from '@site/components/CodeFromFile';
import DiffCodeBlockFoldable from '@src/components/DiffCodeBlock/DiffCodeBlockFoldable';
import TriggerFunction from '@src/components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '@src/components/TriggerFunction/config';

import { useI18n } from '@src/components/I18nProvider';
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
      <h2>{t.step4Title}</h2>
      <p>{t.createWidgetDescription}</p>
      <DiffCodeBlockFoldable
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
