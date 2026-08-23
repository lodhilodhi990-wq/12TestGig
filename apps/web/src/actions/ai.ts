'use server';

import { adminDb } from '@/lib/firebase-admin';
import { AIProvider, MockAIProvider } from '@/lib/ai/provider';
import { AIRequest, AIRequestType } from '@12-test-gig/types';

// Depending on environment, instantiate the correct provider
// E.g., if (process.env.AI_PROVIDER === 'openai') return new OpenAIProvider()
const aiProvider: AIProvider = new MockAIProvider();

/**
 * Validates usage limits to prevent abuse (Rate Limiting).
 */
async function checkUsageLimits(organizationId: string) {
  // Simplistic implementation for Phase 9:
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
  const usageRef = adminDb.collection('ai_usage').doc(`${organizationId}_${yearMonth}`);
  
  const doc = await usageRef.get();
  if (doc.exists) {
    const data = doc.data();
    if (data && data.totalRequests > 500) {
      throw new Error('Organization AI Request limit reached for this month.');
    }
  }
}

/**
 * Tracks AI usage after a successful call.
 */
async function trackUsage(organizationId: string, tokens: number) {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
  const usageRef = adminDb.collection('ai_usage').doc(`${organizationId}_${yearMonth}`);

  await adminDb.runTransaction(async (t) => {
    const doc = await t.get(usageRef);
    if (!doc.exists) {
      t.set(usageRef, {
        id: usageRef.id,
        organizationId,
        yearMonth,
        totalRequests: 1,
        totalTokens: tokens,
        updatedAt: new Date().toISOString()
      });
    } else {
      t.update(usageRef, {
        totalRequests: (doc.data()?.totalRequests || 0) + 1,
        totalTokens: (doc.data()?.totalTokens || 0) + tokens,
        updatedAt: new Date().toISOString()
      });
    }
  });
}

/**
 * Primary AI Generation Service
 */
export async function generateAIAssistance(userId: string, organizationId: string, type: AIRequestType, prompt: string) {
  await checkUsageLimits(organizationId);

  // 1. Log Request
  const requestRef = adminDb.collection('ai_requests').doc();
  const aiReq: AIRequest = {
    id: requestRef.id,
    userId,
    organizationId,
    type,
    provider: 'mock', // Should be dynamic based on env
    model: 'mock-model-v1',
    status: 'processing',
    createdAt: new Date().toISOString()
  };
  await requestRef.set(aiReq);

  try {
    // 2. Execute Provider (Server-Side only)
    // CRITICAL SECURITY: We never pass system architecture secrets into the prompt.
    const response = await aiProvider.generateText(prompt);

    // 3. Update Request Status & Usage
    await requestRef.update({
      status: 'completed',
      tokensUsed: response.tokensUsed,
      completedAt: new Date().toISOString()
    });

    await trackUsage(organizationId, response.tokensUsed.total);

    return response.content;

  } catch (error) {
    await requestRef.update({
      status: 'failed',
      completedAt: new Date().toISOString()
    });
    throw new Error('AI temporarily unavailable. Please try again later.');
  }
}
