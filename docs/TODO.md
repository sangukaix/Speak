# TODO

## Phase 0 — setup

- [x] Create repository structure and required documentation
- [x] Pin Node and Python targets and add environment templates
- [x] Add portable PowerShell setup and run scripts
- [x] Add a secret-free cross-computer handoff, fresh Codex prompt, and active-branch recovery instructions
- [x] Ignore local environment variants while keeping safe `.env.example` templates tracked

## Phase 1 — skeleton

- [x] Create Expo Router TypeScript project
- [x] Create FastAPI application structure
- [x] Implement and test `GET /health`
- [x] Configure explicit development CORS origins
- [x] Connect frontend status screen to `/health`
- [x] Pass frontend TypeScript check and web export

## Phase 2 — UI foundation

- [x] Research current Speak, Fluently, and adjacent speaking products using public sources
- [x] Record the product brief, competitor conclusions, information architecture, and visual rules
- [x] Define typed UI tokens and accessible reusable components
- [x] Implement Home, Practice, Review, and Profile tab routes
- [x] Implement the lesson preview, scripted choice session, and example report loop
- [x] Label all fixed lesson, progress, profile, session, and report behavior as demo or example content
- [x] Preserve the real backend health check under the developer route
- [x] Verify TypeScript, Expo dependency compatibility, backend tests, web interaction, responsive widths, and iOS/Android/web exports

## Phase 3 — authentication

- [x] Draft and technically review authentication states, verified email/password scope, privacy copy, route guards, security boundaries, and acceptance tests before adding Supabase
- [x] Owner review: require authentication for all current tabs/lessons; reserve a separate `/demo` tree for any future public free loop
- [ ] Create an owner-controlled Supabase development project and record region/configuration without storing credentials in docs or prompts
- [x] Replace legacy planned key names with publishable/secret-key templates and implement a platform-protected native session adapter without a plaintext AsyncStorage fallback
- [x] Implement typed auth state, sign-up, verification, sign-in, restoration, recovery, current-device sign-out, PKCE callback handling, and explicit unconfigured/restore-error states
- [x] Add Google OAuth on Android/iOS/web, native nonce-protected Apple login on iOS, Apple OAuth on web, and platform-specific sign-in UI without adding client secrets
- [x] Re-run TypeScript, Expo Doctor 21/21, Android/iOS/web export, dependency-tree, desktop/mobile browser, and social-cancel callback checks for the unconfigured social checkpoint
- [x] Set the owner-approved Android package and iOS bundle identifier to `com.sangukaix.speakai`
- [ ] Configure and verify owner-controlled Google/Apple provider projects, exact redirect allowlists, consent screens, Apple capability/secret rotation, and same-email/private-relay identity behavior
- [ ] Implement reauthentication and account deletion after the protected backend boundary is ready
- [x] Pause at the complete navigable auth UI/UX checkpoint and present its screen/transition map and working preview to the owner before final polish
- [x] Protect the owner-selected account route tree at the root; block direct production developer-health navigation; export fixed lesson params for static-web deep links
- [x] Add locally tested FastAPI asymmetric JWT signature/issuer/audience/expiry/learner-claim verification, protected `GET /auth/me`, and configured-origin GET preflight handling without using provider secrets
- [ ] Connect JWT verification to the real project, add authoritative active-session validation, `DELETE /account`, DELETE CORS preflight, deletion reauthentication, and pre-delete-token rejection tests
- [ ] Pass the Phase 3 acceptance matrix on web and Android, then verify iOS before claiming cross-platform completion
- [ ] Complete production privacy, processor/region/retention, SMTP, age-policy, deep-link, deletion, and abuse-control gates before public registration

## Parallel product and maintenance decisions

- [x] Inventory and smoke-test the optional local Ollama `gemma4:26b` model; keep application integration deferred to the Phase 5 FastAPI provider boundary
- [ ] Review the working name, Korean copy, visual direction, and workplace-English launch wedge with target learners
- [ ] Decide which complete free learning loop appears before any future paywall
- [ ] Keep dark mode planned until a full second palette and platform visual QA are in scope
- [ ] Upgrade the Expo toolchain when its `xcode` dependency accepts `uuid` 11.1.1+; do not use the audit-suggested Expo 46 downgrade
