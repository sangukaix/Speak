# Phase 3 authentication specification

Updated: 2026-09-01

Status: **UI/UX implementation checkpoint with social entry plus a locally tested backend JWT checkpoint. The dependency/client boundary, secure native session adapter, typed state, email flow, Google OAuth code path, native iOS Apple flow, web Apple OAuth path, PKCE callbacks, root guards, asymmetric JWKS verifier, and protected `/auth/me` smoke route are implemented. No Supabase/Google/Apple project, real account, live JWKS/session verification, or account deletion is connected yet.**

The development-only `/developer/auth-preview` route makes every account state navigable without sending an authentication request. With blank `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, action buttons stay disabled and the UI says that it is in review mode. The email plus social UI checkpoint passes TypeScript, Expo Doctor 21/21, Android/iOS/web export, dependency-tree inspection, desktop/390 px browser review, and an `access_denied` callback return-to-sign-in check. The backend verifier passes local ephemeral-key tests for valid, expired, wrong-signature, wrong-issuer, wrong-audience, malformed-claim, API-key, symmetric-algorithm, anonymous/role, JWKS-outage, and CORS cases. These are source/bundle/UI and isolated cryptographic checks, not live-provider or installed-device validation. Real email delivery/deep links, Google/Apple consent and callback behavior, live JWKS and authoritative session enforcement, deletion, and the production privacy gates remain unverified.

This document establishes the engineering and security behavior before a provider project is connected and now tracks the implementation against that baseline. It covers identity states, user-facing privacy language, route protection, failure recovery, and acceptance tests. It is not a production privacy policy or legal approval. On 2026-09-01, the project owner approved making the current app account-required; a future free demo will use a separate `/demo` flow and is not part of Phase 3.

## Scope

Phase 3 will add:

- email-and-password sign-up, email verification, sign-in, current-device sign-out, and password recovery;
- Google sign-in on Android, iOS, and web; native Apple sign-in on iOS; and Apple OAuth on web;
- deterministic session bootstrap and restoration on web, Android, and iOS;
- client-side route guards for all existing tabs and lesson routes;
- server-side JWT verification for every future protected FastAPI operation;
- an account-deletion path before public registration is enabled;
- explicit loading, offline, expired-link, rate-limit, and recoverable-error states.

Phase 3 will not add:

- phone, anonymous, magic-link-only, SSO, or MFA sign-in;
- persisted level, goals, interests, onboarding answers, or learner memory (Phase 4);
- AI, microphone, transcript, lesson history, report persistence, or payment;
- an anonymous Supabase identity. A public demo/free learning loop, if selected, must remain an explicit public route tree rather than masquerading as a signed-in learner;
- a second authorization role. Phase 3 has only signed-out and ordinary signed-in learners.

## Durable decisions

1. **Provider:** Use Supabase Auth for the Phase 3 implementation. Create the development project only when the project owner can own the provider account and select its region.
2. **MVP methods:** Keep verified email/password on every platform. Add Google on Android/iOS/web, native Sign in with Apple on iOS, and Apple OAuth on web. Android does not advertise Apple in this checkpoint.
3. **Social implementation:** Google uses Supabase PKCE OAuth through a secure browser session on native and a redirect on web. iOS Apple uses the system sheet, requests only email, hashes a new random nonce with SHA-256, and exchanges the identity token with Supabase. Web Apple uses PKCE OAuth. No Google or Apple client secret enters the Expo bundle.
4. **Identity linking:** Accept Supabase automatic linking only when the provider supplies the same verified email. Do not merge users from client-side email comparison. Apple private-relay or different-email identities can remain separate; manual linking is a later signed-in account-settings feature and must be tested before being offered.
5. **Password policy:** Accept 15–64 characters, allow spaces and Unicode, allow paste and password managers, do not silently truncate, and do not require arbitrary upper/lowercase/symbol composition. Reject known leaked passwords when the selected provider plan supports that control.
6. **Client/provider boundary:** The Expo client talks directly to Supabase Auth with a publishable key. Passwords and third-party ID tokens do not pass through FastAPI. The publishable key is intentionally exposable, but requests made with it can access whatever the `anon` or authenticated role is granted; every exposed table therefore needs least-privilege grants and RLS rather than trust in the key.
7. **Server boundary:** FastAPI verifies the learner JWT on every protected API request and owns privileged actions such as account deletion. A Supabase secret key is backend-only and must never use an `EXPO_PUBLIC_` name.
8. **Authorization:** Expo Router guards are a navigation and privacy boundary, not an authorization boundary. FastAPI authorization and future Postgres grants plus row-level security remain mandatory even if the client guard works.
9. **Callbacks:** Email verification, recovery, and browser-based social sign-in use an Auth client explicitly configured with `flowType: 'pkce'`. A callback may consume only matching locally stored flow context and an allowlisted internal destination, and must handle cancellation, expiry, duplicate use, and a flow started on a different device.
10. **Onboarding:** A verified Phase 3 learner goes to Home. `needsOnboarding` is reserved for Phase 4 and must not be inferred from the current demo profile.
11. **Sign-out:** The primary action is `이 기기에서 로그아웃`. It clears the current persisted session and protected navigation history. It does not claim that other devices were signed out or that the upstream Google/Apple account was logged out.
12. **Account deletion:** Public sign-up cannot ship without a tested deletion flow and exact retention disclosure. Email/password users re-enter the password directly to Supabase; social-only users repeat the same provider's interactive sign-in. FastAPI accepts only a newly issued authenticated JWT with a matching `password` or `oauth` entry in signed `amr` no older than five minutes, derives the target solely from `sub`, verifies `session_id`, and performs the privileged delete. If real-provider testing cannot prove that a fresh interactive social sign-in updates that signed timestamp, deletion must use an additional server-issued, single-use reauthentication ticket instead of weakening the check. No client-supplied user ID is accepted.

Owner access decision: all current tabs and lesson routes require `signedIn`. A future free experience must be implemented as a separate, explicitly public `/demo` route tree, must not claim saved progress, and needs its own route and acceptance review before release.

## Authentication state model

Keep global session state small. Form submission state belongs to each screen and must not create extra global modes.

| State | Meaning | Allowed navigation | Exit |
|---|---|---|---|
| `booting` | Local credentials are being restored and, when possible, refreshed | Splash/loading only; no auth or app screen flash | `signedOut`, `signedIn`, or `restoreError` |
| `restoreError` | Storage or network failure left a stored session unresolved | Bootstrap error with Retry and explicit local-session clear actions; privacy only | `booting` retry or confirmed clear to `signedOut` |
| `signedOut` | No usable learner session exists | Auth, privacy, and development diagnostics | Successful sign-in or verified callback |
| `awaitingVerification` | Sign-up request was accepted but no verified session exists | Verify-email, resend, edit email, sign-in, privacy | Valid confirmation callback or cancel |
| `recovering` | A valid password-recovery callback is active | Set-new-password and cancel only | Password update, expiry, or cancel |
| `signedIn` | A usable learner session exists | Existing tabs and lesson routes | Sign-out, deletion, or invalid/revoked session |
| `signingOut` | Current-device sign-out is in progress | Blocking progress state | `signedOut` or a retry action |

Rules:

- `booting` must never default to signed out while restoration is still unresolved.
- A transient network failure during refresh must not erase a potentially recoverable stored session. Show retry/offline state first.
- `restoreError` must distinguish Retry from `이 기기의 로그인 정보 지우기`; clearing is an explicit user action and never an automatic offline fallback.
- A confirmed invalid or revoked session clears local credentials and moves to `signedOut` with a neutral explanation.
- A background refresh may run while the app remains `signedIn`; it must not replace the entire UI with a spinner.
- `awaitingVerification` may retain only a masked email hint in UI memory. Do not persist the full form payload or password.
- Auth errors are operation state: `idle | submitting | succeeded | recoverableError`. Disable duplicate submission while `submitting`.

## Planned route contract

The current files did not need a broad `(app)` move. The implementation puts one guard boundary in the root layout and groups the existing screen registrations there.

| Route | Access | Behavior |
|---|---|---|
| `/` | Bootstrap | Resolve session; send signed-out users to sign-in and signed-in users to Home |
| `/auth/sign-in` | Signed out | Platform-appropriate Google/Apple plus email/password sign-in; signed-in visitors go Home |
| `/auth/sign-up` | Signed out | Account creation and privacy notice; signed-in visitors go Home |
| `/auth/verify` | Signed out / awaiting verification | Explain verification, resend with cooldown, change email, or return to sign-in |
| `/auth/recovery` | Signed out | Request a reset email without revealing whether an account exists |
| `/auth/reset` | Recovery session only | Set a new password; an ordinary signed-in session alone is insufficient |
| `/auth/callback` | Public callback | Validate PKCE result, reject unknown intent/destination, and replace navigation history |
| `/privacy` | Public | Current privacy notice and processor/retention details |
| `/(tabs)` | Signed in | Existing Home, Practice, Review, and Profile tabs |
| `/lesson/[lessonId]` | Signed in | Existing lesson preview |
| `/lesson/session` | Signed in | Existing scripted demo session |
| `/lesson/report` | Signed in | Existing example report |
| `/developer/health` | Development diagnostic | No learner session required in development; hide its link and route a direct production request to the neutral not-found/root surface |
| `GET /health` | Public API | Remains an availability check only |
| `GET /auth/me` | Learner bearer JWT | Verify the configured asymmetric signature and learner claims, then return only the signed `sub`; live JWKS/session behavior remains pending |

Root guard truth table:

| Surface | Predicate / transition rule |
|---|---|
| Bootstrap | While `booting`, do not render either the app or auth navigator; retain the launch surface. Show the dedicated recovery surface for `restoreError`. |
| Account-required app tree | `signedIn || signingOut`; keep it mounted under a blocking overlay during `signingOut`, return to `signedIn` on failure, and let the guard remove its history only after success. |
| Ordinary auth routes | `signedOut || awaitingVerification`; a signed-in visitor is replaced to Home. |
| Password reset | `recovering` only; a recovery code exchange must not be treated as an ordinary signed-in learner session. |
| Callback | Declare once as a public processing route. Match its exchanged result to locally stored PKCE flow context before choosing verification Home versus recovery Reset. Do not trust a URL `intent` by itself. |
| Privacy | Public in every resolved state. |
| Developer health | Development-build predicate only. Production navigation hides it and a direct request resolves to the neutral not-found/root surface. |

Additional root rules:

- Keep the splash/loading surface visible until `booting` resolves.
- Protect tabs and all three lesson routes together. Guarding only the tabs leaves direct lesson links open.
- Keep the developer diagnostic outside the learner guard so authentication failures do not block setup diagnosis. It must expose no credentials or user data.
- After sign-out or account deletion, replace history so Back cannot reveal a protected screen.
- A protected deep link may store one in-memory `next` destination. Accept only known internal paths, never a scheme, host, protocol-relative URL, or arbitrary query-provided URL.
- After successful sign-in, return to the valid `next` destination; otherwise use Home. Do not persist a stale lesson-session position across restart.
- An invalid lesson ID needs an explicit not-found/recovery state before authenticated deep-link restoration ships; it must not silently become a different lesson.
- Because web output is currently static, export every current fixed lesson ID with `generateStaticParams` before claiming arbitrary lesson deep-link restore. The web test must request the URL in a new tab and refresh it; browser-internal navigation alone is insufficient. A future non-fixed catalog needs a hosting/server strategy that serves dynamic routes.

### PKCE callback matrix

Do not guess or hand-code a native URI. Generate it from Expo Linking and the checked-in app scheme, verify that it parses to `/auth/callback`, and register that exact result in the Supabase redirect allowlist. Google OAuth uses this callback on Android/iOS/web, while Apple OAuth uses it on web. Native iOS Apple returns an ID token directly and does not travel through this route.

| Platform | Development callback | Production requirement |
|---|---|---|
| Web | Exact active local origin plus `/auth/callback`; no wildcard host | `https://<approved-domain>/auth/callback`, with hosting refresh/fallback behavior tested |
| Android | URI generated from the `speakai` app scheme in a native development build | Exact registered app/universal link and cold-start test on an installed build |
| iOS | URI generated from the `speakai` app scheme in a native development build | Exact registered app/universal link and cold-start test on an installed build |

