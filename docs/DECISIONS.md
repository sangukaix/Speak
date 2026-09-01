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

## 2026-08-29 — Repository-owned cross-computer handoff

**Decision:** Treat tracked project documentation, especially `AGENTS.md` and `docs/HANDOFF.md`, as the durable continuation context across computers and fresh Codex sessions.

**Reason:** Local chat history, authentication sessions, dependencies, environment files, and emulator state do not reliably travel with a Git clone. Storing secrets or copying auth caches would create a security risk, while a maintained handoff document can preserve the product state and next action without personal data.

**Alternatives:** Depend on the previous chat; copy the entire user profile or Codex home; put account credentials in a private Markdown file.

**Result:** New sessions read `HANDOFF.md` before project context, clone the active branch explicitly, recreate local dependencies from pinned files, and require the owner to complete account login or MFA. Passwords, OTPs, tokens, cookies, service-login identifiers, and API keys are never part of handoff or source documentation. Normal Git remote and author metadata remain subject to the owner's Git/GitHub privacy settings.

## 2026-09-01 — Phase 3 authentication boundary

**Decision:** Use Supabase Auth with verified email and password for the first account flow. The Expo client calls Auth directly with a publishable key; FastAPI validates learner JWTs for protected APIs and owns privileged account deletion with a backend-only secret.

**Reason:** Email/password covers the minimum cross-platform account and recovery loop without adding social-provider policy, phone-number lifecycle, or MFA complexity. Sending passwords directly to the identity provider avoids making FastAPI a credential proxy. Client route guards improve navigation privacy, while server JWT verification and future least-privilege RLS preserve the actual authorization boundary.

**Alternatives:** Proxy every credential through FastAPI; start with social login; add anonymous users; rely on client navigation as authorization; expose a legacy service-role key in the app.

**Result:** Phase 3 includes sign-up, verification, sign-in, restoration, recovery, current-device sign-out, account deletion, root route guards, generic anti-enumeration errors, and the acceptance matrix in [AUTHENTICATION](AUTHENTICATION.md). On 2026-09-01 the owner approved requiring authentication for all current tabs and lesson routes; any future free experience will use a separate `/demo` tree. Profile onboarding remains Phase 4. No Supabase project or dependency is added by this decision alone.

## 2026-09-01 — Authentication privacy and password baseline

**Decision:** Collect only the email and provider-generated authentication/session data needed for an account in Phase 3. Use 15–64-character passphrases without composition rules, require email verification, keep passwords and session credentials out of logs, and block public registration until processor, transfer, retention, age-policy, production email, and deletion details are published and verified.

**Reason:** The learning product will later handle potentially sensitive voice and transcript data, but authentication does not need any of it. Clear separation prevents a basic account screen from silently becoming consent for future learning, AI, audio, marketing, or payment processing.

**Result:** The Korean copy baseline and data matrix live in [AUTHENTICATION](AUTHENTICATION.md). The current demo still stores no learner profile, lesson, voice, transcript, report, or memory data.

## 2026-09-01 — Authentication UI review checkpoint before provider connection

**Decision:** Implement and review the complete account-screen state machine with provider actions disabled before creating the owner-controlled Supabase project.

**Reason:** Login/MFA and region selection require the owner, while information architecture, copy, accessibility, guarded navigation, PKCE wiring, and cross-platform bundle compatibility can be validated safely without creating real accounts or leaking configuration. A development-only walkthrough makes exceptional states visible without pretending that provider calls succeeded.

**Result:** `/developer/auth-preview` links the sign-in, sign-up, verification, recovery, reset, callback-error, and restore-error states. Blank public Supabase settings keep account actions disabled. The root protects all learner tabs and lesson routes, production navigation excludes developer routes, and fixed lesson IDs have static parameters. Provider behavior, protected FastAPI authorization, account deletion, and launch privacy gates remain pending owner review and real project setup.

## 2026-09-01 — Add Google and Apple account entry

**Decision:** Extend the Phase 3 account entry to Google on Android, iOS, and web; native Sign in with Apple on iOS; Apple OAuth on web; and retain verified email/password everywhere. Android does not show Apple in this checkpoint. The earlier email-first decision remains the recovery baseline but no longer excludes social login.

**Reason:** The owner asked for direct platform-appropriate login. On iOS, offering Apple alongside Google also preserves a privacy-oriented equivalent login path. Supabase can broker OAuth without placing Google or Apple client secrets in the Expo bundle. Native Apple login uses the system sheet and a per-request SHA-256 nonce; Google native uses a PKCE browser session so one implementation works across both mobile platforms.

**Result:** The code and unconfigured review UI are implemented. Actual sign-in remains disabled until the owner creates Supabase, Google, and Apple configurations and supplies only the Supabase URL/publishable key locally. Supabase automatic linking for the same verified email is accepted as the initial policy; Apple private-relay or different-email identities are never merged by client guesswork. Account linking, provider-specific fresh reauthentication before deletion, provider consent screens, exact callbacks, Apple secret rotation, and real-device behavior remain release gates.

## 2026-09-01 — Stable mobile application identifiers

**Decision:** Use `com.sangukaix.speakai` for both the Android package and iOS bundle identifier.

**Reason:** Provider, entitlement, signing, and store records need one stable reverse-DNS identifier before owner-controlled Google and Apple setup begins. The identifier is independent of the user-facing working name, which may still change after naming and trademark review.

**Result:** `frontend/app.json` contains the identifier on both platforms. Provider and installed-build configuration must reuse it; changing it later is a deliberate migration decision rather than an incidental rename.
