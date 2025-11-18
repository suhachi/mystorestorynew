import React from 'react';
import { useAppBuilder } from '../system/data-context';
import { AppBuilderLayout } from '../layouts/app-builder-layout';
import { StepOneForm } from '../app-builder/step-one-form';
import { StepTwoPlanSelection } from '../app-builder/step-two-plan-selection';
import { StepThreeOrderPayment } from '../app-builder/step-three-order-payment';
import { StepFourCustomerMarketing } from '../app-builder/step-four-customer-marketing';
import { StepFiveBranding } from '../app-builder/step-five-branding';
import { StepSixFinalConfirmation } from '../app-builder/step-six-final-confirmation';

export function AppBuilderLegacyPage() {
  const { data } = useAppBuilder();
  const currentStep = data.step;

  // 단계별 컴포넌트 렌더링
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepOneForm />;
      case 2:
        return <StepTwoPlanSelection />;
      case 3:
        return <StepThreeOrderPayment />;
      case 4:
        return <StepFourCustomerMarketing />;
      case 5:
        return <StepFiveBranding />;
      case 6:
        return <StepSixFinalConfirmation />;
      default:
        return <StepOneForm />;
    }
  };

  return (
    <AppBuilderLayout mode="legacy">
      {renderStepContent()}
    </AppBuilderLayout>
  );
}