import { AnalyticsOverview, DistrictSimulationInput, DistrictSimulationResult } from '../types';
import { fetchJson } from './api';
import { MOCK_ANALYTICS, calculateDistrictSimulation } from './mockData';

export const analyticsService = {
  async getOverview(): Promise<AnalyticsOverview> {
    try {
      const data = await fetchJson<any>('/analytics/overview');
      if (data && data.summary) {
        return {
          summary: {
            totalScreenings: data.summary.totalScreenings ?? data.summary.total_screenings ?? 1420,
            referableCases: data.summary.referableCases ?? data.summary.referable_cases ?? 312,
            nonReferableCases: data.summary.nonReferableCases ?? data.summary.non_referable_cases ?? 1108,
            pendingReviews: data.summary.pendingReviews ?? data.summary.pending_reviews ?? 14,
            ungradableImages: data.summary.ungradableImages ?? data.summary.ungradable_images ?? 28,
            referralRatePercent: data.summary.referralRatePercent ?? data.summary.referral_rate_percent ?? 21.9,
            averageAiConfidencePercent: data.summary.averageAiConfidencePercent ?? data.summary.average_ai_confidence_percent ?? 93.4,
            meanTurnaroundTimeHours: data.summary.meanTurnaroundTimeHours ?? data.summary.mean_turnaround_time_hours ?? 3.2,
          },
          qualityDistribution: data.qualityDistribution ?? data.quality_distribution ?? MOCK_ANALYTICS.qualityDistribution,
          drSeverityDistribution: data.drSeverityDistribution ?? data.dr_severity_distribution ?? MOCK_ANALYTICS.drSeverityDistribution,
          activityTrends: data.activityTrends ?? data.activity_trends ?? MOCK_ANALYTICS.activityTrends,
        };
      }
      return MOCK_ANALYTICS;
    } catch {
      return MOCK_ANALYTICS;
    }
  },

  async simulateDistrictCapacity(params: DistrictSimulationInput): Promise<DistrictSimulationResult> {
    try {
      return await fetchJson<DistrictSimulationResult>('/analytics/simulate-capacity', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    } catch {
      return calculateDistrictSimulation(params);
    }
  },
};
