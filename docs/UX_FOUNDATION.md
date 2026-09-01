# UX foundation

Updated: 2026-08-27

## Experience statement

The interface should feel calm enough to reduce speaking anxiety and decisive enough to start practice immediately. It is a coach, not a game arcade and not an analytics dashboard.

The Phase 2 visual concept is **calm momentum**:

- deep green communicates focus and trust;
- warm off-white avoids a clinical dashboard feel;
- coral highlights the one correction or takeaway that deserves attention;
- yellow marks short, encouraging metadata rather than proficiency;
- large rounded surfaces and generous spacing reduce density.

The UI intentionally does not reproduce Speak's course path or Fluently's dark phone-call screen.

## Information architecture

### Persistent tabs

| Tab | Job | Main content |
|---|---|---|
| 홈 | Start the next best action | Today's practice, sample weekly direction, learning loop |
| 연습 | Browse an intentional practice | Recommendation path, category filters, lesson cards |
| 복습 | Understand and reuse corrections | Expression, grammar, and pronunciation example notes |
| 나 | Inspect goals and system promises | Demo learning settings, memory principle, developer tools |

### Focused stack screens

Tabs are hidden during the lesson loop so the learner has one clear task:

```text
Home or Practice
  └─ Lesson preview
      └─ Scripted session
          └─ Example report
              ├─ Review note
              └─ Home
```

Routes:

```text
src/app/index.tsx                 Redirect to tabs
src/app/(tabs)/index.tsx          Home
src/app/(tabs)/practice.tsx       Practice library
src/app/(tabs)/review.tsx         Evidence-based review
src/app/(tabs)/profile.tsx        Learner settings and trust
src/app/lesson/[lessonId].tsx     Lesson preview
src/app/lesson/session.tsx        Scripted choice session
src/app/lesson/report.tsx         Example report
src/app/developer/health.tsx      Real backend health check
```

Authentication has reached its Phase 3 navigable UI/UX checkpoint, including platform-specific social entry. Onboarding remains Phase 4; assessment, subscription, and real learning history remain later planned routes. No live Supabase, Google, or Apple provider project is connected at this checkpoint.

### Implemented Phase 3 auth routes

```text
/                         Session bootstrap and state resolution
/auth/sign-in             Google/Apple (by platform) and email/password sign-in
/auth/sign-up             Account creation and privacy summary
/auth/verify              Verification explanation and resend
/auth/recovery            Neutral password-reset request
/auth/reset               Valid recovery session only
/auth/callback            PKCE callback handling
/auth/restore-error       Safe session-restore recovery
/privacy                  Public full notice
/developer/auth-preview   Development-only state walkthrough
```

The owner approved an account-required Phase 3 app, so the root stack protects all existing tabs and lesson screens together. Any future free experience uses a separate `/demo` tree and requires its own review. The sign-in screen presents Apple first on iOS, Google on Android/iOS, Google and Apple on web, then a clearly divided email path. iOS uses Apple's official native button whenever the provider is configured and idle. Auth screens otherwise use the same calm, focused hierarchy as lesson preview: one title, short explanation, fields, one primary action, and recovery links. The implemented state model covers bootstrap, restore failure, signed out, verification wait, recovery, signed in, and blocking sign-out. Generic service-error mapping exists; real provider cancellation/offline/rate-limit behavior remains to be tested after project connection. A session bootstrap keeps the launch surface visible so protected content never flashes before authentication resolves.

Auth fields must support password managers, paste, autofill semantics, keyboard navigation, screen-reader labels, and focus on the first actionable error. Password visibility controls need accessible names; errors and status changes need announcements. Existing 44 × 44 px targets and non-color-only states remain mandatory.

## Screen hierarchy

### Home

1. Compact brand and current prototype label
2. `오늘의 말하기` headline
3. One high-contrast recommended lesson and primary action
4. Secondary sample direction and review entry
5. A short explanation of the learning loop

The home screen does not start with streak, score, or a large lesson catalog.

### Lesson preview

