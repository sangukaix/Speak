# Competitor research

Public research date: 2026-08-27
Authenticated direct-observation date: 2026-08-29 (onboarding, first assessment, and initial results)

## Purpose and method

This research looks for reusable product principles, not screens to copy. It combines:

- direct inspection of current public Speak and Fluently pages;
- official product and help documentation;
- public product-flow collections;
- independent written and video reviews, treated as individual observations rather than population-level evidence.

On 2026-08-27, only Fluently's public sign-in flow was inspected. Its email flow required an emailed one-time code, so the authenticated product was not accessed in that pass. On 2026-08-29, the repository owner manually completed Google Play and Fluently authentication on an Android emulator, allowing a limited direct observation of post-login onboarding, the first assessment, and its initial result flow. No credentials, one-time codes, account identifiers, assessment responses, verbatim learner speech, account-specific result values, personal learning content, or competitor screenshots are stored in this repository.

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

## Authenticated direct-product observation — Fluently

Observation date: 2026-08-29

Context and limits:

- Platform: Android 16 emulator, English locale
- Observed app version: 68
- Authentication: completed manually by the repository owner
- Access tier and entitlement state: not recorded
- Inspected: sign-in choices, onboarding through practice pace, Home, the pre-assessment Progress state, tutor customization controls, Personalization field structure, Settings information architecture, assessment preparation, the assessment call, the initial result hierarchy, skill-detail structure, and the generated-plan handoff
- Not exercised: ordinary AI calls outside the assessment, camera use, course lessons, correction retries, longitudinal progress, notification delivery, subscription, payment, account changes, support contact, invitations, or deletion
- The owner made account-specific schedule choices manually; the selected values were not observed or recorded
- Only interface structure, state transitions, category labels, and product implications were retained. Spoken responses, verbatim personalized feedback, and all account-specific result values were excluded.
- The post-assessment Progress destination did not finish loading during a verified emulator DNS outage. A recovery attempt entered the app's sign-out path, so inspection stopped without re-authentication; this environment-limited state is not treated as evidence about the normal product flow.
- This is one account on one platform. Availability and copy can vary by account, locale, rollout, and subscription.

