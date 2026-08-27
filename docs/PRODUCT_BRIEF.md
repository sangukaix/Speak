# Product brief

Updated: 2026-08-27

## Working premise

Speak AI is a mobile-first English speaking coach for Korean learners who understand more English than they comfortably produce. The product should make starting a short speaking session easy, explain feedback with evidence, and turn one session into the next useful practice.

`Speak AI` is a working project name, not a final brand decision. Because an established competitor already uses Speak, naming and trademark review must happen before public launch.

## Primary learner

The first target is a Korean adult learner who:

- needs English for work or travel;
- can read common expressions but freezes when speaking;
- wants frequent practice without social pressure;
- has little time and benefits from a clear next action;
- wants to know why a correction was suggested, not only receive a score.

The first high-value context is workplace English. Everyday and travel situations remain secondary paths so the information architecture can support broader use later.

## Jobs to be done

1. When I have a few free minutes, help me start one useful speaking practice without choosing from an overwhelming catalog.
2. Before I speak, give me enough context and language support to avoid a blank-chat experience.
3. After I speak, show what I said, what could improve, why, and what to try next.
4. Over time, help me see which mistakes repeat and whether they are becoming less frequent.
5. Let me inspect and control what the tutor remembers about me.

## Product promise

**A short speaking loop that turns understandable feedback into the next confident attempt.**

The product is not differentiated by having an AI chat box. Its intended advantage is the connection between:

`guided context → learner speech → evidence-based feedback → one prioritized takeaway → short retry → next lesson`

## Product principles

### Action before catalog

The home screen leads with one recommended practice. Browse, review, and profile are secondary destinations.

### Guidance before freedom

The first experience starts with a goal, situation, and useful phrases. Open-ended free conversation can be added after learners understand the interaction.

### Flow before correction density

Future live conversations should avoid interrupting every error. In-session correction is quiet and selective; detailed explanation belongs in the report.

### Evidence before scores

Feedback should lead with the learner transcript, suggested revision, short reason, and confidence or uncertainty. A single opaque total score is not sufficient.

### One next action

Reports prioritize at most three useful corrections and one main takeaway. Every report should make the next practice obvious.

### Honest system state

Listening, processing, uncertain recognition, saved, and failed states must be explicit. A mock must never look like a working AI, microphone, or database integration.

### Visible, editable memory

Future learning memory should be limited to understandable items such as goals, preferred topics, and repeated mistakes. Learners must be able to inspect, edit, and delete it.

## Core experience

The Phase 2 prototype validates this flow:

1. Home presents one `오늘의 말하기` action.
2. Lesson preview explains the situation, time, goals, and key phrases.
3. A clearly labeled scripted demo simulates turn-taking through answer choices.
4. An example report shows the intended evidence hierarchy.
5. The review note groups corrections by expression, grammar, and pronunciation.
6. The learner returns to the next action.

The production flow will later replace the scripted turn with warm-up, guided speech, and freer application. That replacement is outside Phase 2.

## Phase 2 scope

Included:

- product and competitor research;
- responsive mobile-first navigation;
- theme tokens and reusable accessible UI primitives;
- home, practice, review, profile, lesson preview, scripted session, and sample report screens;
- explicit demo content and planned-feature labels;
- preservation of the real backend health check as a developer screen.

Not included:

- authentication or user accounts;
- OpenAI or another AI provider;
- microphone, recording, speech recognition, or pronunciation scoring;
- Supabase, persistence, streaks, or real personalization;
- subscriptions or payment;
- agents or tutor avatars.

## Prototype success criteria

The prototype is successful when a tester can:

- find the next practice without explanation;
- understand the lesson goal before starting;
- complete the scripted loop without a dead end;
- distinguish all sample data from real analysis or saved progress;
- explain what the report changed and why;
- navigate the same structure at phone and web widths;
- operate controls with visible labels and minimum touch targets.

## Planning record

The project owner confirmed that the frontend can be designed collaboratively rather than requiring a finished design handoff. They asked for a strong initial product frame informed by Speak, Fluently, public web material, and videos, while allowing later planning changes when evidence supports a better direction.

The resulting decision is to build a coherent product skeleton now, keep high-cost integrations out of scope, and store the rationale in repository Markdown so future changes can update a shared source of truth. Research findings are in [COMPETITOR_RESEARCH](COMPETITOR_RESEARCH.md), screen and visual rules are in [UX_FOUNDATION](UX_FOUNDATION.md), and technical decisions are in [DECISIONS](DECISIONS.md).

## Open product questions

- Final public name and brand clearance
- Whether workplace English remains the launch wedge after user interviews
- How much correction should appear during a real conversation
- Which feedback confidence labels learners understand without training
- What minimum free experience proves value before a paywall
- Which learning memories users consider helpful versus intrusive
