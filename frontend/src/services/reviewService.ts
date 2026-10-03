import { ScreeningSession, ClinicalReview } from '../types';
import { fetchJson } from './api';
import { MOCK_SCREENINGS } from './mockData';

export const reviewService = {
  async getReviewQueue(statusFilter: string = 'ALL'): Promise<ScreeningSession[]> {
    try {
      const q = statusFilter !== 'ALL' ? `?status_filter=${statusFilter}` : '';
      return await fetchJson<ScreeningSession[]>(`/reviews/queue${q}`);
    } catch {
      if (statusFilter === 'ALL') {
        return [...MOCK_SCREENINGS].sort((a, b) => (a.review.status === 'PENDING' ? -1 : 1));
      }
      return MOCK_SCREENINGS.filter(s => s.review.status === statusFilter);
    }
  },

  async adjudicateReview(screeningId: string, review: ClinicalReview): Promise<ScreeningSession> {
    try {
      return await fetchJson<ScreeningSession>(`/reviews/${screeningId}/adjudicate`, {
        method: 'POST',
        body: JSON.stringify(review),
      });
    } catch {
      const item = MOCK_SCREENINGS.find(s => s.id === screeningId);
      if (item) {
        item.review = review;
        item.isCompleted = true;
      }
      return item!;
    }
  },
};
