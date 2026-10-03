import React from 'react';
import { StepNavigation } from '../components/screening/StepNavigation';
import { PatientStep } from '../components/screening/PatientStep';
import { ImageUpload } from '../components/screening/ImageUpload';
import { QualityAssessment } from '../components/screening/QualityAssessment';
import { EnhancementView } from '../components/screening/EnhancementView';
import { DRClassification } from '../components/screening/DRClassification';
import { ClinicalReviewStep } from '../components/screening/ClinicalReviewStep';
import { ScreeningReportStep } from '../components/screening/ScreeningReportStep';
import { ScreeningContextPanel } from '../components/screening/ScreeningContextPanel';

import { useScreeningState } from '../services/useScreeningState';
import { MOCK_PATIENTS } from '../services/mockData';
import { ScreeningSession, ImageMetadata } from '../types';

interface ScreeningPageProps {
  onReturnToDashboard?: () => void;
}

export const ScreeningPage: React.FC<ScreeningPageProps> = ({ onReturnToDashboard }) => {
  const {
    screeningId,
    currentStep,
    maxCompletedStep,
    patientData,
    setPatientData,
    imageUrl,
    setImageUrl,
    imageFile,
    setImageFile,
    imageMetadata,
    setImageMetadata,
    quality,
    setQuality,
    enhancement,
    setEnhancement,
    structures,
    setStructures,
    lesions,
    setLesions,
    classification,
    setClassification,
    explainability,
    setExplainability,
    gradCam,
    review,
    setReview,
    getStepStatus,
    goToStep,
    resetScreening,
    isAnalyzing,
    analysisError,
    executeScreeningAnalysis,
  } = useScreeningState();

  const handleImageSelected = (url: string, metadata: ImageMetadata, file?: File | Blob) => {
    setImageUrl(url);
    setImageMetadata(metadata);
    if (file) {
      setImageFile(file);
    }
  };

  const currentSession: ScreeningSession = {
    id: screeningId,
    patientId: patientData.patientId,
    patientName: patientData.name,
    patientAge: Number(patientData.age) || 50,
    patientGender: patientData.sex,
    screeningLocation: patientData.screeningLocation,
    screeningDate: patientData.screeningDate,
    eye: patientData.eye,
    screeningCenter: patientData.screeningLocation,
    createdAt: new Date().toISOString(),
    currentStep,
    imageUrl,
    enhancedImageUrl: enhancement?.enhancedImageUrl,
    imageMetadata,
    enhancement,
    quality,
    retinalStructure: structures,
    lesions,
    classification,
    explainability,
    gradCam: gradCam || undefined,
    grad_cam: gradCam || undefined,
    review,
    isCompleted: currentStep === 7,
    modelVersion: 'RetinaGuard-Vision-v0.1-proto',
  };

  return (
    <div className="space-y-5 pb-12">
      {/* 7-Step Progress Stepper */}
      <StepNavigation
        currentStep={currentStep}
        onSelectStep={goToStep}
        getStepStatus={getStepStatus}
      />

      {/* Main Workspace Layout with Right-Side Context Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Step Content Area (9 cols on wide desktop, full width on Step 7 report) */}
        <div className={currentStep === 7 ? 'lg:col-span-12' : 'lg:col-span-9'}>
          {currentStep === 1 && (
            <PatientStep
              patientFormData={patientData}
              selectedEye={patientData.eye}
              imageUrl={imageUrl}
              imageMetadata={imageMetadata}
              onUpdatePatientForm={(data) => setPatientData((prev) => ({ ...prev, ...data }))}
              onSelectRegisteredPatient={(p) =>
                setPatientData((prev) => ({
                  ...prev,
                  patientId: p.id,
                  name: p.name,
                  age: p.age,
                  sex: p.gender as any,
                  phone: p.phone,
                  screeningLocation: p.district,
                  diabetesType: p.diabetesType,
                  diabetesDurationYears: p.diabetesDurationYears,
                }))
              }
              onImageSelected={handleImageSelected}
              onRemoveImage={() => {
                setImageUrl('');
                setImageMetadata(undefined);
              }}
              onNext={(hasImage) => {
                if (hasImage || imageUrl) {
                  executeScreeningAnalysis();
                } else {
                  goToStep(2); // Direct to Image Upload
                }
              }}
              onSavedPatientLater={() => {
                // Patient saved, can remain or continue
              }}
              isAnalyzing={isAnalyzing}
              analysisError={analysisError}
            />
          )}

          {currentStep === 2 && (
            <ImageUpload
              patientData={patientData}
              imageUrl={imageUrl}
              imageMetadata={imageMetadata}
              onUpdatePatientData={(data) => setPatientData((prev) => ({ ...prev, ...data }))}
              onImageSelected={handleImageSelected}
              onRemoveImage={() => {
                setImageUrl('');
                setImageMetadata(undefined);
              }}
              onNext={() => executeScreeningAnalysis()}
              onBack={() => goToStep(1)}
              isAnalyzing={isAnalyzing}
              analysisError={analysisError}
            />
          )}

          {currentStep === 3 && (
            <QualityAssessment
              imageUrl={imageUrl}
              quality={quality}
              onSetQuality={setQuality}
              onNext={() => goToStep(4)}
              onBack={() => goToStep(2)}
              onRecapture={() => goToStep(2)}
            />
          )}

          {currentStep === 4 && (
            <EnhancementView
              originalImageUrl={imageUrl}
              enhancement={enhancement}
              quality={quality}
              onNext={() => goToStep(5)}
              onBack={() => goToStep(3)}
            />
          )}

          {currentStep === 5 && (
            <DRClassification
              classification={classification}
              gradCam={gradCam || undefined}
              fundusImageUrl={enhancement?.enhancedImageUrl || imageUrl}
              onNext={() => goToStep(6)}
              onBack={() => goToStep(4)}
            />
          )}

          {currentStep === 6 && (
            <ClinicalReviewStep
              classification={classification}
              quality={quality}
              lesions={lesions}
              explainability={explainability}
              gradCam={gradCam || undefined}
              fundusImageUrl={enhancement?.enhancedImageUrl || imageUrl}
              review={review}
              onSubmitReview={setReview}
              onNext={() => goToStep(7)}
              onBack={() => goToStep(5)}
            />
          )}

          {currentStep === 7 && (
            <ScreeningReportStep
              session={currentSession}
              patientFormData={patientData}
              onReturnToDashboard={() => {
                if (onReturnToDashboard) onReturnToDashboard();
                else window.location.href = '#/dashboard';
              }}
              onNewScreening={resetScreening}
            />
          )}
        </div>

        {/* Right-Side Contextual Telemetry Panel (3 cols) */}
        {currentStep !== 7 && (
          <div className="lg:col-span-3 sticky top-6 space-y-4">
            <ScreeningContextPanel
              screeningId={screeningId}
              patientData={patientData}
              quality={quality}
              classification={classification}
              lesions={lesions}
              review={review}
              currentStep={currentStep}
              onReset={resetScreening}
            />
          </div>
        )}
      </div>
    </div>
  );
};
