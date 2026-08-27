# Competitor research

Research date: 2026-08-27

## Purpose and method

This research looks for reusable product principles, not screens to copy. It combines:

- direct inspection of current public Speak and Fluently pages;
- official product and help documentation;
- public product-flow collections;
- independent written and video reviews, treated as individual observations rather than population-level evidence.

Public Fluently sign-in was inspected. Its current email flow requires an emailed one-time code, so the authenticated product was not accessed in this pass. No credentials or authentication data are stored in this repository.

Features can vary by account, locale, platform, rollout, and subscription. Official sources describe intended behavior; reviews are useful for failure modes but do not establish frequency.

## Market pattern

The meaningful competitive loop is no longer simply `open AI chat → talk`. Strong products connect:

`structured path → actual production → correction without breaking flow → report → mistake-based review → next production`

The main product opportunity is to make that loop shorter, more transparent, and easier to trust.

## Direct public-site observations

### Speak

Speak frames the product as an expert-built curriculum personalized by AI. Its public explanation is especially clear around `Learn → Practice → Apply`:

- learn native phrases in a structured lesson;
- repeat until the language becomes easier to retrieve;
- apply it in a real back-and-forth conversation;
- use mistakes and learning history to personalize review and future lessons.

Speak Tutor extends beyond a lesson by answering language questions and creating roleplays or personalized lessons. The product deliberately distinguishes a curriculum-led tutor from a generic chatbot. Premium Plus concentrates stronger personalization such as study plans and exercises based on frequent mistakes.

