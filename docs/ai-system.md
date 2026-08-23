# AI System Architecture

## Provider Abstraction
The AI system is built with a Provider abstraction (`AIProvider` interface) to prevent vendor lock-in. Currently, it uses a `MockAIProvider` for development testing.
By reading environment variables, this can be swapped instantly to an `OpenAIProvider` or `GeminiProvider`.

## Security Boundaries
1. **Server-Side Only**: The Next.js frontend NEVER talks to the AI provider directly. All requests go through `generateAIAssistance()` Server Actions.
2. **Advisory Only**: AI suggestions do NOT carry execution privileges. The AI cannot mutate ledgers, ban users, or award rewards.
3. **Data Access Isolation**: The `AIService` checks the caller's organization ID / user ID and limits context exactly as if it were a normal database read.

## Usage & Rate Limiting
To prevent abuse, each organization is tracked via the `ai_usage` collection. If an organization exceeds its token or request limit for the month, `checkUsageLimits()` will throw an error and degrade gracefully.
