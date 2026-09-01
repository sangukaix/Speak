# Project context

## Purpose and users

Speak AI aims to be a personal AI English tutor for Korean learners who need frequent, low-friction speaking practice and actionable feedback. The primary problems are limited access to conversation partners, anxiety during real conversations, and difficulty turning repeated mistakes into a learning plan.

## Intended experience

The long-term experience combines real-time speech conversation, live transcripts, contextual hints and corrections, end-of-lesson analysis, learning memory, and personalized next lessons. Speak, Fluently, and Duolingo inform interaction principles, but their code, branding, and exact UI are not copied.

## Differentiation direction

The product should connect guided conversation, evidence-based feedback, a prioritized takeaway, durable learner memory, and the next recommended practice into one continuous loop. Feedback leads with transcript evidence, a suggested revision, a reason, and calibrated confidence rather than an opaque score. Agent boundaries may be introduced later when distinct responsibilities justify them; the MVP starts with conventional services.

## MVP and long-term goals

The MVP will validate authentication, profile, text tutor, lesson sessions, reports, and learning history before real-time speech is expanded. Long term, the product adds pronunciation analysis, orchestrated specialist agents, a tutor avatar, subscriptions, notifications, and learning analytics.

## Technology and current stage

The client is Expo/React Native/TypeScript with Expo Router, Expo Symbols, React Native Web, and an inactive Supabase Auth client boundary for email, Google, and Apple. The server is FastAPI. An owner-controlled Supabase project and social-provider credentials, protected backend authentication, application persistence, and OpenAI remain unconnected.

Phases 0–2 are implemented and the application is at the Phase 3 UI/UX checkpoint. A responsive, clickable prototype validates the intended learning loop across web, Android, and iOS code paths; its lesson data, progress, scripted session, and report remain fixed mocks labeled in the UI. The typed authentication state, PKCE client setup, secure native session adapter, email flow, Google OAuth on Android/iOS/web, native Apple login on iOS, Apple OAuth on web, privacy draft, static lesson deep links, and root guards are implemented. The owner approved an account-required current app with any future free experience isolated under `/demo`. The FastAPI health check remains the only live client-server integration because no Supabase project or credentials are configured yet.

## Canonical documentation

- [HANDOFF](HANDOFF.md): active branch, current resume point, machine-local state, fresh Codex prompt, and cross-computer checklist
- [PRODUCT_BRIEF](PRODUCT_BRIEF.md): learner, product promise, scope, and planning record
- [COMPETITOR_RESEARCH](COMPETITOR_RESEARCH.md): public research, sources, limits, and conclusions
- [UX_FOUNDATION](UX_FOUNDATION.md): information architecture, visual system, accessibility, and mock language
- [AUTHENTICATION](AUTHENTICATION.md): Phase 3 identity states, route guards, privacy copy, security boundaries, and acceptance tests
- [ARCHITECTURE](ARCHITECTURE.md): current technical structure and planned service boundaries
- [DECISIONS](DECISIONS.md): durable product and technical decisions
- [PLAN](PLAN.md) and [ROADMAP](ROADMAP.md): delivery sequence
- [TODO](TODO.md): verified current work and next tasks
- [API](API.md), [DATABASE](DATABASE.md), and [AI_ARCHITECTURE](AI_ARCHITECTURE.md): present and planned backend contracts
- [SETUP](SETUP.md), [DEVELOPMENT](DEVELOPMENT.md), and [TROUBLESHOOTING](TROUBLESHOOTING.md): contributor operations
