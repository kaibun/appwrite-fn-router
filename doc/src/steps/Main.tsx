import { useUIContext } from '@src/theme/UIContext';
import DiffCodeBlockFoldable from '@site/src/components/DiffCodeBlock/FoldableDiffCodeBlock';
import StepNextButton from '@src/components/Steps/StepNextButton';

export default ({
  stepNumber,
  next,
}: {
  stepNumber: number;
  next: () => void;
}) => {
  const { t } = useUIContext();

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