Sources: [Speak public site](https://www.speak.com/?lang=en), [What is Speak Tutor?](https://help.speak.com/en/articles/11396739-what-is-speak-tutor), [Premium and Premium Plus](https://help.speak.com/en/articles/5358417-what-s-the-difference-between-premium-and-premium-plus), [new home screen](https://help.speak.com/en/articles/11430473-explore-your-new-home-screen), [Free Talk roleplay](https://help.speak.com/en/articles/13182402-free-talk-immersive-roleplay).

### Fluently

Fluently leads with low-friction speaking: an AI tutor that feels like a call, instant feedback, and no flashcards. Its public product story emphasizes:

- an assessment across pronunciation, fluency, vocabulary, and grammar;
- daily AI calls and sound-level pronunciation feedback;
- structured courses and games;
- interview, job, and industry-specific practice;
- professional outcomes such as presentations, stand-ups, and difficult questions.

The visual language is dark, cinematic, and call-centric. Testimonials emphasize low judgment, phone-call naturalness, and continuity between conversations. Independent feedback is more mixed around assessment accuracy, grammar quality, support, bugs, and subscription expectations.

Sources: [Fluently public site](https://getfluently.app/), [public screen flow](https://screensdesign.com/apps/fluently-ai-english-tutor/), [free version and trial](https://help.getfluently.app/en/articles/11372865-is-there-a-free-version-or-trial), [Trustpilot reviews](https://www.trustpilot.com/review/getfluently.app), [Papora review](https://www.papora.com/learn-english/fluently-coach-ia-reviews/).

## Broader comparison

| Product | Strong pattern | Useful caution | Implication for Speak AI |
|---|---|---|---|
| Speak | The clearest curriculum-to-conversation scaffold; mistakes become takeaway or personalized practice | Reported ASR inconsistency, repetition at higher levels, strongest personalization tied to a higher plan | Keep a guided path, but make correction evidence and uncertainty visible |
| Fluently | Phone-like low-pressure conversation and concrete job or interview goals | Long assessment or paywall can delay value; mixed reports on memory, bugs, and feedback accuracy | Deliver one complete value loop before requesting commitment |
| Duolingo | Habit loop, familiar path, and speaking features embedded inside existing progress | XP and task goals can distort natural conversation; repeated questions and ASR failures are reported | Separate habit effort metrics from language ability metrics |
| ELSA Speak | Deep pronunciation and phoneme-level diagnostic views | Dense scoring and recognition strictness can feel inconsistent or overwhelming | Add pronunciation only after calibration; reveal evidence, not just a score |
| Praktika | Avatar presence and scenario immersion reduce social pressure for some learners | Avatar or accent quality can reduce trust; the tutor may speak too much | Treat an avatar as an optional later layer, not the learning core |
| Loora | Limits spoken interruption and turns one key error into an immediate takeaway | A fixed daily session can feel long; open conversation may unlock too late | Keep sessions short and let the learner control correction depth |

Sources: [Duolingo Max](https://blog.duolingo.com/duolingo-max/), [Duolingo Practice Hub](https://blog.duolingo.com/guide-to-duolingo-practice-hub/), [Duolingo 2026 Q2 filing](https://www.sec.gov/Archives/edgar/data/1562088/000162828026053299/q2fy26duolingo6-30x26share.htm), [ELSA 2026 experience](https://blog.elsaspeak.com/en/discover-the-new-elsa-speak-experience/), [Praktika learning process](https://intercom.help/praktika-ai/en/articles/10707916-learning-process), [Loora feedback](https://www.loora.com/support/features/feedback-and-corrections), [Loora key takeaways](https://www.loora.com/support/features/key-takeaways).

## Video and long-form review notes

Videos are supporting evidence for interaction rhythm and user perception. They are not authoritative current specifications.

- [Fluently AI Review (2026)](https://www.youtube.com/watch?v=YSI2x_wKL3E&vl=en) shows interview and call-oriented use. The creator includes affiliate links, so commercial incentive must be considered.
- [Qualified English teacher review of Fluently](https://www.youtube.com/watch?v=B5hQkrOGnmY) raises concerns about inaccurate assessment feedback and language quality. It is one evaluator's experience, but it reinforces the need for evidence and uncertainty states.
- [Duolingo official Lily Video Call](https://www.youtube.com/watch?v=vBjfn2Pb6DI) demonstrates how a recognizable character can lower the emotional barrier to speaking.
- [Long-term Speak user review](https://www.youtube.com/watch?v=mPMYuaeOw1s) is helpful for habit observations but shows an older 2024 interface.
- [Praktika teacher review](https://youtu.be/_MJJrzLbavc) and its [companion article](https://oh-yeah-sarah.medium.com/unbiased-praktika-review-by-a-qualified-language-teacher-bf14a26e9813) pair immersion benefits with concerns about generated errors and accent consistency.
- [Two-year Duolingo Max review](https://davidwilliamrosales.com/2025/09/27/duolingo-max-review/) credits habit formation and Push-to-Talk improvements while noting repetitive questions, ASR issues, and unpredictable call length.

## Product conclusions

### 1. Home must answer “what should I do now?”

Use one main recommended session. Practice browsing, review, and history remain secondary.

### 2. Never open with an empty conversation

The safer order is `goal and time → useful phrases → warm-up → guided production → freer application`.

### 3. Conversation and correction need separate rhythms

During a conversation, use quiet visual markers and interrupt only for the most important items. Put explanation and retry controls in the report.

### 4. Feedback needs evidence and calibrated language

Show transcript evidence, the suggested change, a short reason, and whether it is a rule, a high-confidence usage recommendation, or a tentative learning suggestion. Let users correct a transcript before it becomes learning memory.

### 5. Report fewer things and make each actionable

Prioritize at most three corrections and one takeaway. Attach `다시 말하기` and a focused follow-up exercise instead of showing a wall of scores.

### 6. Effort is not ability

Streak, speaking time, and turn count measure habit. Repeated-error reduction and demonstrated expression use measure learning. The UI must not present the first group as proficiency.

### 7. System uncertainty is part of the experience

Future voice UI must distinguish listening, processing, submitted, recognition uncertain, failed, and retry. ASR uncertainty must not silently become a confident grammar correction.

### 8. Give one complete value loop before a paywall

The learner should experience speech, correction, explanation, and a retry before a subscription decision. Payment design remains out of the current phase.

### 9. Memory must be legible and reversible

Remember only goals, topic preferences, and traceable repeated mistakes. Provide a view where the learner can edit or delete each item.

### 10. Avatar comes after trust

Do not invest in an avatar until voice, transcript, and feedback quality are dependable. An avatar can later be an optional immersion layer.

## What the Phase 2 prototype adopts

- Speak's guided progression, simplified into `익히기 → 써보기 → 내 것으로`;
- Fluently's situation and outcome focus, especially workplace conversation;
- Loora's priority on one takeaway;
- a stronger evidence hierarchy and explicit confidence language as the product's own differentiation;
- a short action-first home rather than a dense dashboard;
- a fully labeled scripted demo instead of pretending that AI, voice, or persistence already works.

The code, branding, exact layouts, media, and written copy of competitors are not copied.
