import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

interface StepModeContextType {
  stepByStep: boolean;
  setStepByStep: (v: boolean) => void;
}

const StepModeContext = createContext<StepModeContextType | undefined>(
  undefined
);

export const useStepMode = () => {
  const ctx = useContext(StepModeContext);
  if (!ctx) throw new Error('useStepMode must be used within a StepProvider');
  return ctx;
};

interface StepContextType {
  currentStep: number;
  nextStep: () => void;
  goToStep: (n: number) => void;
}

const StepContext = createContext<StepContextType | undefined>(undefined);

export const useStep = () => {
  const ctx = useContext(StepContext);
  if (!ctx) throw new Error('useStep must be used within a StepProvider');
  return ctx;
};

interface StepProviderProps {
  children: ReactNode;
  initialStep?: number;
}

export const StepProvider = ({
  children,
  initialStep = 1,
}: StepProviderProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [stepByStep, setStepByStep] = useState(true);

  const nextStep = useCallback(() => setCurrentStep((s) => s + 1), []);
  const goToStep = useCallback((n: number) => setCurrentStep(n), []);

  return (
    <StepModeContext.Provider value={{ stepByStep, setStepByStep }}>
      <StepContext.Provider value={{ currentStep, nextStep, goToStep }}>
        {children}
      </StepContext.Provider>
    </StepModeContext.Provider>
  );
};