Expo Go's `exp://` URL is not evidence that the `speakai` callback works. Android/iOS callback acceptance requires a development or production build containing the scheme. Successful PKCE URLs carry a short-lived single-use `code`; an access or refresh token in a URL fragment fails the test.

## Session and credential handling

### Client

- Use only `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the client. The current legacy `anon`/`service_role` template names must be replaced during implementation rather than copied forward.
- Initialize the client with `flowType: 'pkce'`, session persistence, the platform storage adapter, and explicit URL handling. Exchange only a query `code` whose locally stored flow context matches verification, recovery, or social intent.
- Never log email form contents, passwords, OAuth/Apple ID tokens, provider tokens, nonces, PKCE verifiers, confirmation codes, access tokens, refresh tokens, session objects, or authorization headers.
- Native long-lived session credentials must use a provider-compatible storage adapter backed by platform-protected storage. They must not fall back silently to plaintext AsyncStorage. Verify payload-size, device-backup, reinstall, lock-state, and error behavior before selecting the final adapter.
- Web session persistence may use the Supabase client storage contract for the current static client, but public deployment requires an XSS/CSP review because JavaScript-readable storage is not equivalent to an HttpOnly server cookie.
- Start token refresh while the native app is active and stop it in the background. Register the app-state listener once.
- Do not treat a decoded JWT as verified. The client uses it for display hints only; the server verifies protected requests.

### FastAPI and database

- Require `Authorization: Bearer <learner-access-token>` on every protected endpoint.
- Verify signature, issuer, audience, expiry, and expected project using the provider JWKS or the provider-supported verification path. Cache signing keys with bounded refresh and handle rotation.
- Return `401` for missing, expired, malformed, or invalid credentials. Return `403` for an authenticated learner who lacks permission. Do not redirect API responses to an HTML sign-in page.
- Never accept a publishable or secret API key as a learner bearer token.
- If Phase 3 creates no application table, leave the database surface empty. When Phase 4 adds profiles, enable RLS and least-privilege grants before exposing the table, and scope rows to the verified user ID.
- Never authorize from mutable user metadata. Privileged roles, if added later, belong in server-controlled metadata and still require server checks.
- For account deletion, verify the signed JWT and require `role=authenticated`, `is_anonymous=false`, an approved `password` or `oauth` entry in `amr` no older than five minutes, and an active `session_id`. Confirm the fresh method is compatible with an identity actually linked to the user. Take the deletion target only from `sub`; the request body cannot choose an email or user ID. The client never receives the server secret.
- Deleting the Auth user removes its sessions and refresh capability, but an already issued stateless JWT can remain cryptographically valid until `exp`. Phase 3 FastAPI authorization checks session existence so a pre-delete token is rejected immediately there. No future direct database surface may ship until its equivalent deletion/revocation window is explicitly bounded or closed.

## User-facing Korean copy baseline

Copy may be polished with learners, but its meaning and honesty must remain.

### Sign in

- Title: `다시 이어서 연습해요`
- Body: `간편 로그인이나 이메일로 학습을 이어갈 수 있습니다.`
- Social actions by platform: iOS `Apple로 계속하기`, `Google로 계속하기`; Android `Google로 계속하기`; web both
- Social notice: `처음 이용하는 계정은 간편 로그인 과정에서 Speak AI 계정이 만들어질 수 있습니다.`
- Email divider: `또는 이메일로`
- Primary action: `로그인`
- Recovery link: `비밀번호를 잊었나요?`
- Sign-up link: `처음이신가요? 계정 만들기`
- Invalid credential error: `이메일 또는 비밀번호를 확인해 주세요.`
- Offline error: `인터넷 연결을 확인한 뒤 다시 시도해 주세요.`
- Expired session notice: `로그인 시간이 끝났어요. 다시 로그인해 주세요.`

Do not say whether an email exists, is disabled, or has the wrong password.

### Sign up

- Title: `내 학습을 이어갈 계정 만들기`
- Body during the current development phase: `계정을 만들어도 학습 기록 저장, AI, 음성 기능은 아직 연결되지 않습니다.`
- Password hint: `15자 이상으로 입력해 주세요. 문장처럼 길게 만들어도 좋아요.`
- Privacy acknowledgement: `개인정보 수집·이용 안내를 확인했습니다.`
- Primary action: `계정 만들기`
- Accepted response: `입력한 이메일로 계정 확인 안내를 보냈습니다.`

Do not claim that profile, lesson progress, or reports are saved until those behaviors exist.

### Verification

- Title: `이메일을 확인해 주세요`
- Body: `입력한 이메일로 확인 안내를 보냈습니다. 메일이 오지 않으면 주소와 스팸함을 확인해 주세요.`
- Actions: `확인 메일 다시 보내기`, `이메일 주소 바꾸기`, `로그인으로 돌아가기`
- Cooldown: `잠시 후 다시 요청할 수 있어요.`
- Invalid link: `확인 링크가 만료되었거나 이미 사용되었습니다. 새 링크를 요청해 주세요.`

### Recovery

- Title: `비밀번호 재설정`
- Request explanation: `입력한 주소의 계정이 있으면 비밀번호 재설정 안내를 보냅니다.`
- Request result: `계정이 있는 주소라면 재설정 안내가 전송됩니다.`
- Reset title: `새 비밀번호 설정`
- Success: `비밀번호를 바꿨습니다. 새 비밀번호로 로그인해 주세요.`
- Invalid link: `재설정 링크가 만료되었거나 이미 사용되었습니다. 새 링크를 요청해 주세요.`

### Sign-out and deletion

- Sign-out action: `이 기기에서 로그아웃`
- Sign-out result: `이 기기에서 로그아웃했습니다.`
- Delete title: `계정 삭제`
- Delete warning: `계정을 삭제하면 연결한 이메일이나 간편 로그인으로 이 계정에 다시 들어올 수 없습니다. 일부 보안·법적 기록은 안내된 기간 동안 보관될 수 있으며, 삭제 요청은 되돌릴 수 없습니다.`
- Delete confirmation: `계정을 영구 삭제`

Do not say `모든 데이터가 즉시 삭제됩니다` until provider logs, backups, statutory retention, and future learner tables have exact verified deletion behavior.

## Privacy notice requirements

The sign-up summary must link to a public full notice. Before public registration, the notice must identify the actual operator and contact, legal basis, processors, hosting region, overseas transfer details when applicable, and exact retention periods. The current copy is a product requirement, not legal advice.

| Data | Phase 3 purpose | Processing boundary | Retention baseline |
|---|---|---|---|
| Email address | Identity, verification, sign-in, recovery, essential account notices | Supabase Auth and configured email delivery provider | While account is active; exact deletion/log/backup periods required before launch |
| Password | Authenticate the learner | Sent over TLS directly to Auth provider; Speak AI client and FastAPI never store or log plaintext | Provider stores only its password verifier/hash under its policy |
| Social identity and limited provider metadata | Authenticate with Google/Apple; link the provider identity to the Auth user | Google or Apple to Supabase Auth; may include provider ID, verified/relay email, and provider-supplied display metadata even though the app does not currently use a name or avatar | While the identity/account is active; exact provider and deletion behavior required before launch |
| OAuth/Apple identity token and nonce | Complete a social sign-in and prevent replay | Provider, device browser/native Apple sheet, and Supabase Auth; never FastAPI or application logs | Short-lived exchange material; provider/session retention must be verified before launch |
| Auth user ID | Stable ownership key | Provider-managed `auth` schema; future profile references it | While account is active, then deletion rules apply |
| Access/refresh session credentials | Restore and authorize a session | Provider plus protected local device/browser storage | Until rotation, expiry, sign-out, or account deletion according to session scope |
| Verification/recovery events, IP and delivery logs | Security, abuse prevention, and email delivery | Provider and email processor | Exact provider and operator retention must be published before launch |

Not collected or persisted in Phase 3:

- any additional app-requested name/profile fields, phone number, workplace, age, precise location, contacts, cloud-drive content, or advertising identifier; a social provider may still supply limited identity metadata described above;
- voice, audio, transcript, pronunciation result, lesson answer, report, learning history, goals, interests, or learner memory;
- payment data or marketing consent.

Public-launch blockers:

- approve the final privacy policy and decide the lawful basis/consent presentation with qualified review;
- choose the Supabase region and document the processor, subprocessors, international transfer, and deletion/backup behavior;
- decide the minimum-age policy and any guardian flow before allowing minors to register;
- configure a production email provider, sender identity, exact retention, and support/privacy contact;
- publish Google/Apple processing disclosures, verify consent-screen and branding requirements, and schedule Apple OAuth client-secret rotation when web Apple login is enabled;
- separate required account processing from optional marketing; Phase 3 has no marketing checkbox;
- verify account deletion end to end, including auth identity, provider sessions, logs/retention disclosure, and every application table that exists at launch.

## Failure and recovery contract

| Condition | User-visible behavior | State/data behavior |
|---|---|---|
| Invalid email format | Explain format beside field before submit | Keep email editable; never send password |
| Wrong email/password or unknown account | One generic credential error | Remain signed out; do not reveal account existence |
| Duplicate sign-up email | Same neutral accepted/verification response | Do not reveal account existence |
| Offline before request | Connection message and retry | Preserve typed email locally in the form only; clear password on leaving |
| Provider unavailable/5xx | `잠시 후 다시 시도해 주세요.` | Keep current auth state; do not clear a valid stored session |
| Social sign-in cancelled | Return quietly to sign-in without an error claim | Clear transient local social-flow context; do not create a partial session |
| Same verified email across methods | Continue into the Supabase-linked user after provider validation | Never merge from a client-side email comparison; test email-first and OAuth-first orders |
| Apple private relay/different email | Explain account separation only where needed in account settings/support | Do not guess that it belongs to another identity or auto-merge it in the client |
| Rate limited | Explain temporary wait and disable resend until allowed | Do not loop or auto-retry aggressively |
| Verification/recovery cancelled | Return to the initiating auth screen | No partial signed-in state |
| Link expired/used/wrong device | Explain and offer a new request | Clear callback parameters and PKCE transient state safely |
| Session refresh temporarily fails offline | Offline/retry surface | Keep stored session pending; do not claim logout |
| Session is verified invalid/revoked | Neutral expired-session message | Clear local auth and protected caches, then replace to sign-in |
| Protected API returns 401 | Revalidate once, then sign out if invalid | Never retry indefinitely |
| Protected API returns 403 | Permission message | Keep valid session; do not mislabel as expired |
| Sign-out request fails | Retry or explicitly clear only this device | Never claim other devices were signed out |
| Account deletion needs fresh proof | Ask for current password or repeat the same social provider interactively | Accept only a signed JWT with a matching password/OAuth `amr` timestamp within five minutes, or a stricter one-use server ticket if provider testing requires it; never send password, ID token, or user ID to FastAPI |
| Account deletion partially fails | Keep account screen with support/retry state | Never show success until server confirms the terminal result |

## Acceptance tests

The implementation is incomplete until these behaviors are automated where practical and manually verified on the named platforms.

### Bootstrap and route guards

1. A cold launch never flashes Home or sign-in before session restoration resolves.
2. A fresh signed-out launch lands on sign-in.
3. A valid stored session restores to Home after restart.
4. A signed-out direct link to `/lesson/share-an-idea` goes to sign-in and returns to that lesson after success. On static web, requesting it in a new tab and refreshing it must both work through exported static params or the selected hosting fallback.
5. An external, malformed, or non-allowlisted `next` value is ignored and success goes Home.
6. A signed-in learner opening sign-in or sign-up is replaced to Home.
7. Tabs and every lesson route are inaccessible when signed out; guarding only tabs fails the test.
8. Sign-out clears the current stored session and protected navigation history; Back cannot reveal protected UI.
9. An invalid or revoked session moves to signed out, while a transient offline refresh does not erase it.
10. `/developer/health` works without learner auth in a development build; its production link is absent and a direct production URL reaches only the neutral not-found/root surface.

### Sign-up and verification

11. Sign-up validates email and accepts 15–64-character passphrases, Unicode, spaces, paste, and password managers.
12. A second submit is blocked while the first is pending.
13. Existing and new email paths do not provide an account-enumeration oracle in copy or response handling.
14. No ordinary learner session is accepted before required email confirmation.
15. Resend has visible cooldown, rate-limit handling, and no request loop.
16. A valid PKCE callback succeeds only with the matching locally stored flow context and uses history replacement; the client is explicitly configured with `flowType: 'pkce'`.
17. Expired, duplicate, cancelled, malformed, and wrong-device callbacks each provide a safe recovery action.

### Sign-in, recovery, and sign-out

18. Valid credentials create one usable session and route to the allowlisted destination.
19. Invalid credentials use the generic error and do not log the email or provider payload.
20. Offline, timeout, rate-limit, and provider-failure states are distinguishable and retryable.
21. Recovery request always uses neutral result copy whether or not the account exists.
22. `/auth/reset` requires a valid recovery intent; an ordinary signed-in session cannot enter it directly.
23. New-password policy matches sign-up, and expired/used recovery links cannot update credentials.
24. Current-device sign-out does not claim to terminate other devices.

### Social sign-in and identity linking

25. Google creates/restores one Supabase session through PKCE on web, Android, and iOS and returns to an allowlisted destination.
26. iOS shows Apple's official native button, requests only email, sends a different random SHA-256 nonce per attempt, handles cancel without an error banner, and never logs the raw nonce or identity token.
27. Web Apple completes through PKCE OAuth; Android does not display an Apple action in this checkpoint.
28. Cancelling or denying a social prompt creates no partial session and leaves the learner safely signed out.
29. Email-first, Google-first, and Apple-first orders are tested. The same verified email follows Supabase's automatic identity-linking behavior; a private-relay/different email is never merged by client guesswork.
30. A disabled provider, callback mismatch, offline browser, repeated callback, and malformed result each produce a recoverable state without exposing provider payloads.
31. Account deletion requires a fresh interactive password or linked-provider sign-in whose signed matching `amr` timestamp is at most five minutes old (or the documented stricter one-use ticket fallback); the server ignores/rejects any client user ID, deletes only JWT `sub`, clears local state, and cannot be undone through Back.

### Security and authorization

32. Frontend bundles contain only the Supabase URL and publishable key; no secret key, password, token, callback code, nonce, or private provider value appears in source, logs, errors, or analytics.
33. Missing, malformed, expired, wrong-issuer, wrong-audience, and wrong-signature bearer tokens receive `401` from protected FastAPI endpoints.
34. An authenticated learner requesting another learner's future row receives no data and a denied result through grants/RLS even if client navigation is bypassed.
35. A publishable or secret API key supplied as a learner bearer token is rejected.
36. Callback and `next` handling cannot create an open redirect or replay a consumed code.
37. After deletion, a token issued before deletion is rejected immediately by protected FastAPI session validation even if its `exp` has not passed.

### Cross-platform and accessibility

38. Web refresh, Android cold deep link, and iOS cold deep link complete verification, recovery, and browser social OAuth without exposing callback credentials in UI or logs; URLs contain a query code, never access/refresh tokens in a fragment.
39. Native callback tests use an installed development/production build with its registered `speakai` scheme, not Expo Go, and the generated URI parses to `/auth/callback`.
40. Native iOS Apple sign-in is tested on a real signed-in Apple device; simulator-only success is insufficient for the release claim.
41. Keyboard navigation, screen-reader labels, logical focus, autofill semantics, and password-manager paste work on auth forms.
42. Every control has a 44 × 44 px minimum target; disabled/loading/error states do not rely only on color.
43. Submission and status changes are announced, focus moves to the first actionable error, and dynamic text does not clip at supported sizes.
44. Hardware/software Back cannot re-enter a completed callback, reset form, deleted account, or signed-out protected screen.
45. Browser CORS preflight and `DELETE /account` work only for configured web origins after `DELETE` is added to the backend method allowlist; an unconfigured origin is denied.

## Remaining implementation order

1. Preserve the now-implemented unconfigured UI/client boundary and the owner-approved Android/iOS identifier `com.sangukaix.speakai` when creating store/provider registrations.
2. Create an owner-controlled Supabase development project and record its region/configuration without copying credentials into docs or prompts.
3. Create owner-controlled Google and Apple provider registrations, configure their consent/branding, place secrets only in Supabase/provider consoles, and register exact Supabase plus app/web callbacks. Record the six-month Apple OAuth secret rotation owner when web Apple login is enabled.
4. Configure email confirmation, password controls, rate limits, exact development redirect allowlist, and test email delivery.
5. Put only the Supabase URL and publishable key in ignored `frontend/.env`; test email, Google, and web Apple on web and Google on an installed Android development build.
6. Test native Apple and Google on an installed iOS build, including cancellation, private relay, callback cold start, and same-email linking; do not claim iOS completion from Windows export.
7. Connect the implemented FastAPI asymmetric JWT verifier and `/auth/me` smoke route to the real project, then add authoritative active-session verification and `DELETE /account` with tests, including DELETE CORS preflight and provider-appropriate fresh reauthentication; do not add application tables yet.
8. Complete the production privacy, domain/universal-link, SMTP, retention, age-policy, abuse-control, and provider-review gates before public registration.

## Completion definition

Phase 3 is complete only after email sign-up/verification/recovery, Google on Android/iOS/web, Apple on iOS/web, restoration, identity-linking cases, guarded navigation, current-device sign-out, and provider-appropriate deletion pass their automated and installed-platform checks; FastAPI rejects invalid and deleted-session tokens; no privileged value reaches the client; the owner has reviewed the navigable UI/UX flow; the privacy notice names actual processors and retention; and all related documentation matches the implementation.

## Primary references

- [Expo Router authentication and protected routes](https://docs.expo.dev/router/advanced/authentication/)
- [Expo Router protected routes](https://docs.expo.dev/router/advanced/protected/)
- [Expo Router static rendering](https://docs.expo.dev/router/web/static-rendering/)
- [Expo linking into an app](https://docs.expo.dev/linking/into-your-app/)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Expo WebBrowser](https://docs.expo.dev/versions/latest/sdk/webbrowser/)
- [Expo AppleAuthentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Supabase React Native Auth quickstart](https://supabase.com/docs/guides/auth/quickstarts/react-native)
- [Supabase Expo social Auth quickstart](https://supabase.com/docs/guides/auth/quickstarts/with-expo-react-native-social-auth)
- [Supabase Google login](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase Apple login](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [Supabase identity linking](https://supabase.com/docs/guides/auth/auth-identity-linking)
- [Supabase password-based Auth](https://supabase.com/docs/guides/auth/passwords)
- [Supabase password security](https://supabase.com/docs/guides/auth/password-security)
- [Supabase PKCE flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow)
- [Supabase sessions](https://supabase.com/docs/guides/auth/sessions)
- [Supabase user management and deletion](https://supabase.com/docs/guides/auth/managing-user-data)
- [Supabase JWT claims](https://supabase.com/docs/guides/auth/jwt-fields)
- [Supabase API key boundaries](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Apple App Review Guidelines, section 4.8](https://developer.apple.com/app-store/review/guidelines/)
- [개인정보보호위원회 개인정보 처리방침 작성지침 (2026.4.)](https://www.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=D010030000.Updated&nttId=12018)
