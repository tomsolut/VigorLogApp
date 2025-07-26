// Mobile-optimized Stepper Component for VigorLog
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { MetronicProgress } from './progress';

interface MobileStepperProps {
  steps: Array<{
    title: string;
    description?: string;
  }>;
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete?: () => void;
}

export function MobileStepper({ steps, currentStep, onStepChange, onComplete }: MobileStepperProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
  
  const handleNext = () => {
    if (currentStep < steps.length) {
      onStepChange(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="w-full space-y-4">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Schritt {currentStep} von {steps.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progress)}% abgeschlossen
          </span>
        </div>
        <MetronicProgress value={progress} size="sm" indicatorVariant="success" />
      </div>

      {/* Step Indicators - Mobile Dots */}
      <div className="flex items-center justify-center gap-2 py-2">
        {steps.map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <button
              key={index}
              onClick={() => onStepChange(stepNum)}
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

      {/* Current Step Content */}
      <div className="space-y-4 min-h-[200px]">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">{currentStepData?.title}</h3>
          {currentStepData?.description && (
            <p className="text-muted-foreground">{currentStepData.description}</p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 h-12 px-4',
            'border border-input rounded-lg font-medium',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'active:scale-[0.98]'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Zurück
        </button>
        
        <button
          onClick={handleNext}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 h-12 px-4',
            'bg-primary text-primary-foreground rounded-lg font-medium',
            'transition-all duration-200',
            'hover:bg-primary/90',
            'active:scale-[0.98]'
          )}
        >
          {currentStep === steps.length ? (
            <>
              Abschließen
              <Check className="h-4 w-4" />
            </>
          ) : (
            <>
              Weiter
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Enhanced Mobile Check-in Stepper
interface MobileCheckInStepperProps {
  onComplete?: () => void;
  children?: (step: number) => React.ReactNode;
}

export function MobileCheckInStepper({ onComplete, children }: MobileCheckInStepperProps) {
  const [currentStep, setCurrentStep] = React.useState(1);

  const steps = [
    { 
      title: 'Schlafqualität', 
      description: 'Wie war deine Nacht?',
      icon: 'fa-solid fa-bed'
    },
    { 
      title: 'Körperliches Befinden', 
      description: 'Wie fühlst du dich körperlich?',
      icon: 'fa-solid fa-heart-pulse'
    },
    { 
      title: 'Stimmung', 
      description: 'Wie ist deine mentale Verfassung?',
      icon: 'fa-solid fa-face-smile'
    },
    { 
      title: 'Zusammenfassung', 
      description: 'Überprüfe deine Eingaben',
      icon: 'fa-solid fa-clipboard-check'
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <MobileStepper
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={onComplete}
      />
      
      {/* Custom content for each step */}
      <div className="mt-6">
        {children ? (
          children(currentStep)
        ) : (
          <div className="p-6 bg-muted/50 rounded-lg text-center">
            <i className={`${steps[currentStep - 1].icon} text-4xl text-primary mb-4 block`} />
            <p className="text-sm text-muted-foreground">
              Hier würde der Inhalt für Schritt {currentStep} angezeigt werden.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Swipeable Step Container (optional enhancement)
interface SwipeableStepContainerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function SwipeableStepContainer({ 
  children, 
  onSwipeLeft, 
  onSwipeRight 
}: SwipeableStepContainerProps) {
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="touch-pan-y"
    >
      {children}
    </div>
  );
}