| Flow step | Authenticated direct observation | Not verified | Implication for Speak AI |
|---|---|---|---|
| Sign-in entry | One entry screen supported email and third-party identity-provider choices before the owner authenticated manually. | Account creation, recovery, SSO behavior, and error states were not exercised. | Phase 3 should specify sign-in, sign-up, recovery, loading, and failure states before selecting an auth provider. |
| Post-login welcome | The first authenticated screen summarized three promised areas: recurring calls, an AI tutor, and progress. It then moved immediately toward building a practice routine. | The underlying feature quality and entitlement rules were not inspected. | A concise value preview can orient a learner, but it must not imply that an untested or unavailable feature is already active. |
| Practice cadence | Before reaching Home, the flow required a choice between daily practice and selected days. Daily practice was visually recommended and paired with an effectiveness claim. The primary continue action remained disabled until a choice was made. | The claim's evidence, notification defaults, editability, and actual scheduling behavior were not verified. | Habit setup can make later prompts feel intentional, but it also delays first value. Our onboarding should offer a clear skip or reversible default and should source any efficacy claim. |
| Preferred time | After cadence, the flow asked when practice should happen. It offered several time-of-day presets and a direct time picker, with continuation disabled until the owner chose a value. | Delivery reliability, time-zone handling, do-not-disturb behavior, and later editing were not verified. | If reminders are added, choose the learner's local time explicitly, show the resulting schedule before saving, and make notification permission a separate, understandable decision. |
| Practice pace | A final onboarding step offered three daily time commitments and paired the selected commitment with an estimated long-term level chart. The owner completed the choice manually; the selected option was not recorded. | The estimate's model, evidence, uncertainty, and later edit behavior were not verified. | Time commitment is easier to understand than an abstract intensity label, but a proficiency forecast must explain assumptions and uncertainty rather than imply a guaranteed outcome. |
| Exit and control | No visible skip appeared on the observed cadence, preferred-time, or pace screens. A back action was visible on later steps, but its behavior was not exercised. | It is unknown whether system Back or another gesture can bypass required setup. | A required preference should explain why it is needed and where it can be changed later; nonessential setup should not trap the learner before first practice. |
| Home and practice entry | Home led with a daily speaking-time goal and a dominant first-level-assessment card. Below it, a two-column grid exposed a workplace course, pronunciation practice, a live themed room, scored pronunciation, a custom prompt, and vocabulary practice. A persistent call action sat beside Practice, Progress, and Settings tabs. After the assessment and plan handoff, the dominant card changed to continuing the prior tutor conversation. | The other practice cards, general call action, course contents, and access rules were not exercised. | The assessment is a clear next action, but many adjacent destinations compete for attention. Speak AI should preserve one recommended session and let its state advance after completion while keeping browsing secondary. |
| Progress before assessment | Progress did not present fabricated learner analytics. It instead asked the learner to complete a short AI-tutor assessment before showing a personal improvement plan. | Scoring validity, calibration, persistence, and the post-assessment Progress destination were not verified. | Withhold personalized analytics until evidence exists. A useful empty state should explain what activity unlocks the view and why. |
| Assessment preparation | The assessment entry described a short introductory call, simple questions, the ability to stop, and a minimum useful speaking sample before presenting the start action. | Question selection, adaptive branching, accessibility, and recovery from interruption were not verified. | Set expectations before requesting speech: purpose, approximate effort, learner control, and how much evidence is needed for a useful estimate. |
| Assessment call and turn taking | The assessment used a phone-call presentation with a tutor identity, elapsed time, an end-call control, prompt text, and a central microphone action. The observed interaction was tap-to-start and tap-to-stop rather than continuous open-mic conversation, with visible recording duration near the control. | Recognition quality, transcript editing, barge-in, noisy-room handling, and no-usable-audio recovery on a physical device were not verified. | Voice state must be unmistakable. Show whether the system is waiting, recording, submitting, processing, or unable to use the audio, and explain the required tap behavior before the first turn. |
| Result summary and uncertainty | The first result screen combined an overall proficiency estimate, a radar chart, and five categories: pronunciation, vocabulary, grammar, fluency, and coherence. It explicitly framed the result as an early estimate based on a limited speaking sample and said that more speech would improve accuracy. | Score construction, CEFR alignment, statistical calibration, entitlement differences, and whether later activity actually revises the estimate were not verified. | A baseline estimate should disclose its evidence quantity and uncertainty. It must not be presented as stable proficiency or longitudinal progress after one short sample. |
| Skill-detail evidence | The result flow opened one page per category. Pronunciation paired a summary with detected sound patterns and a sound map that separated stronger, inconsistent, and insufficient-data sounds. Vocabulary, grammar, and coherence paired narrative summaries with evidence-and-revision cards. Fluency used speech-rate, filler-word, repetition, and replayable audio evidence. | The correctness of any diagnosis or revision, confidence thresholds, replay fidelity, and correction-retry behavior were not evaluated. | Category scores become more actionable when attached to traceable evidence, but evidence also needs confidence, transcript correction, and a direct retry path. Insufficient data should be shown as insufficient data rather than a low score. |
| Results-to-plan handoff | After the detail pages, the flow regrouped categories into strengths and improvement areas, listed detected learning signals by skill family, generated a personal study plan, and returned Home with a continuation action. | The generated exercises, prioritization logic, persistence, later adaptation, and post-assessment Progress view were not inspected. | Convert diagnosis into a small, ordered practice plan and preserve continuity on Home. Keep the learner able to inspect why each item was selected and to remove a mistaken signal. |
| Tutor controls | Tutor customization separated persona choices from call behavior. The call settings exposed conversation mode, tutor intervention frequency, speaking pace, automatic hints, an optional hint control, and live captions. | No option was changed, saved, or tested in a call. | Voice UX should expose correction density and turn-taking controls instead of assuming one conversational rhythm fits everyone. Captions and hint behavior need explicit accessible states. |
| Personalization structure | Personalization grouped study language, current level, learning goal, topic interests, and native language. Account-specific values were neither recorded nor changed. | It was not verified how these fields influence recommendations, memory, or calls. | Every personalization field should state how it affects the experience and remain editable; inferred learning memory should be separate from user-declared preferences. |
| Settings and monetization | Settings opened with a premium promotion, then grouped tutor, notifications, daily goal, and personalization under education, followed by account, invitation, and support destinations. | Entitlements, pricing, subscription lifecycle, notifications, invitations, and support were not exercised. | Keep learning controls distinct from account and commercial controls, and do not let monetization obscure trust or privacy settings. |

These observations are evidence about interaction order, not permission to copy Fluently's wording, artwork, branding, colors, or exact layouts.

## Broader comparison

| Product | Strong pattern | Useful caution | Implication for Speak AI |
|---|---|---|---|
| Speak | The clearest curriculum-to-conversation scaffold; mistakes become takeaway or personalized practice | Reported ASR inconsistency, repetition at higher levels, strongest personalization tied to a higher plan | Keep a guided path, but make correction evidence and uncertainty visible |
| Fluently | Phone-like low-pressure conversation; a baseline assessment expands from category evidence into detected learning signals and a generated plan | Assessment length or a paywall can delay value; mixed reports on memory, bugs, and feedback accuracy | Deliver one complete speech-to-evidence-to-practice loop before requesting commitment |
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

Streak, speaking time, and turn count measure habit. Repeated-error reduction and demonstrated expression use measure learning. A one-time baseline estimate is not longitudinal progress either. The UI must keep these concepts distinct.

### 7. System uncertainty is part of the experience

Future voice UI must distinguish waiting for input, recording, submitted, processing, recognition uncertain, no usable audio, failed, and retry. Tap-to-talk behavior must be explained before the first turn. ASR uncertainty must not silently become a confident grammar correction.

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
