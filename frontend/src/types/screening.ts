export type QualityState = 'GOOD' | 'BORDERLINE' | 'UNGRADABLE';
export type EyeSide = 'OD' | 'OS' | 'NOT_SPECIFIED';
export type DRGrade = 0 | 1 | 2 | 3 | 4;
export type ReviewStatus = 'PENDING' | 'CONFIRMED' | 'MODIFIED' | 'REACQUISITION_REQUESTED';
export type ReferralDecision = 'NO_REFERRAL' | 'ROUTINE_MONITORING' | 'TELE_OPHTHALMOLOGY' | 'URGENT_TERTIARY';

export type StepState = 'completed' | 'current' | 'upcoming' | 'blocked';

export interface ImageMetadata {
  fileName: string;
  fileSizeFormatted: string;
  sizeBytes: number;
  dimensions: string; // e.g. "2048 x 1536 px"
  fileFormat: string; // "JPG", "PNG", "JPEG"
  uploadedAt: string;
}

export interface QualityMetrics {
  state: QualityState;
  passed?: boolean;
  overallScore: number; // 0-100 scale (or 0-1)
  focusScore: number;
  illuminationScore: number;
  contrastScore: number;
  fieldOfViewScore: number;
  artifactScore: number;
  enhancementRecommended: boolean;
  issues?: string[];
  feedbackText?: string;
  recaptureGuidance?: string[];
}

export type StructureDetectionStatus = 'Pending' | 'Detected' | 'Available' | 'Unavailable';

export interface RetinalStructure {
  opticDiscStatus?: StructureDetectionStatus;
  opticDiscDetected: boolean;
  opticDiscCenter: [number, number]; // [x, y] normalized 0-1
  opticDiscRadius: number;
  foveaStatus?: StructureDetectionStatus;
  foveaDetected: boolean;
  foveaCenter: [number, number];
  foveaRadius: number;
  vesselNetworkStatus?: StructureDetectionStatus;
  vesselDensityIndex: number;
  arteriovenousRatio: number;
  macularEdemaRisk: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface EnhancementResult {
  originalImageUrl: string;
  enhancedImageUrl: string;
  processingTimeMs: number;
  methodsApplied: string[];
  status: 'Complete' | 'Pending' | 'Bypassed';
  isPlaceholder?: boolean;
}

export type LesionType = 'microaneurysm' | 'hard_exudate' | 'soft_exudate' | 'hemorrhage' | 'neovascularization';

export interface LesionFinding {
  id: string;
  lesionType: LesionType;
  confidence: number;
  boundingBox: [number, number, number, number]; // [xMin, yMin, xMax, yMax] normalized 0-1
  locationQuadrant: 'superior_nasal' | 'superior_temporal' | 'inferior_nasal' | 'inferior_temporal' | 'macular';
  approximateLocation?: string;
  clinicalSignificance: string;
}

export interface DRPrediction {
  grade: DRGrade;
  gradeName: string;
  predictedClass?: number;
  drLabel?: string;
  referable: boolean;
  referralMessage?: string;
  confidence: number;
  classProbabilities: {
    'Level 0 (No DR)': number;
    'Level 1 (Mild NPDR)': number;
    'Level 2 (Moderate NPDR)': number;
    'Level 3 (Severe NPDR)': number;
    'Level 4 (Proliferative DR)': number;
  };
  keyFindingsSummary: string[];
  isDemoOutput?: boolean;
  gradCam?: GradCamResult;
  grad_cam?: GradCamResult;
}

export interface GradCamResult {
  available: boolean;
  image?: string;
  targetClass?: number;
  target_class?: number;
  targetLabel?: string;
  target_label?: string;
  description?: string;
}

export interface AttentionHotspot {
  x: number;
  y: number;
  weight: number;
  label: string;
}

export interface ExplainabilityResult {
  gradcamHeatmapUrl?: string;
  attentionHotspots: AttentionHotspot[];
  evidenceRationale: string[];
  salientFeatures: Array<{ name: string; impact: string; importance: number }>;
  modelAttentionDisclaimer?: string;
}

export interface ClinicalReview {
  status: ReviewStatus;
  reviewerId?: string;
  reviewerName?: string;
  reviewedAt?: string;
  assignedGrade?: DRGrade;
  referralDecision?: ReferralDecision;
  clinicalNotes?: string;
  reacquisitionReason?: string;
  agreementStatus?: 'AGREED' | 'MODIFIED' | 'REACQUISITION_REQUESTED';
}

export interface ScreeningSession {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  screeningLocation?: string;
  screeningDate?: string;
  eye: EyeSide;
  screeningCenter: string;
  createdAt: string;
  currentStep: number;
  imageUrl?: string;
  enhancedImageUrl?: string;
  enhanced_image_url?: string;
  imageMetadata?: ImageMetadata;
  enhancement?: EnhancementResult;
  quality?: QualityMetrics;
  retinalStructure?: RetinalStructure;
  lesions: LesionFinding[];
  classification?: DRPrediction;
  explainability?: ExplainabilityResult;
  gradCam?: GradCamResult;
  grad_cam?: GradCamResult;
  review: ClinicalReview;
  isCompleted: boolean;
  modelVersion: string;
  referable?: boolean;
  referralMessage?: string;
  referral_message?: string;
}
