import { useUIContext } from '@src/theme/UIContext';
import { useStepMode } from '../components/Steps/StepProvider';
import FoldableDiffCodeBlock from '@site/src/components/DiffCodeBlock/FoldableDiffCodeBlock';
import StepNextButton from '@src/components/Steps/StepNextButton';

export default ({
  stepNumber,
  next,
}: {
  stepNumber: number;
  next: () => void;
}) => {
  const { t } = useUIContext();
  const { stepByStep } = useStepMode();

  return (
    <>
      <h2>{t.step2Title}</h2>
      <p>{t.mainStepDescription}</p>
      <FoldableDiffCodeBlock
        disableDiff={true}
        before={''}
        after={
          require('!!raw-loader!@site/src/code-examples/main.example.ts.txt')
            .default
        }
        language="typescript"
        showLineNumbers={true}
        // title={t.mainStepFileTitle}
      />
      {stepByStep && (
        <StepNextButton onClick={next} stepNumber={stepNumber}>
          {t.nextStep}
        </StepNextButton>
      )}
    </>
  );
};
