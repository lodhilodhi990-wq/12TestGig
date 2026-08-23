# 12 Test Gig

A comprehensive tester-to-tester and app testing/reward platform.

## Features
- **12-Day Testing Engine**: Automated, verifiable Android app testing campaigns matching Google Play's 20-tester requirements.
- **Tester Rewards System**: Secure digital wallet and ledger for testers to earn and withdraw funds.
- **Robust Admin & Analytics**: Comprehensive dashboards for operational health, financial audits, risk management, and Play Store readiness validation.
- **AI Assistant**: Automated, non-destructive app store feedback parsing and compliance checks.

## Architecture & Tech Stack
- **Frontend/Monorepo**: Next.js (App Router), React, Tailwind CSS, TypeScript (via Turborepo).
- **Backend/Database**: Firebase Authentication, Cloud Firestore, Firebase Storage.
- **Payments**: Stripe (abstracted via generic Provider interface).

## Local Development
1. Clone the repository.
2. Run `npm install` at the root.
3. Duplicate `.env.example` to `.env.local` and fill in your Firebase and Stripe keys.
4. Run `npm run dev` to start the Turborepo development servers.

## Environment Variables & Deployment
This project relies on environment variables for configuration. See `.env.example` for the required keys.
**SECURITY NOTE**: Never commit `.env` files, Firebase Service Accounts, or Android `.jks` Keystores to Git.

Deployment is recommended on Vercel or Google Cloud Run for the Next.js frontend, and Google Cloud Firestore for the backend. Configure the environment variables within your deployment platform's Secrets Manager.

## License
Proprietary. All rights reserved.
