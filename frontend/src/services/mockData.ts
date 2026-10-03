import { Patient, ScreeningSession, AnalyticsOverview, DistrictSimulationInput, DistrictSimulationResult } from '../types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "PT-2026-0891",
    name: "Rameshwar Prasad",
    age: 58,
    gender: "Male",
    phone: "+91 98451 22910",
    district: "Kurnool Rural Sub-District",
    diabetesType: "Type 2",
    diabetesDurationYears: 12,
    hba1c: 8.4,
    hasHypertension: true,
    lastScreeningDate: "2026-09-18",
    lastDrGrade: 2,
    isReferralActive: true,
    screeningsCount: 2,
    registeredAt: "2025-10-14"
  },
  {
    id: "PT-2026-0892",
    name: "Lakshmi Devi",
    age: 52,
    gender: "Female",
    phone: "+91 97312 88419",
    district: "Anantapur North PHC",
    diabetesType: "Type 2",
    diabetesDurationYears: 6,
    hba1c: 6.9,
    hasHypertension: false,
    lastScreeningDate: "2026-09-19",
    lastDrGrade: 0,
    isReferralActive: false,
    screeningsCount: 1,
    registeredAt: "2026-01-20"
  },
  {
    id: "PT-2026-0893",
    name: "Abdul Kareem",
    age: 64,
    gender: "Male",
    phone: "+91 94480 33182",
    district: "Kadapa South PHC",
    diabetesType: "Type 2",
    diabetesDurationYears: 18,
    hba1c: 9.8,
    hasHypertension: true,
    lastScreeningDate: "2026-09-19",
    lastDrGrade: 3,
    isReferralActive: true,
    screeningsCount: 4,
    registeredAt: "2024-06-11"
  },
  {
    id: "PT-2026-0894",
    name: "Sunita Bai",
    age: 46,
    gender: "Female",
    phone: "+91 91234 56789",
    district: "Chittoor West Outreach",
    diabetesType: "Type 1",
    diabetesDurationYears: 15,
    hba1c: 7.5,
    hasHypertension: false,
    lastScreeningDate: "2026-09-17",
    lastDrGrade: 1,
    isReferralActive: false,
    screeningsCount: 3,
    registeredAt: "2025-03-02"
  },
  {
    id: "PT-2026-0895",
    name: "Mohan Rao",
    age: 69,
    gender: "Male",
    phone: "+91 98860 11234",
    district: "Nellore Tribal Clinic",
    diabetesType: "Type 2",
    diabetesDurationYears: 22,
    hba1c: 10.2,
    hasHypertension: true,
    lastScreeningDate: "2026-09-19",
    lastDrGrade: 4,
    isReferralActive: true,
    screeningsCount: 5,
    registeredAt: "2023-11-19"
  }
];

