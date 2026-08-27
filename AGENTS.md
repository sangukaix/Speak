# Speak AI agent instructions

## Before every task

Read, in order:

1. `AGENTS.md`
2. `docs/mustRule.md`
3. `README.md`
4. `docs/PROJECT_CONTEXT.md`
5. `docs/ARCHITECTURE.md`
6. `docs/TODO.md`
7. The relevant source and tests

## Working rules

- Analyze the existing behavior and impact before editing.
- Preserve working features unless the requested change explicitly replaces them.
- Stay within the requested phase and scope. Do not prebuild OpenAI, Supabase, payments, agents, or avatars.
- Prefer readable, direct code and the smallest justified dependency set.
- Avoid `any`; keep shared TypeScript types near their domain.
- Add every Python import dependency to the appropriate requirements file.
- Keep secrets out of source control and frontend bundles. Only variables prefixed with `EXPO_PUBLIC_` may be public.
- Label mock data and mock behavior explicitly. Never describe a mock as a real integration.
- Update API, setup, architecture, decision, and task documentation whenever the corresponding behavior changes.
- Do not mark a TODO complete until implementation, minimum verification, and documentation are complete.

## Before completing a task

Check TypeScript, Python imports, tests, missing dependencies, API behavior, environment variables, secret exposure, regressions, and whether README/TODO/DECISIONS need updates. Report changed files and any unverified behavior.
