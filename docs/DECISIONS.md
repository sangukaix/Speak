# Architecture decisions

## 2026-08-26 — Unified Expo client

**Decision:** Use Expo SDK 57, React Native, TypeScript, Expo Router, and React Native Web in one frontend.

**Reason:** A shared codebase maximizes reuse across web, Android, and iOS while retaining platform-specific escape hatches. SDK 57 is the current stable line and targets React Native 0.86.

**Alternatives:** Separate React web and React Native apps; bare React Native.

**Result:** Adopt Expo managed tooling and avoid premature platform forks.

## 2026-08-26 — Runtime targets

**Decision:** Target Node 24.18.0 LTS and Python 3.13.

**Reason:** Node 24 is Active LTS and exceeds Expo SDK 57's minimum. Python 3.13 is stable and supported by the pinned backend and test packages.

**Result:** Record targets in `.nvmrc`, `.python-version`, setup docs, and dependency files.

## 2026-08-26 — Server-owned integrations

**Decision:** Route future OpenAI and Supabase privileged operations through FastAPI; only scoped public or ephemeral values may reach the client.

**Reason:** Permanent API keys and service-role credentials cannot be protected in a mobile/web bundle.

**Result:** Environment templates separate public variables from backend secrets; integrations remain unimplemented in Phase 1.

## 2026-08-26 — Explicit CORS origins

**Decision:** Parse an environment-configurable allowlist with safe local defaults instead of `*`.

**Reason:** Credentialed production requests require explicit trusted origins.

**Result:** Production must set `BACKEND_CORS_ORIGINS` to deployed frontend origins.

## 2026-08-27 — Guided learning loop over an open chatbot

**Decision:** Organize the product around `익히기 → 써보기 → 내 것으로`, with one recommended lesson on Home and a focused preview-session-report flow.

**Reason:** Current speaking products are strongest when curriculum, production, feedback, and the next practice form one loop. An empty chat asks anxious learners to create both the topic and the language task.

**Alternatives:** Chat-first home; dense course catalog; gamified path as the primary navigation.

**Result:** Phase 2 implements four tabs—Home, Practice, Review, Profile—and hides them during the lesson stack. See `PRODUCT_BRIEF.md` and `UX_FOUNDATION.md`.

## 2026-08-27 — Evidence-first feedback hierarchy

**Decision:** Lead correction UI with the utterance, suggested revision, short reason, and confidence or evidence label. Prioritize one takeaway before aggregate scores.

**Reason:** Competitor feedback quality and speech recognition receive inconsistent reports. A confident number without traceable evidence is difficult to trust or correct.

**Alternatives:** Four-axis score dashboard; error count as the primary result; unqualified AI correction text.

**Result:** The sample report and review screens demonstrate the hierarchy without claiming that any real analysis occurred. Future transcript edits and uncertainty states are product requirements.

## 2026-08-27 — Explicit local mocks for Phase 2

**Decision:** Keep lesson, review, progress, profile, and session examples in typed local mock modules and label them in the interface.

**Reason:** A clickable prototype is useful before backend integrations, but simulated records or listening states can mislead testers and future contributors.

**Alternatives:** Premature FastAPI mock endpoints; silent fixture data; fake microphone or AI animations.

**Result:** Fixed data lives under `frontend/src/mocks`. No AI, authentication, storage, microphone, or payment dependency was introduced. The existing real health check moved to a developer route.

## 2026-08-27 — Light-only Phase 2 theme

**Decision:** Set the application to a complete light theme for the current UI foundation.

**Reason:** The previous automatic system setting conflicted with fixed light screen colors and could produce a partially themed experience. A correct dark mode requires its own palette and visual verification.

**Alternatives:** Keep automatic mode with incomplete colors; build both themes during Phase 2.

**Result:** `userInterfaceStyle` is `light`. Dark mode remains a later, explicit design task.

## 2026-08-27 — Official cross-platform symbol dependency

**Decision:** Add `expo-symbols` for semantic icons.

**Reason:** Expo's current guidance marks the older `@expo/vector-icons` package as not recommended, while Expo Symbols provides one API across iOS, Android, and web and is included in Expo Go. The beta status is accepted for this low-risk visual dependency and recorded for future upgrades.

**Alternatives:** Platform-varying Unicode glyphs; hand-drawn icon views; a deprecated icon-font package; custom image assets.

**Result:** `AppIcon` owns a small semantic icon map. The required `expo-font` peer and config plugin are installed. Business logic does not depend on either visual package.
