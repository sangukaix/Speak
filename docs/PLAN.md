# Implementation plan

Each phase begins after its dependencies are verified. Completion requires implementation, minimum tests, and related documentation updates.

| Phase | Goal | Main work | Completion condition | Depends on |
|---|---|---|---|---|
| 0 | Project setup | Versions, repository rules, environment templates, documentation | Fresh Windows setup is documented | None |
| 1 | Frontend/backend skeleton | Expo Router, FastAPI, health API, CORS, connection UI | Type check, API test, web export pass | 0 |
| 2 | UI foundation | Theme, navigation, reusable primitives | Target screens have approved skeletons | 1 |
| 3 | Authentication | Supabase Auth and guarded routes | Signup/login/logout tests pass | 2 |
| 4 | User profile | Level, goals, interests | Profile persists and reloads | 3 |
| 5 | AI text tutor | Secure backend OpenAI text flow | Conversation and error paths pass | 4 |
| 6 | OpenAI Realtime | Ephemeral session API | Client obtains scoped credential | 5 |
| 7 | Voice conversation | WebRTC speech-to-speech | Stable two-way audio session | 6 |
| 8 | Realtime transcript | Transcript events and UI | Transcript matches session events | 7 |
| 9 | Lesson session | Lifecycle and persistence | Complete/recover lesson session | 8, 4 |
| 10 | Lesson report | Structured analysis | Valid report generated and stored | 9 |
| 11 | Learning history | History and report retrieval | Paginated history works | 10 |
| 12 | Memory | Mistake and strength memory | Memory updates are traceable | 10, 11 |
| 13 | Personalized planner | Next lesson plan | Plan uses profile and memory | 12 |
| 14 | Pronunciation | Speech scoring service | Calibrated pronunciation result | 9 |
| 15 | Agent architecture | Orchestrator and specialist agents | Boundaries improve reliability measurably | 10-14 |
| 16 | Avatar | Tutor avatar experience | Performance and UX targets met | 7, 15 |
| 17 | Payment | Subscription and entitlements | Verified purchase lifecycle | 3 |
| 18 | Deployment | Production infrastructure | Monitored releases for API and apps | All release scope |
