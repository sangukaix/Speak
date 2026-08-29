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

## Next phase

- [ ] Review the working name, Korean copy, visual direction, and workplace-English launch wedge with target learners
- [ ] Define Phase 3 authentication states, privacy copy, route guards, and acceptance tests before adding Supabase
- [ ] Decide which complete free learning loop appears before any future paywall
- [ ] Keep dark mode planned until a full second palette and platform visual QA are in scope
- [ ] Upgrade the Expo toolchain when its `xcode` dependency accepts `uuid` 11.1.1+; do not use the audit-suggested Expo 46 downgrade
