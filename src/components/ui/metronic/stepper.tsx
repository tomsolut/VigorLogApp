// Metronic Stepper Component - Adapted for VigorLog
'use client';

import * as React from 'react';
import { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Check, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

// Types
type StepperOrientation = 'horizontal' | 'vertical';
type StepState = 'active' | 'completed' | 'inactive' | 'loading';

interface StepperContextValue {
  activeStep: number;
  setActiveStep: (step: number) => void;
  stepsCount: number;
  orientation: StepperOrientation;
}

interface StepItemContextValue {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
}

const StepperContext = createContext<StepperContextValue | undefined>(undefined);
const StepItemContext = createContext<StepItemContextValue | undefined>(undefined);

function useStepper() {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error('useStepper must be used within a Stepper');
  return ctx;
}

function useStepItem() {
  const ctx = useContext(StepItemContext);
  if (!ctx) throw new Error('useStepItem must be used within a StepperItem');
  return ctx;
}

// Main Stepper Component
interface MetronicStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: StepperOrientation;
}

function MetronicStepper({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
  ...props
}: MetronicStepperProps) {
  const [activeStep, setActiveStep] = React.useState(defaultValue);

  const handleSetActiveStep = React.useCallback(
    (step: number) => {
      if (value === undefined) {
        setActiveStep(step);
      }
      onValueChange?.(step);
    },
    [value, onValueChange],
  );

  const currentStep = value ?? activeStep;

  const stepsCount = React.Children.toArray(children).filter(
    (child): child is React.ReactElement =>
      React.isValidElement(child) && child.type === MetronicStepperItem
  ).length;

  const contextValue = React.useMemo<StepperContextValue>(
    () => ({
      activeStep: currentStep,
      setActiveStep: handleSetActiveStep,
      stepsCount,
      orientation,
    }),
    [currentStep, handleSetActiveStep, stepsCount, orientation]
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        className={cn(
          'flex w-full',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
        data-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}

// Stepper Item
interface MetronicStepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

function MetronicStepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: MetronicStepperItemProps) {
  const { activeStep, orientation } = useStepper();

  const state: StepState = completed || step < activeStep 
    ? 'completed' 
    : activeStep === step 
    ? 'active' 
    : 'inactive';

  const isLoading = loading && step === activeStep;

  return (
    <StepItemContext.Provider value={{ step, state, isDisabled: disabled, isLoading }}>
      <div
        className={cn(
          'flex items-center',
          orientation === 'horizontal' ? 'flex-1' : 'flex-col',
          className
        )}
        data-state={state}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  );
}

// Stepper Trigger
interface MetronicStepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function MetronicStepperTrigger({ className, children, ...props }: MetronicStepperTriggerProps) {
  const { setActiveStep } = useStepper();
  const { step, state, isDisabled, isLoading } = useStepItem();

  return (
    <button
      className={cn(
        'flex items-center gap-3 cursor-pointer outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={() => setActiveStep(step)}
      disabled={isDisabled}
      data-state={state}
      {...props}
    >
      {children}
    </button>
  );
}

// Stepper Indicator
function MetronicStepperIndicator({ className }: { className?: string }) {
  const { state, isLoading, step } = useStepItem();

  return (
    <div
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all',
        {
          'border-primary bg-primary text-primary-foreground': state === 'active',
          'border-primary bg-primary text-primary-foreground': state === 'completed',
          'border-muted bg-background text-muted-foreground': state === 'inactive',
        },
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : state === 'completed' ? (
        <Check className="h-5 w-5" />
      ) : (
        <span>{step}</span>
      )}
    </div>
  );
}

// Stepper Separator
function MetronicStepperSeparator({ className }: { className?: string }) {
  const { state } = useStepItem();
  const { orientation, stepsCount, activeStep } = useStepper();
  const { step } = useStepItem();

  // Don't show separator for the last step
  if (step === stepsCount) return null;

  return (
    <div
      className={cn(
        'flex-1 transition-all',
        orientation === 'horizontal' ? 'mx-4 h-0.5' : 'my-4 w-0.5 mx-auto',
        state === 'completed' || step < activeStep ? 'bg-primary' : 'bg-muted',
        className
      )}
    />
  );
}

// Stepper Title
function MetronicStepperTitle({ children, className }: React.ComponentProps<'h3'>) {
  const { state } = useStepItem();

  return (
    <h3 
      className={cn(
        'text-sm font-medium transition-colors',
        state === 'active' && 'text-primary',
        state === 'completed' && 'text-primary',
        state === 'inactive' && 'text-muted-foreground',
        className
      )}
    >
      {children}
    </h3>
  );
}

// Stepper Description
function MetronicStepperDescription({ children, className }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('text-xs text-muted-foreground mt-1', className)}>
      {children}
    </p>
  );
}

// Stepper Content
interface MetronicStepperContentProps extends React.ComponentProps<'div'> {
  value: number;
}

function MetronicStepperContent({ value, children, className, ...props }: MetronicStepperContentProps) {
  const { activeStep } = useStepper();
  
  if (value !== activeStep) return null;

  return (
    <div
      className={cn('mt-4 w-full', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Specialized Check-in Stepper for VigorLog
interface CheckInStepperProps {
  onComplete?: () => void;
}

const CheckInStepper: React.FC<CheckInStepperProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = React.useState(1);

  const steps = [
    { title: 'Schlaf', description: 'Wie war deine Nacht?' },
    { title: 'Körper', description: 'Wie fühlst du dich?' },
    { title: 'Stimmung', description: 'Wie ist deine Laune?' },
    { title: 'Zusammenfassung', description: 'Überprüfe deine Angaben' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Stepper */}
      <div className="hidden md:block">
        <MetronicStepper value={currentStep} onValueChange={setCurrentStep}>
          {steps.map((step, index) => (
            <MetronicStepperItem key={index} step={index + 1}>
              <MetronicStepperTrigger>
                <MetronicStepperIndicator />
                <div>
                  <MetronicStepperTitle>{step.title}</MetronicStepperTitle>
                  <MetronicStepperDescription>{step.description}</MetronicStepperDescription>
                </div>
              </MetronicStepperTrigger>
              <MetronicStepperSeparator />
            </MetronicStepperItem>
          ))}
          
          {/* Content must be inside the Stepper context */}
          <div className="mt-8">
            {steps.map((step, index) => (
              <MetronicStepperContent key={index} value={index + 1}>
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  <div className="flex justify-between pt-4">
                    <button
                      onClick={handlePrev}
                      disabled={currentStep === 1}
                      className="px-4 py-2 text-sm border rounded-md disabled:opacity-50"
                    >
                      Zurück
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"
                    >
                      {currentStep === steps.length ? 'Abschließen' : 'Weiter'}
                    </button>
                  </div>
                </div>
              </MetronicStepperContent>
            ))}
          </div>
        </MetronicStepper>
      </div>

      {/* Mobile Stepper - Simple Progress */}
      <div className="md:hidden">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Schritt {currentStep} von {steps.length}</span>
            <span className="text-muted-foreground">{steps[currentStep - 1].title}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Mobile Step Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            
            return (
              <button
                key={index}
                onClick={() => setCurrentStep(stepNum)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  isActive ? 'w-8 bg-primary' : 'w-2',
                  isCompleted ? 'bg-primary' : 'bg-muted',
                  !isActive && !isCompleted && 'hover:bg-muted-foreground/50'
                )}
                aria-label={`Gehe zu Schritt ${stepNum}`}
              />
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold text-center">{steps[currentStep - 1].title}</h3>
          <p className="text-muted-foreground text-center">{steps[currentStep - 1].description}</p>
          
          {/* Mobile Navigation - Full Width Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm border rounded-lg disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              <ChevronLeft className="w-4 h-4" />
              Zurück
            </button>
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm bg-primary text-primary-foreground rounded-lg transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              {currentStep === steps.length ? (
                <>
                  Abschließen
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Weiter
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  MetronicStepper,
  MetronicStepperItem,
  MetronicStepperTrigger,
  MetronicStepperIndicator,
  MetronicStepperSeparator,
  MetronicStepperTitle,
  MetronicStepperDescription,
  MetronicStepperContent,
  CheckInStepper,
  useStepper,
  useStepItem,
};