export const MOCK_SCREENINGS: ScreeningSession[] = [
  {
    id: "SCR-2026-4401",
    patientId: "PT-2026-0891",
    patientName: "Rameshwar Prasad",
    patientAge: 58,
    patientGender: "Male",
    eye: "OD",
    screeningCenter: "Kurnool Rural Sub-District Health Center",
    createdAt: "2026-09-18T10:30:00",
    currentStep: 10,
    imageUrl: "/assets/samples/sample_dr2_fundus.svg",
    enhancedImageUrl: "/assets/samples/sample_enhanced.svg",
    quality: {
      state: "GOOD",
      overallScore: 0.92,
      focusScore: 0.94,
      illuminationScore: 0.89,
      contrastScore: 0.91,
      fieldOfViewScore: 0.95,
      artifactScore: 0.08,
      enhancementRecommended: false
    },
    retinalStructure: {
      opticDiscDetected: true,
      opticDiscCenter: [0.28, 0.48],
      opticDiscRadius: 0.08,
      foveaDetected: true,
      foveaCenter: [0.56, 0.51],
      foveaRadius: 0.04,
      vesselDensityIndex: 0.72,
      arteriovenousRatio: 0.65,
      macularEdemaRisk: "MODERATE"
    },
    lesions: [
      {
        id: "LS-01",
        lesionType: "microaneurysm",
        confidence: 0.91,
        boundingBox: [0.42, 0.38, 0.45, 0.41],
        locationQuadrant: "superior_temporal",
        clinicalSignificance: "Isolated capillary wall outpouching"
      },
      {
        id: "LS-02",
        lesionType: "hard_exudate",
        confidence: 0.88,
        boundingBox: [0.58, 0.46, 0.63, 0.52],
        locationQuadrant: "macular",
        clinicalSignificance: "Lipid precipitate within 1 disc diameter of fovea"
      },
      {
        id: "LS-03",
        lesionType: "hemorrhage",
        confidence: 0.85,
        boundingBox: [0.35, 0.60, 0.40, 0.65],
        locationQuadrant: "inferior_temporal",
        clinicalSignificance: "Intraretinal blot hemorrhage"
      }
    ],
    classification: {
      grade: 2,
      gradeName: "Moderate Non-Proliferative Diabetic Retinopathy (NPDR)",
      referable: true,
      confidence: 0.89,
      classProbabilities: {
        "Level 0 (No DR)": 0.02,
        "Level 1 (Mild NPDR)": 0.09,
        "Level 2 (Moderate NPDR)": 0.89,
        "Level 3 (Severe NPDR)": 0.05,
        "Level 4 (Proliferative DR)": 0.00
      },
      keyFindingsSummary: [
        "Multiple microaneurysms along superior & inferior temporal arcades",
        "Hard lipid exudates detected near macula border",
        "Moderate intraretinal dot hemorrhages"
      ]
    },
    explainability: {
      evidenceRationale: [
        "High gradient salience localized to lipid exudate deposits in superior macular area.",
        "Microaneurysm cluster detected along superior temporal vascular arcade.",
        "No definite neovascularization fronds detected at optic disc margin."
      ],
      attentionHotspots: [
        { x: 0.59, y: 0.49, weight: 0.92, label: "Hard Exudate Cluster" },
        { x: 0.43, y: 0.39, weight: 0.87, label: "Microvascular Aneurysm" }
      ],
      salientFeatures: [
        { name: "Macular Exudates", impact: "High positive contributor for Grade 2", importance: 0.42 },
        { name: "Temporal Arcade Microaneurysms", impact: "Moderate positive contributor", importance: 0.31 },
        { name: "Foveal Avascular Zone Integrity", impact: "Negative contributor for Grade 4", importance: 0.15 }
      ]
    },
    review: {
      status: "PENDING",
      reviewerName: "Dr. S. K. Venkat (Tele-Ophthalmology)",
      assignedGrade: 2,
      referralDecision: "TELE_OPHTHALMOLOGY",
      clinicalNotes: "Awaiting final tele-consult sign-off. Recommend optical coherence tomography (OCT) at district center."
    },
    isCompleted: true,
    modelVersion: "RetinaGuard-Vision-v0.1-proto"
  },
  {
    id: "SCR-2026-4402",
    patientId: "PT-2026-0892",
    patientName: "Lakshmi Devi",
    patientAge: 52,
    patientGender: "Female",
    eye: "OS",
    screeningCenter: "Anantapur North PHC",
    createdAt: "2026-09-19T09:15:00",
    currentStep: 10,
    imageUrl: "/assets/samples/sample_normal_fundus.svg",
    quality: {
      state: "GOOD",
      overallScore: 0.96,
      focusScore: 0.97,
      illuminationScore: 0.95,
      contrastScore: 0.96,
      fieldOfViewScore: 0.98,
      artifactScore: 0.03,
      enhancementRecommended: false
    },
    retinalStructure: {
      opticDiscDetected: true,
      opticDiscCenter: [0.72, 0.48],
      opticDiscRadius: 0.08,
      foveaDetected: true,
      foveaCenter: [0.44, 0.52],
      foveaRadius: 0.04,
      vesselDensityIndex: 0.81,
      arteriovenousRatio: 0.70,
      macularEdemaRisk: "LOW"
    },
    lesions: [],
    classification: {
      grade: 0,
      gradeName: "No Apparent Diabetic Retinopathy",
      referable: false,
      confidence: 0.97,
      classProbabilities: {
        "Level 0 (No DR)": 0.97,
        "Level 1 (Mild NPDR)": 0.02,
        "Level 2 (Moderate NPDR)": 0.01,
        "Level 3 (Severe NPDR)": 0.00,
        "Level 4 (Proliferative DR)": 0.00
      },
      keyFindingsSummary: [
        "Normal optic disc margins with healthy 0.3 cup-to-disc ratio.",
        "Smooth vascular arcades with no microvascular lesions or exudates."
      ]
    },
    explainability: {
      evidenceRationale: [
        "Diffuse low-intensity attention across normal background fundus.",
        "No focal hyper-salient lesion features detected."
      ],
      attentionHotspots: [],
      salientFeatures: [
        { name: "Uniform Retinal Background", impact: "Primary evidence for Grade 0", importance: 0.65 }
      ]
    },
    review: {
      status: "CONFIRMED",
      reviewerId: "DOC-81",
      reviewerName: "Dr. Anita Sharma",
      reviewedAt: "2026-09-19T10:00:00",
      assignedGrade: 0,
      referralDecision: "ROUTINE_MONITORING",
      clinicalNotes: "Clear fundus photograph. Repeat routine annual screening in 12 months."
    },
    isCompleted: true,
    modelVersion: "RetinaGuard-Vision-v0.1-proto"
  },
  {
    id: "SCR-2026-4403",
    patientId: "PT-2026-0893",
    patientName: "Abdul Kareem",
    patientAge: 64,
    patientGender: "Male",
    eye: "OD",
    screeningCenter: "Kadapa South PHC",
    createdAt: "2026-09-19T11:45:00",
    currentStep: 10,
    imageUrl: "/assets/samples/sample_dr3_fundus.svg",
    quality: {
      state: "GOOD",
      overallScore: 0.88,
      focusScore: 0.89,
      illuminationScore: 0.86,
      contrastScore: 0.88,
      fieldOfViewScore: 0.92,
      artifactScore: 0.10,
      enhancementRecommended: false
    },
    retinalStructure: {
      opticDiscDetected: true,
      opticDiscCenter: [0.28, 0.48],
      opticDiscRadius: 0.08,
      foveaDetected: true,
      foveaCenter: [0.56, 0.51],
      foveaRadius: 0.04,
      vesselDensityIndex: 0.69,
      arteriovenousRatio: 0.61,
      macularEdemaRisk: "HIGH"
    },
    lesions: [
      {
        id: "LS-04",
        lesionType: "hemorrhage",
        confidence: 0.94,
        boundingBox: [0.30, 0.32, 0.45, 0.48],
        locationQuadrant: "superior_nasal",
        clinicalSignificance: "Extensive blot hemorrhages in >2 quadrants"
      },
      {
        id: "LS-05",
        lesionType: "soft_exudate",
        confidence: 0.91,
        boundingBox: [0.52, 0.35, 0.60, 0.44],
        locationQuadrant: "superior_temporal",
        clinicalSignificance: "Cotton wool spot indicating nerve fiber layer ischemia"
      }
    ],
    classification: {
      grade: 3,
      gradeName: "Severe Non-Proliferative Diabetic Retinopathy (NPDR)",
      referable: true,
      confidence: 0.92,
      classProbabilities: {
        "Level 0 (No DR)": 0.00,
        "Level 1 (Mild NPDR)": 0.01,
        "Level 2 (Moderate NPDR)": 0.07,
        "Level 3 (Severe NPDR)": 0.92,
        "Level 4 (Proliferative DR)": 0.00
      },
      keyFindingsSummary: [
        "Extensive intraretinal hemorrhages meeting 4-2-1 criteria",
        "Multiple soft exudates (cotton wool spots)",
        "Venous beading identified"
      ]
    },
    explainability: {
      evidenceRationale: [
        "Strong model attention on large blot hemorrhages in nasal quadrant.",
        "Cotton wool spot micro-infarcts strongly weighted."
      ],
      attentionHotspots: [
        { x: 0.38, y: 0.40, weight: 0.95, label: "Blot Hemorrhage" },
        { x: 0.55, y: 0.39, weight: 0.90, label: "Cotton Wool Spot" }
      ],
      salientFeatures: [
        { name: "Multi-Quadrant Hemorrhages", impact: "Strongest driver of Grade 3", importance: 0.54 },
        { name: "Cotton Wool Spots", impact: "Indicator of retinal ischemia", importance: 0.28 }
      ]
    },
    review: {
      status: "PENDING",
      reviewerName: undefined,
      assignedGrade: 3,
      referralDecision: "URGENT_TERTIARY",
      clinicalNotes: "Urgent tertiary hospital ophthalmologist evaluation recommended within 2 weeks."
    },
    isCompleted: true,
    modelVersion: "RetinaGuard-Vision-v0.1-proto"
  }
];

