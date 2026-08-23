import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['customer', 'tester', 'earner'], {
    required_error: 'Please select a role',
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().optional(),
});

export const appSchema = z.object({
  name: z.string().min(1, 'App name is required'),
  platform: z.enum(['Android', 'iOS', 'Both']),
  version: z.string().min(1, 'Version is required'),
  packageName: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  privacyPolicyUrl: z.string().url().optional().or(z.literal('')),
  supportEmail: z.string().email().optional().or(z.literal('')),
}).refine((data) => {
  if ((data.platform === 'Android' || data.platform === 'Both') && !data.packageName) {
    return false;
  }
  return true;
}, {
  message: "Package name is required for Android apps",
  path: ["packageName"]
});

export const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().optional(),
  objective: z.string().optional(),
  appId: z.string().min(1, 'App selection is required'),
  durationValue: z.number().min(1),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  requiredTesters: z.number().min(1, 'At least 1 tester is required'),
  rewardPerTester: z.number().min(0, 'Reward cannot be negative'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  instructions: z.string().min(1, 'Instructions are required'),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date cannot be before start date",
  path: ["endDate"]
});

export const memberInvitationSchema = z.object({
  email: z.string().email('Invalid email'),
  role: z.enum(['customer_owner', 'customer_manager', 'customer_viewer'])
});

export const campaignTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().min(1, 'Description is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  taskType: z.string().min(1, 'Task type is required'),
  priority: z.enum(['low', 'medium', 'high']),
  required: z.boolean(),
  expectedResult: z.string().min(1, 'Expected result is required'),
  evidenceRequired: z.boolean(),
  order: z.number().int().min(0)
});

export const testerApplicationSchema = z.object({
  applicationMessage: z.string().optional(),
  eligibilitySnapshot: z.record(z.any()).optional()
});

export const testerDeviceSchema = z.object({
  manufacturer: z.string().min(1, 'Manufacturer required'),
  model: z.string().min(1, 'Model required'),
  androidVersion: z.string().min(1, 'Android version required'),
  deviceName: z.string().min(1, 'Device name required'),
  isPrimary: z.boolean()
});

export const bugSchema = z.object({
  title: z.string().min(1, 'Title required').max(100),
  description: z.string().min(1, 'Description required'),
  stepsToReproduce: z.string().min(1, 'Steps to reproduce required'),
  expectedResult: z.string().min(1, 'Expected result required'),
  actualResult: z.string().min(1, 'Actual result required'),
  severity: z.enum(['blocker', 'critical', 'major', 'minor', 'trivial']),
  priority: z.enum(['urgent', 'high', 'medium', 'low']),
  environment: z.string().optional(),
});

export const bugCommentSchema = z.object({
  message: z.string().min(1, 'Comment cannot be empty').max(1000)
});

export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  usabilityRating: z.number().min(1).max(5).optional(),
  performanceRating: z.number().min(1).max(5).optional(),
  stabilityRating: z.number().min(1).max(5).optional(),
  recommendation: z.boolean(),
  comments: z.string().optional(),
  issuesFound: z.string().optional(),
  isAnonymous: z.boolean().optional()
});

export const testerReviewSchema = z.object({
  overallRating: z.number().min(1).max(5),
  communicationRating: z.number().min(1).max(5),
  qualityRating: z.number().min(1).max(5),
  reliabilityRating: z.number().min(1).max(5),
  instructionFollowingRating: z.number().min(1).max(5),
  comment: z.string().optional()
});

export const customerReviewSchema = z.object({
  overallRating: z.number().min(1).max(5),
  communicationRating: z.number().min(1).max(5),
  instructionsRating: z.number().min(1).max(5),
  organizationRating: z.number().min(1).max(5),
  comment: z.string().optional()
});

export const rewardConfigSchema = z.object({
  rewardPerTester: z.number().int().min(0, 'Must be positive integer (minor units)'),
  dailyReward: z.number().int().min(0).optional(),
  taskReward: z.number().int().min(0).optional(),
  bugReward: z.number().int().min(0).optional(),
  qualityBonus: z.number().int().min(0).optional(),
  onTimeBonus: z.number().int().min(0).optional(),
  totalBudgetMinor: z.number().int().min(0),
});

export const manualAdjustmentSchema = z.object({
  testerId: z.string().min(1, 'Tester ID required'),
  direction: z.enum(['credit', 'debit']),
  amountMinor: z.number().int().min(1, 'Must be > 0'),
  currency: z.string().length(3),
  reason: z.string().min(5, 'Detailed reason required')
});

export const withdrawalRequestSchema = z.object({
  amountMinor: z.number().int().min(1000, 'Minimum withdrawal is $10.00'), // e.g. 1000 minor units
  currency: z.string().length(3),
  paymentMethodId: z.string().min(1, 'Payment method required'),
});

export const paymentMethodSchema = z.object({
  type: z.enum(['bank_account', 'paypal', 'provider_wallet', 'other_provider_method']),
  provider: z.string().min(1, 'Provider is required'),
  country: z.string().length(2, 'Country must be a 2-letter ISO code'),
  currency: z.string().length(3, 'Currency must be a 3-letter ISO code'),
});

export const kycSchema = z.object({
  provider: z.string().min(1, 'Provider is required'),
  country: z.string().length(2, 'Country must be a 2-letter ISO code'),
});

export const providerConfigSchema = z.object({
  provider: z.string().min(1),
  environment: z.enum(['sandbox', 'production']),
  enabled: z.boolean(),
  supportedCurrencies: z.array(z.string().length(3)),
  supportedCountries: z.array(z.string().length(2)),
});
