export type Role = 'super_admin' | 'admin' | 'support' | 'customer' | 'tester' | 'earner';
export type UserStatus = 'active' | 'pending' | 'suspended' | 'blocked';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type Platform = 'Android' | 'iOS' | 'Both';
export type CampaignStatus = 'draft' | 'pending_review' | 'approved' | 'recruiting' | 'testing' | 'paused' | 'completed' | 'rejected' | 'archived';
export type CampaignDifficulty = 'easy' | 'medium' | 'hard';
export type OrganizationRole = 'customer_owner' | 'customer_manager' | 'customer_viewer';

export interface User {
  id: string;
  fullName: string;
  email: string;
  photoURL?: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string; 
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  ownerId: string;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  userId: string;
  organizationId: string;
  role: OrganizationRole;
  status: 'pending' | 'active';
  invitedAt: string;
  joinedAt?: string;
}

export interface Customer {
  id: string;
  userId: string;
  organizationId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  website?: string;
  logo?: string;
  verificationStatus: VerificationStatus;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Tester {
  id: string;
  userId: string;
  displayName: string;
  photoURL?: string;
  country: string;
  experienceYears: number;
  skills: string[];
  devices: string[];
  androidVersions: string[];
  languages: string[];
  availability: string;
  rating: number; 
  completedTests: number; 
  bugsFound: number; 
  successRate: number; 
  testerLevel: string; 
  createdAt: string;
  updatedAt: string;
}

export interface Earner {
  id: string;
  userId: string;
  displayName: string;
  photoURL?: string;
  country: string;
  skills: string[];
  devices: string[];
  androidVersions: string[];
  experienceYears: number;
  rating: number; 
  completedGigs: number; 
  successRate: number; 
  level: string; 
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  status: 'active' | 'archived';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface App {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  packageName?: string;
  platform: Platform;
  version: string;
  description?: string;
  category?: string;
  iconUrl?: string;
  privacyPolicyUrl?: string;
  supportEmail?: string;
  status: 'Draft' | 'Active' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  organizationId: string;
  projectId: string;
  appId: string;
  name: string;
  description: string;
  objective: string;
  platform: Platform;
  durationValue: number;
  durationUnit: 'days';
  startDate: string;
  endDate: string;
  requiredTesters: number;
  rewardPerTester: number;
  totalBudget: number;
  difficulty: CampaignDifficulty;
  testerRequirements: {
    experienceLevel: string;
    devices: string[];
    androidVersions: string[];
    languages: string[];
    country?: string;
  };
  instructions: string;
  status: CampaignStatus;
  rejectionReason?: string;
  changeRequest?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  pausedBy?: string;
  pauseReason?: string;
  pausedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  organizationId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  organizationId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface CampaignDay {
  id: string;
  campaignId: string;
  organizationId: string;
  dayNumber: number;
  title: string;
  description?: string;
  scheduledDate?: string;
  status: 'locked' | 'upcoming' | 'active' | 'completed' | 'skipped';
  createdAt: string;
  updatedAt: string;
}

export interface CampaignTask {
  id: string;
  campaignId: string;
  campaignDayId: string;
  organizationId: string;
  title: string;
  description: string;
  instructions: string;
  taskType: string;
  priority: 'low' | 'medium' | 'high';
  required: boolean;
  expectedResult: string;
  evidenceRequired: boolean;
  order: number;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface TesterApplication {
  id: string;
  campaignId: string;
  organizationId: string;
  testerId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn' | 'waitlisted';
  applicationMessage?: string;
  eligibilitySnapshot: Record<string, any>;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewReason?: string;
}

export interface TesterAssignment {
  id: string;
  campaignId: string;
  campaignDayId?: string;
  organizationId: string;
  testerId: string;
  userId: string;
  applicationId: string;
  status: 'assigned' | 'active' | 'paused' | 'completed' | 'removed';
  assignedAt: string;
  startedAt?: string;
  completedAt?: string;
  removedAt?: string;
  removalReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestSession {
  id: string;
  campaignId: string;
  campaignDayId: string;
  assignmentId: string;
  testerId: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
  status: 'started' | 'submitted' | 'verified' | 'rejected' | 'cancelled';
  tasksCompleted: number;
  feedbackSubmitted: boolean;
  bugsReported: number;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  userId: string;
  testerId: string;
  manufacturer: string;
  model: string;
  androidVersion: string;
  deviceName: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BugStatus = 'draft' | 'submitted' | 'triaged' | 'confirmed' | 'in_progress' | 'resolved' | 'reopened' | 'duplicate' | 'rejected' | 'closed';
export type BugSeverity = 'blocker' | 'critical' | 'major' | 'minor' | 'trivial';
export type BugPriority = 'urgent' | 'high' | 'medium' | 'low';
export type ModerationStatus = 'normal' | 'flagged' | 'hidden' | 'under_review';

export interface Bug {
  id: string;
  organizationId: string;
  campaignId: string;
  projectId: string;
  appId: string;
  assignmentId: string;
  testerId: string;
  userId: string;
  testSessionId?: string;
  campaignDayId?: string;
  taskId?: string;
  title: string;
  description: string;
  stepsToReproduce: string;
  expectedResult: string;
  actualResult: string;
  severity: BugSeverity;
  priority: BugPriority;
  status: BugStatus;
  environment?: string;
  deviceId?: string;
  androidVersion?: string;
  appVersion?: string;
  duplicateOf?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface BugComment {
  id: string;
  bugId: string;
  organizationId: string;
  authorId: string;
  authorRole: string;
  message: string;
  moderationStatus: ModerationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BugHistory {
  id: string;
  bugId: string;
  actorId: string;
  actorRole: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  organizationId: string;
  campaignId: string;
  projectId: string;
  appId: string;
  testerId: string;
  assignmentId: string;
  testSessionId?: string;
  campaignDayId?: string;
  rating: number;
  usabilityRating?: number;
  performanceRating?: number;
  stabilityRating?: number;
  recommendation: boolean;
  comments?: string;
  issuesFound?: string;
  isAnonymous?: boolean;
  moderationStatus: ModerationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TesterReview {
  id: string;
  organizationId: string;
  campaignId: string;
  testerId: string;
  assignmentId: string;
  reviewerId: string;
  overallRating: number;
  communicationRating: number;
  qualityRating: number;
  reliabilityRating: number;
  instructionFollowingRating: number;
  comment?: string;
  status: string;
  moderationStatus: ModerationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerReview {
  id: string;
  organizationId: string;
  campaignId: string;
  testerId: string;
  assignmentId: string;
  overallRating: number;
  communicationRating: number;
  instructionsRating: number;
  organizationRating: number;
  comment?: string;
  moderationStatus: ModerationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TesterQualityScore {
  testerId: string;
  overallScore: number;
  ratingScore: number;
  taskCompletionScore: number;
  bugQualityScore: number;
  onTimeScore: number;
  evidenceScore: number;
  reliabilityScore: number;
  calculationVersion: string;
  sampleSize: number;
  qualityStatus: 'insufficient_data' | 'active';
  lastCalculatedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  criteria: string;
}

export interface TesterBadge {
  id: string;
  testerId: string;
  badgeId: string;
  awardedAt: string;
  reason?: string;
}

export type RewardType = 'campaign_completion' | 'daily_completion' | 'task_completion' | 'bug_reward' | 'quality_bonus' | 'on_time_bonus' | 'manual_adjustment' | 'referral_bonus';
export type RewardStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'paid';
export type WithdrawalStatus = 'requested' | 'under_review' | 'approved' | 'processing' | 'completed' | 'rejected' | 'cancelled' | 'failed';
export type WalletStatus = 'active' | 'locked' | 'suspended';

export interface Wallet {
  id: string;
  userId: string;
  testerId: string;
  currency: string;
  availableBalanceMinor: number;
  pendingBalanceMinor: number;
  lifetimeEarnedMinor: number;
  lifetimeWithdrawnMinor: number;
  status: WalletStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WalletLedgerEntry {
  id: string;
  userId: string;
  testerId: string;
  type: string;
  referenceType: string;
  referenceId: string;
  direction: 'credit' | 'debit';
  amountMinor: number;
  currency: string;
  balanceBeforeMinor: number;
  balanceAfterMinor: number;
  description: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  organizationId: string;
  campaignId: string;
  projectId: string;
  appId: string;
  testerId: string;
  assignmentId: string;
  campaignDayId?: string;
  taskId?: string;
  bugId?: string;
  type: RewardType;
  amountMinor: number;
  currency: string;
  status: RewardStatus;
  description?: string;
  metadata?: Record<string, any>;
  rewardConfigVersion?: number;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  testerId: string;
  amountMinor: number;
  feeMinor?: number;
  netAmountMinor?: number;
  currency: string;
  status: WithdrawalStatus;
  kycStatus?: string;
  riskStatus?: string;
  provider?: string;
  providerPayoutId?: string;
  providerReference?: string;
  idempotencyKey?: string;
  paymentMethodId?: string;
  requestedAt: string;
  approvedAt?: string;
  processingAt?: string;
  completedAt?: string;
  failedAt?: string;
  cancelledAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  failureReason?: string;
  rejectionReason?: string;
}

export type PaymentMethodStatus = 'pending_verification' | 'active' | 'disabled' | 'failed';
export type PaymentMethodType = 'bank_account' | 'paypal' | 'provider_wallet' | 'other_provider_method';

export interface PaymentMethod {
  id: string;
  userId: string;
  testerId: string;
  type: PaymentMethodType;
  provider: string;
  label: string;
  status: PaymentMethodStatus;
  country: string;
  currency: string;
  providerCustomerId?: string;
  providerAccountId?: string;
  maskedDetails: string;
  createdAt: string;
  updatedAt: string;
}

export type KycStatus = 'not_started' | 'pending' | 'verified' | 'rejected' | 'expired' | 'requires_action';

export interface IdentityVerification {
  id: string;
  userId: string;
  testerId: string;
  status: KycStatus;
  provider: string;
  country: string;
  verificationReference?: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface PaymentWebhookEvent {
  id: string;
  provider: string;
  eventId: string;
  eventType: string;
  signatureVerified: boolean;
  processed: boolean;
  processedAt?: string;
  createdAt: string;
}

export interface PayoutReconciliation {
  id: string;
  withdrawalId: string;
  status: 'matched' | 'internal_only' | 'provider_only' | 'amount_mismatch' | 'status_mismatch' | 'under_review';
  createdAt: string;
}

export type RestrictionType = 'testing_disabled' | 'withdrawal_disabled' | 'campaign_join_disabled' | 'messaging_disabled' | 'submission_disabled';

export interface UserRestriction {
  id: string;
  userId: string;
  type: RestrictionType;
  status: 'active' | 'expired' | 'removed';
  reason: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  updatedAt: string;
}

export type DisputeType = 'campaign' | 'tester' | 'customer' | 'task' | 'bug' | 'feedback' | 'reward' | 'withdrawal' | 'payment' | 'testing_result';
export type DisputeStatus = 'open' | 'under_review' | 'waiting_for_information' | 'resolved' | 'rejected' | 'closed';
export type DisputePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Dispute {
  id: string;
  openedBy: string;
  userId?: string;
  organizationId?: string;
  type: DisputeType;
  referenceType: string;
  referenceId: string;
  status: DisputeStatus;
  priority: DisputePriority;
  subject: string;
  description: string;
  assignedTo?: string;
  resolution?: string;
  resolutionReason?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';

export interface RiskEvent {
  id: string;
  userId: string;
  organizationId?: string;
  type: string;
  severity: RiskSeverity;
  referenceType?: string;
  referenceId?: string;
  description: string;
  status: RiskStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AdminNote {
  id: string;
  adminId: string;
  targetType: string;
  targetId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  organizationId?: string;
  subject: string;
  description: string;
  category: 'account' | 'testing' | 'campaign' | 'reward' | 'wallet' | 'withdrawal' | 'payment' | 'bug' | 'other';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_for_user' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ApplicationError {
  id: string;
  severity: 'warning' | 'error' | 'critical';
  module: string;
  message: string;
  referenceId?: string;
  createdAt: string;
}

export interface ReportJob {
  id: string;
  userId: string;
  organizationId?: string;
  type: 'users' | 'testers' | 'campaigns' | 'apps' | 'testing' | 'bugs' | 'feedback' | 'rewards' | 'withdrawals' | 'disputes';
  filters?: Record<string, any>;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'expired';
  fileReference?: string;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
}

export type AIRequestType = 'test_plan' | 'test_case' | 'bug_assistant' | 'feedback_assistant' | 'campaign_assistant' | 'play_store_assistant' | 'testing_summary';
export type AIRequestStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface AIRequest {
  id: string;
  userId: string;
  organizationId?: string;
  type: AIRequestType;
  provider: 'mock' | 'openai' | 'gemini';
  model: string;
  status: AIRequestStatus;
  tokensUsed?: {
    input: number;
    output: number;
    total: number;
  };
  createdAt: string;
  completedAt?: string;
}

export interface AIUsage {
  id: string;
  organizationId: string;
  yearMonth: string; // e.g., '2023-11'
  totalRequests: number;
  totalTokens: number;
  updatedAt: string;
}

export type ChecklistStatus = 'not_started' | 'in_progress' | 'completed' | 'not_applicable' | 'needs_review';

export interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  required: boolean;
  status: ChecklistStatus;
  evidence?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface PlayStoreChecklist {
  id: string; // usually same as appId
  appId: string;
  organizationId: string;
  items: ChecklistItem[];
  readinessPercentage: number;
  updatedAt: string;
}

export type ReleaseStatus = 'draft' | 'ready_for_review' | 'rejected' | 'approved' | 'published';

export interface ReleaseChecklist {
  id: string;
  appId: string;
  organizationId: string;
  versionCode: number;
  versionName: string;
  status: ReleaseStatus;
  artifactReference?: string; // e.g. path to AAB in storage, NO SECRETS
  checklist: {
    buildReady: boolean;
    signingConfigured: boolean;
    privacyPolicyAvailable: boolean;
    dataSafetyReviewed: boolean;
    storeListingReady: boolean;
    testingComplete: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export type IncidentSeverity = 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';
export type IncidentStatus = 'open' | 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'closed';

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedService: 'application' | 'database' | 'authentication' | 'storage' | 'payments' | 'webhooks' | 'notifications' | 'ai' | 'background_jobs';
  startedAt: string;
  detectedAt: string;
  resolvedAt?: string;
  createdBy: string;
  assignedTo?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentEvent {
  id: string;
  incidentId: string;
  actorId: string;
  type: 'created' | 'assigned' | 'status_changed' | 'note_added' | 'mitigation' | 'resolved' | 'closed';
  message: string;
  createdAt: string;
}

export interface FeatureFlag {
  id: string; // The key e.g., 'maintenance_mode'
  key: string;
  enabled: boolean;
  environment: 'development' | 'staging' | 'production';
  description: string;
  updatedBy: string;
  updatedAt: string;
}

export type ReleaseDeploymentStatus = 'planned' | 'testing' | 'ready' | 'deployed' | 'rolled_back';

export interface Release {
  id: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  releaseDate: string;
  status: ReleaseDeploymentStatus;
  commitReference?: string;
  notes: string;
  createdAt: string;
  deployedBy?: string;
}

export interface RewardConfig {
  rewardPerTester: number;
  dailyReward?: number;
  taskReward?: number;
  bugReward?: number;
  qualityBonus?: number;
  onTimeBonus?: number;
  totalBudgetMinor: number;
  reservedBudgetMinor: number;
  earnedBudgetMinor: number;
  pendingBudgetMinor: number;
  remainingBudgetMinor: number;
}

export interface RewardConfigVersion {
  id: string;
  campaignId: string;
  version: number;
  config: RewardConfig;
  createdAt: string;
  createdBy: string;
}