export const getMockAnalyticsOverview = (): AnalyticsOverview => {
  const totalScreenings = MOCK_SCREENINGS.length;
  const referableCases = MOCK_SCREENINGS.filter(s => s.classification?.referable).length;
  const pendingReviews = MOCK_SCREENINGS.filter(s => s.review.status === 'PENDING').length;
  const goodQuality = MOCK_SCREENINGS.filter(s => s.quality?.state === 'GOOD').length;
  const borderlineQuality = MOCK_SCREENINGS.filter(s => s.quality?.state === 'BORDERLINE').length;
  const ungradableQuality = MOCK_SCREENINGS.filter(s => s.quality?.state === 'UNGRADABLE').length;

  return {
    summary: {
      totalScreenings,
      referableCases,
      nonReferableCases: totalScreenings - referableCases,
      pendingReviews,
      ungradableImages: ungradableQuality,
      referralRatePercent: totalScreenings > 0 ? Number(((referableCases / totalScreenings) * 100).toFixed(1)) : 0,
      averageAiConfidencePercent: totalScreenings > 0 ? 91.5 : 0,
      meanTurnaroundTimeHours: 1.5
    },
    qualityDistribution: [
      { name: "Good Quality", value: goodQuality, count: goodQuality, color: "#10B981" },
      { name: "Borderline (Enhanced)", value: borderlineQuality, count: borderlineQuality, color: "#F59E0B" },
      { name: "Ungradable (Recaptured)", value: ungradableQuality, count: ungradableQuality, color: "#EF4444" }
    ],
    drSeverityDistribution: [
      { grade: "Level 0 (No DR)", count: MOCK_SCREENINGS.filter(s => s.classification?.grade === 0).length, percentage: 33.3, referable: false, color: "#10B981" },
      { grade: "Level 1 (Mild NPDR)", count: MOCK_SCREENINGS.filter(s => s.classification?.grade === 1).length, percentage: 0, referable: false, color: "#F59E0B" },
      { grade: "Level 2 (Moderate NPDR)", count: MOCK_SCREENINGS.filter(s => s.classification?.grade === 2).length, percentage: 33.3, referable: true, color: "#F97316" },
      { grade: "Level 3 (Severe NPDR)", count: MOCK_SCREENINGS.filter(s => s.classification?.grade === 3).length, percentage: 33.3, referable: true, color: "#EF4444" },
      { grade: "Level 4 (Proliferative DR)", count: MOCK_SCREENINGS.filter(s => s.classification?.grade === 4).length, percentage: 0, referable: true, color: "#9333EA" }
    ],
    activityTrends: []
  };
};

