import { JSX } from 'react';

import { useUIContext } from '@src/theme/UIContext';
import { useStep } from '@src/components/Steps/StepProvider';
import Step from '@src/components/Steps/Step';
import StepNextButton from '@src/components/Steps/StepNextButton';
import StepByStepToc from '@src/components/Steps/StepByStepToc';

import Install from './Install';
import Main from './Main';
import ListWidgets from './ListWidgets';
import CreateWidget from './CreateWidget';
import GetWidget from './GetWidget';
import PatchWidget from './PatchWidget';
import DeleteWidget from './DeleteWidget';
import BulkCreateWidgets from './BulkCreateWidgets';
import DeleteAllWidgets from './DeleteAllWidgets';

export type Steps = Array<{
  number: number;
  content: (props: { next: () => void }) => JSX.Element;
}>;

export const steps: Steps = [
  {
    number: 1,
    content: ({ next }: { next: () => void }) => {
      const { t } = useUIContext();
      return (
        <>
          <h2>{t.step1Title}</h2>
          <Install next={next} />
        </>
      );
    },
  },
  { number: 2, content: ({ next }) => <Main next={next} stepNumber={2} /> },
  {
    number: 3,
    content: ({ next }) => <ListWidgets next={next} stepNumber={3} />,
  },
  {
    number: 4,
    content: ({ next }) => <CreateWidget next={next} stepNumber={4} />,
  },
  {
    number: 5,
    content: ({ next }) => <GetWidget next={next} stepNumber={5} />,
  },
  {
    number: 6,
    content: ({ next }) => <PatchWidget next={next} stepNumber={6} />,
  },
  {
    number: 7,
    content: ({ next }) => <DeleteWidget next={next} stepNumber={7} />,
  },
  {
    number: 8,
    content: ({ next }) => <BulkCreateWidgets next={next} stepNumber={8} />,
  },
  {
    number: 9,
    content: ({ next }) => <DeleteAllWidgets next={next} stepNumber={9} />,
  },
  {
    number: 10,
    content: ({ next }) => {
      const { t } = useUIContext();
      return (
        <>
          <h2>{t.goFurtherTitle}</h2>
          <p>{t.goFurtherIntro}</p>
          <ul>
            <li>{t.goFurtherPagination}</li>
            <li>{t.goFurtherMiddlewares}</li>
            <li>{t.goFurtherTests}</li>
            <li>
              {t.goFurtherDocs}
              <a href="https://appwrite.io/docs">Appwrite documentation</a>
            </li>
            <li>{t.goFurtherContribute}</li>
          </ul>
        </>
      );
    },
  },
];

export default function StepByStepContent() {
  const { maxStepReached } = useStep();
  return (
    <>
      {steps.map(({ number, content }) =>
        number <= maxStepReached ? (
          <Step number={number} key={number}>
            {content}
          </Step>
        ) : null
      )}
      <div style={{ width: 340, marginLeft: 32 }}>
        <StepByStepToc />
      </div>
    </>
  );
}
