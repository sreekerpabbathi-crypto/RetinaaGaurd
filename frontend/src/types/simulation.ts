export interface DistrictSimulationInput {
  annualTargetPopulation: number;
  workingDaysPerYear: number;
  screeningCentersCount: number;
  camerasPerCenter: number;
  aiProcessingTimeSeconds: number;
  ophthalmologistsCount: number;
  doctorReviewTimeMinutes: number;
  telemedicineBandwidthMbps: number;
  referralTriageRate: number;
}

export interface DistrictSimulationResult {
  dailyScreeningCapacity: number;
  annualScreeningCapacity: number;
  aiUtilizationPercent: number;
  ophthalmologistUtilizationPercent: number;
  averageReviewQueueSize: number;
  estimatedTurnaroundHours: number;
  screeningCoveragePercent: number;
  bottleneck: 'Ophthalmologist Review' | 'Field Cameras' | 'Bandwidth' | 'None';
  recommendations: string[];
}
