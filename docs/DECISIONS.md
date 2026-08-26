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
