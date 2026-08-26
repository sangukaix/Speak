# Database plan

Status: **Planned**. No Supabase project, schema, migration, or live database connection exists in Phase 1.

Expected entities:

| Entity | Planned purpose |
|---|---|
| users | Auth identity reference; Supabase Auth remains the source of identity |
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
