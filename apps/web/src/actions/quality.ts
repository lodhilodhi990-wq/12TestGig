'use server';

import { adminDb } from '@/lib/firebase-admin';
import { TesterQualityScore } from '@12-test-gig/types';

const MINIMUM_SAMPLE_SIZE = 5;

export async function calculateTesterQualityScore(testerId: string) {
  // 1. Fetch completed test sessions for the tester
  const sessionsSnapshot = await adminDb.collection('test_sessions')
    .where('testerId', '==', testerId)
    .where('status', '==', 'verified')
    .get();

  // 2. Fetch bug reports from this tester
  const bugsSnapshot = await adminDb.collection('bugs')
    .where('testerId', '==', testerId)
    .get();

  // 3. Fetch customer reviews for this tester
  const reviewsSnapshot = await adminDb.collection('tester_reviews')
    .where('testerId', '==', testerId)
    .get();

  const totalSessions = sessionsSnapshot.size;
  const totalBugs = bugsSnapshot.size;
  const totalReviews = reviewsSnapshot.size;

  // Use the minimum sample rule
  const sampleSize = Math.min(totalSessions, totalReviews);
  const qualityStatus = sampleSize >= MINIMUM_SAMPLE_SIZE ? 'active' : 'insufficient_data';

  // In a real scenario, this aggregates bug states (confirmed vs rejected)
  // and averages the review scores.
  let ratingScore = 0;
  if (totalReviews > 0) {
    const sum = reviewsSnapshot.docs.reduce((acc, doc) => acc + doc.data().overallRating, 0);
    ratingScore = (sum / totalReviews) * 20; // Scale 1-5 to 0-100
  }

  // Calculate Bug Quality (Confirmed vs Total)
  let bugQualityScore = 100;
  if (totalBugs > 0) {
    const confirmed = bugsSnapshot.docs.filter(doc => ['confirmed', 'resolved', 'closed'].includes(doc.data().status)).length;
    bugQualityScore = (confirmed / totalBugs) * 100;
  }

  // Placeholder components
  const taskCompletionScore = 100;
  const onTimeScore = 100;
  const evidenceScore = 100;
  const reliabilityScore = 100;

  // Weighted sum (e.g., Rating 30%, Bug 20%, Task 20%, OnTime 15%, Evidence 10%, Reliability 5%)
  const overallScore = (
    (ratingScore * 0.30) +
    (bugQualityScore * 0.20) +
    (taskCompletionScore * 0.20) +
    (onTimeScore * 0.15) +
    (evidenceScore * 0.10) +
    (reliabilityScore * 0.05)
  );

  const scoreRef = adminDb.collection('tester_quality_scores').doc(testerId);
  
  const scoreData: TesterQualityScore = {
    testerId,
    overallScore,
    ratingScore,
    taskCompletionScore,
    bugQualityScore,
    onTimeScore,
    evidenceScore,
    reliabilityScore,
    calculationVersion: '1.0',
    sampleSize,
    qualityStatus,
    lastCalculatedAt: new Date().toISOString()
  };

  await scoreRef.set(scoreData);

  // Optional: Award badges if thresholds are met
  if (qualityStatus === 'active' && overallScore > 90) {
    await adminDb.collection('tester_badges').add({
      testerId,
      badgeId: 'top_quality',
      awardedAt: new Date().toISOString(),
      reason: 'Achieved > 90 overall quality score'
    });
  }

  return scoreData;
}
