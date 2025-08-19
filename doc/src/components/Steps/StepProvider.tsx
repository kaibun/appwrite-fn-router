import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
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
  maxStepReached: number;
  totalSteps: number;
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
  totalSteps: number;
}

export const StepProvider = ({
  children,
  initialStep = 1,
  totalSteps,
}: StepProviderProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [stepByStep, setStepByStep] = useState(true);
  const [maxStepReached, setMaxStepReached] = useState(initialStep);

  // When stepByStep is disabled, force maxStepReached to totalSteps
  const effectiveMaxStepReached = stepByStep ? maxStepReached : totalSteps;

  const nextStep = useCallback(() => {
    setCurrentStep((s) => {
      setMaxStepReached((max) => Math.max(max, s + 1));
      return s + 1;
    });
  }, []);
  const goToStep = useCallback((n: number) => {
    setCurrentStep(n);
    setMaxStepReached((max) => Math.max(max, n));
  }, []);

  // Synchronise l’URL à chaque changement d’étape
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('step') !== String(currentStep)) {
      params.set('step', String(currentStep));
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
    // Désactive le mode pas à pas à la dernière étape
    if (currentStep === 10 && stepByStep) {
      setStepByStep(false);
    }
  }, [currentStep, stepByStep]);

  return (
    <StepModeContext.Provider value={{ stepByStep, setStepByStep }}>
      <StepContext.Provider
        value={{
          currentStep,
          nextStep,
          goToStep,
          maxStepReached: effectiveMaxStepReached,
          totalSteps,
        }}
      >
        {children}
      </StepContext.Provider>
    </StepModeContext.Provider>
  );
};
