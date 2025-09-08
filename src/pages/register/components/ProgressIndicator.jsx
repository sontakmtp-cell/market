import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps?.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <React.Fragment key={step?.id}>
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-success border-success text-white'
                    : isCurrent
                    ? 'bg-primary border-primary text-white' :'bg-background border-border text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium ${
                    isCurrent ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {step?.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step?.description}
                  </p>
                </div>
              </div>
              {index < steps?.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  stepNumber < currentStep ? 'bg-success' : 'bg-border'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-border rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
      {/* Step Info */}
      <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
        <span>Bước {currentStep} / {totalSteps}</span>
        <span>{Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}% hoàn thành</span>
      </div>
    </div>
  );
};

export default ProgressIndicator;