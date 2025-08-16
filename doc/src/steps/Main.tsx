// import CodeFromFile from '@src/components/CodeFromFile';
import DiffCodeBlockFoldable from '@src/components/DiffCodeBlock/DiffCodeBlockFoldable';
import StepNextButton from '@src/components/Steps/StepNextButton';

import { useI18n } from '@src/components/I18nProvider';
export default ({
  stepNumber,
  next,
}: {
  stepNumber: number;
  next: () => void;
}) => {
  const t = useI18n();
  return (
    <>
      <h2>{t.step2Title}</h2>
      <p>{t.mainStepDescription}</p>
      <DiffCodeBlockFoldable
        before={''}
        after={
          require('!!raw-loader!@site/src/code-examples/main.example.ts.txt')
            .default
        }
        language="typescript"
        // title={t.mainStepFileTitle}
      />
      <StepNextButton onClick={next} stepNumber={stepNumber}>
        {t.nextStep}
      </StepNextButton>
    </>
  );
};
