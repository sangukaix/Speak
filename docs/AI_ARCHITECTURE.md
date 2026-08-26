# AI architecture plan

Status: **Planned**. No OpenAI request, model, Realtime session, agent, or speech analysis is implemented.

## Evolution

The first AI implementation will be a conventional backend `AI Tutor` service. Specialist agents are introduced later only when evaluation supports the added complexity.

```text
AI Orchestrator
|-- Tutor Agent          real-time teaching interaction
|-- Report Agent         post-lesson grammar/vocabulary/expression/fluency analysis
|-- Memory Agent         strengths, repeated mistakes, and history updates
|-- Planner Agent        personalized next lessons and review plan
`-- Pronunciation Service pronunciation evidence and scoring
```

## Target lesson flow

```text
User -> lesson start -> FastAPI -> ephemeral Realtime credential
     -> Expo -> WebRTC -> OpenAI Realtime -> live speech and transcript
     -> lesson end -> Report Agent -> Memory Agent -> Planner Agent
```

Permanent provider keys remain in FastAPI. Agent inputs and outputs will use versioned schemas, user memory changes will be auditable, and prompt/model versions will be recorded with reports. Safety, privacy, latency, and cost evaluations are required before production.

## Planned learner memory

Memory may include current level, goal, interests, repeated grammar/vocabulary/expression errors, pronunciation issues, recent lessons and scores, improvements, recommended review, and next lesson. Retention and user deletion controls must be designed before storage begins.
