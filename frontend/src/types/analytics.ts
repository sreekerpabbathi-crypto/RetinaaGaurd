export interface ScreeningAnalyticsSummary {
  totalScreenings: number;
  referableCases: number;
  nonReferableCases: number;
  pendingReviews: number;
  ungradableImages: number;
  referralRatePercent: number;
  averageAiConfidencePercent: number;
  meanTurnaroundTimeHours: number;
}

export interface QualityDistributionItem {
  name: string;
  value: number;
  count: number;
  color: string;
}

export interface DRSeverityDistributionItem {
  grade: string;
  count: number;
  percentage: number;
  referable: boolean;
  color: string;
}

export interface ActivityTrendItem {
  date: string;
  screenings: number;
  referrals: number;
  reviewsCompleted: number;
}

export interface AnalyticsOverview {
  summary: ScreeningAnalyticsSummary;
  qualityDistribution: QualityDistributionItem[];
  drSeverityDistribution: DRSeverityDistributionItem[];
  activityTrends: ActivityTrendItem[];
}
