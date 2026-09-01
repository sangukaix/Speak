# AI architecture plan

Status: **Planned**. No OpenAI request, model, Realtime session, agent, or speech analysis is implemented.

## Development model boundary

The Phase 5 text tutor will sit behind FastAPI and use a small provider adapter. Local development may point that adapter to Ollama on the development computer; a production provider is selected after quality, safety, latency, privacy, and cost evaluation.

```text
Expo app --> authenticated Speak FastAPI --> development: Ollama / Gemma
                                      `----> production: evaluated hosted provider
```

The Expo bundle receives neither an Ollama URL nor a permanent hosted-provider key. Android/iOS devices call Speak FastAPI, and FastAPI alone calls loopback Ollama at `http://127.0.0.1:11434`. Directly exposing Ollama to a phone over the LAN is not the product architecture because the local Ollama API has no built-in authentication. Its OpenAI-compatible API can simplify the backend adapter, but compatibility does not make model behavior interchangeable; each provider still needs evaluation and schema/error tests.

Gemma can support text tutoring and structured lesson-report experiments. It is not speech-to-text or text-to-speech, so it does not replace the later Realtime/ASR/TTS work. Ollama and downloaded model blobs are optional machine-local development tools, not repository dependencies and not copied between computers through Git.

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

Primary local-development references: [Ollama API](https://docs.ollama.com/api/introduction), [OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility), and [local API authentication boundary](https://docs.ollama.com/api/authentication).

## Planned learner memory

Memory may include current level, goal, interests, repeated grammar/vocabulary/expression errors, pronunciation issues, recent lessons and scores, improvements, recommended review, and next lesson. Retention and user deletion controls must be designed before storage begins.