export const MOCK_ANALYTICS: AnalyticsOverview = getMockAnalyticsOverview();

export function calculateDistrictSimulation(params: DistrictSimulationInput): DistrictSimulationResult {
  const shiftMinutes = 7.5 * 60.0;
  const minutesPerPatient = 12.0;
  const dailyCapacityPerCamera = Math.floor(shiftMinutes / minutesPerPatient); // ~37
  const totalCameras = params.screeningCentersCount * params.camerasPerCenter;
  const totalFieldDailyCapacity = totalCameras * dailyCapacityPerCamera;

  const dailyTargetNeed = params.annualTargetPopulation / params.workingDaysPerYear;
  const actualDailyScreened = Math.min(totalFieldDailyCapacity, Math.round(dailyTargetNeed * 1.15));
  const annualCapacity = actualDailyScreened * params.workingDaysPerYear;

  const aiSecondsNeeded = actualDailyScreened * params.aiProcessingTimeSeconds;
  const aiAvailableSeconds = 8 * 3600;
  const aiUtilization = Math.min(100.0, Number(((aiSecondsNeeded / aiAvailableSeconds) * 100).toFixed(1)));

  const casesToReviewPerDay = actualDailyScreened * params.referralTriageRate;
  const docReadingMinutesPerDay = 4.0 * 60.0 * params.ophthalmologistsCount;
  const reviewsPossiblePerDay = docReadingMinutesPerDay / Math.max(params.doctorReviewTimeMinutes, 0.5);

  const doctorUtilization = Number(((casesToReviewPerDay / Math.max(reviewsPossiblePerDay, 1)) * 100).toFixed(1));

  let bottleneck: 'Ophthalmologist Review' | 'Field Cameras' | 'Bandwidth' | 'None' = 'None';
  let avgQueue = Math.max(2, Math.round(casesToReviewPerDay * 0.15));
  let turnaroundHours = 2.5;

  if (casesToReviewPerDay > reviewsPossiblePerDay) {
    const excess = casesToReviewPerDay - reviewsPossiblePerDay;
    avgQueue = Math.round(excess * 5);
    turnaroundHours = Number((24.0 + (excess / reviewsPossiblePerDay) * 48.0).toFixed(1));
    bottleneck = 'Ophthalmologist Review';
  } else if (totalFieldDailyCapacity < dailyTargetNeed) {
    avgQueue = Math.round(casesToReviewPerDay * 0.4);
    turnaroundHours = 4.2;
    bottleneck = 'Field Cameras';
  } else if (params.telemedicineBandwidthMbps < 2.0) {
    avgQueue = Math.round(casesToReviewPerDay * 0.8);
    turnaroundHours = 12.0;
    bottleneck = 'Bandwidth';
  }

  const coverage = Math.min(100.0, Number(((annualCapacity / Math.max(params.annualTargetPopulation, 1)) * 100).toFixed(1)));

  const recs: string[] = [];
  if (doctorUtilization > 85.0) {
    recs.push(`Ophthalmologist reading capacity is at ${doctorUtilization}%. Consider adding tele-retina readers or tightening AI triage specificity.`);
  }
  if (coverage < 85.0) {
    recs.push(`District population coverage is ${coverage}%. Deploying mobile screening camps in remote primary centers will achieve >90% coverage.`);
  }
  if (params.telemedicineBandwidthMbps < 5.0) {
    recs.push('Bandwidth bottleneck detected. Enable offline store-and-forward edge sync on mobile field tablets.');
  }
  if (recs.length === 0) {
    recs.push('Operational throughput is balanced. The district telemedicine workflow meets annual diabetic screening targets.');
  }

  return {
    dailyScreeningCapacity: actualDailyScreened,
    annualScreeningCapacity: annualCapacity,
    aiUtilizationPercent: aiUtilization,
    ophthalmologistUtilizationPercent: doctorUtilization,
    averageReviewQueueSize: avgQueue,
    estimatedTurnaroundHours: turnaroundHours,
    screeningCoveragePercent: coverage,
    bottleneck,
    recommendations: recs
  };
}