1. Situation, level, and expected time
2. Three concrete objectives
3. Key expressions with translations
4. Explicit notice that the current session is scripted
5. Start action

### Scripted session

1. Turn progress and exit
2. Current context
3. Clearly labeled fixed tutor script
4. Two prewritten learner responses
5. Explanation after a response is chosen
6. Disabled voice placeholder with an honest system-state message

The prototype never animates a waveform or claims to be listening.

### Example report

1. Explicit `예시 리포트` label and no-analysis notice
2. Factual summary of what the scripted demo contained
3. One prioritized takeaway
4. Original example, revision, reason, and evidence label
5. Intended next actions

Numeric proficiency scores are intentionally absent because no speech was measured.

### Review

Correction cards follow the same hierarchy:

`kind and source → example utterance → improved version → reason → confidence/evidence label`

Pronunciation content must say whether it is a generic practice suggestion or a result derived from actual audio.

## Design tokens

Canonical values live in `frontend/src/theme/tokens.ts`.

| Role | Value | Use |
|---|---|---|
| Background | `#F4F4EF` | Warm application canvas |
| Ink | `#18312F` | Primary text and hero |
| Primary | `#176B5B` | Actions, selection, trust |
| Primary soft | `#DCEDE7` | Selected or supportive surfaces |
| Accent | `#F17457` | One important correction or takeaway |
| Sunshine | `#F3C95D` | Encouraging metadata |
| Surface | `#FFFFFF` | Cards and controls |
| Muted | `#6D7E7A` | Secondary text |
| Line | `#D9DFDA` | Boundaries without heavy contrast |

Spacing uses a 4-point family. Corner radii range from 10 to 28 pixels. The maximum web content width is 760 pixels so the app remains task-focused rather than becoming a desktop dashboard.

## Component rules

The reusable layer stays intentionally small:

- `AppText` provides the approved type hierarchy;
- `AppIcon` maps semantic names to cross-platform system symbols;
- `Button`, `Chip`, and `BackButton` own press and accessibility states;
- `Card`, `ProgressBar`, `Screen`, `SectionHeader`, and `DemoBadge` own repeated layout patterns;
- `LessonCard` is the only current domain-level card.

Create a new primitive only when multiple real screens need the same behavior. Do not create generic configuration systems for hypothetical screens.

## Responsive behavior

- 360–430 px: single-column phone layout; secondary home cards stack below 430 px.
- 431–799 px: single main column with more breathing room.
- 800 px and above: content remains centered at 760 px; paired secondary cards may share a row.
- Bottom tabs remain the primary web navigation in Phase 2 to keep parity with the mobile mental model.
- There is no sidebar or desktop-only feature fork.

## Accessibility baseline

- Interactive controls have at least a 44 × 44 px target.
- Every icon-only control has an accessibility label.
- Selected and disabled states are exposed to assistive technology and do not rely only on color.
- Text and primary controls maintain strong foreground/background contrast.
- Reading and focus order follow the visible order.
- Progress bars expose numeric accessibility values.
- Dynamic text must be checked before release; fixed heights are avoided around paragraph content.
- English example sentences remain selectable/readable text, not images.

## Mock and planned-feature language

Use these labels consistently:

- `데모 콘텐츠`: fixed sample lesson or progress
- `선택형 데모`: scripted turn-taking interaction
- `예시 리포트`: fixed report information architecture
- `기능 미연결`: visible future control or promise without implementation
- `실제 GET /health`: the one current real client-server integration

Do not use `완료`, `저장됨`, `AI 분석 중`, `마이크 사용 중`, or a streak claim unless the corresponding behavior is real.

## Theme decision

Phase 2 is deliberately light-only. The previous application config followed the system theme while the actual screens used fixed light colors, which could create a half-themed interface. A real dark palette can be introduced as a complete design task later.

## Future voice-state contract

When voice work begins, the UI needs distinct states for:

```text
idle → permission request → ready → listening → submitted → processing
     → result | recognition uncertain | recoverable error | permission blocked
```

The transcript must be editable before a correction becomes learner memory. The app should never convert low-confidence recognition into high-confidence language feedback without explanation.
