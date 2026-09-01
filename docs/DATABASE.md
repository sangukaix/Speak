# Database plan

Status: **Planned**. No Supabase project, schema, migration, or live database connection exists. The Phase 3 client boundary is implemented but remains inactive while its public project configuration is blank; no application table has been created.

Supabase Auth's provider-managed `auth.users` table will be the identity source. Phase 3 must not expose that schema or create a duplicate public `users` mirror merely to prove authentication. The Phase 4 `profiles.user_id` will reference the Auth user ID after ownership, deletion, grants, and RLS are defined.

Expected entities:

| Entity | Planned purpose |
|---|---|
| profiles | Level, goals, interests, and preferences |
| lesson_sessions | Lesson lifecycle and timing |
| messages | Ordered lesson conversation events |
| lesson_reports | Structured end-of-lesson assessment |
| mistakes | Normalized grammar, vocabulary, and expression issues |
| learning_memory | Durable strengths, weaknesses, and review signals |
| lesson_plans | Personalized future lesson specifications |
| pronunciation_results | Pronunciation measurements and evidence |
| subscriptions | Entitlement state linked to payment provider records |

Before implementation, define ownership, foreign keys, retention, row-level security, indexes, deletion behavior, and migrations. Service-role credentials must remain backend-only.
