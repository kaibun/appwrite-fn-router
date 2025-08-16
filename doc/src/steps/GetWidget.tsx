// import CodeFromFile from '@src/components/CodeFromFile';
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
      <h2>{t.step5Title}</h2>
      <p>{t.getWidgetDescription}</p>
      <DiffCodeBlockFoldable
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
        urlParams={['id']}
        step={5}
        onStepDone={next}
      />
    </>
  );
};
