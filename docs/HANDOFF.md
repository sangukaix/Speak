# 다른 컴퓨터·새 Codex 인수인계

Updated: 2026-08-29

이 문서는 기존 대화 기록이 없는 새 Windows PC와 새 Codex 작업에서 Speak AI 개발을 정확히 이어가기 위한 현재 상태 기록이다. 제품의 장기 기준은 다른 문서에 나누어 보관하고, 이 문서는 **현재 어디까지 왔는지, 무엇을 다음에 해야 하는지, 무엇이 Git으로 이동하지 않는지**를 한곳에 모은다.

## 가장 먼저 알아야 할 것

- 저장소: `https://github.com/sangukaix/Speak.git`
- 현재 이어서 작업할 브랜치: `codex/phase-2-ui-foundation`
- `main`은 아직 Phase 1 상태이므로 현재 작업의 기준이 아니다.
- 현재 완료 범위: Phase 0, Phase 1, Phase 2
- 현재 구현된 실제 서버 연동: FastAPI `GET /health` 하나
- 현재 화면의 lesson, progress, profile, session, review, report 데이터는 모두 명시적으로 표시된 고정 Demo/Mock이다.
- 인증, Supabase, OpenAI, 음성, 저장, 결제, Agent, Avatar는 아직 연결하지 않았다.
- 이전 Codex 대화 기록, 로그인 세션, 로컬 설정은 Git에 포함되지 않는다. 이 문서와 `AGENTS.md`가 새 세션의 지속 가능한 기억이다.

새 PC에서는 다음처럼 브랜치를 지정해 복제한다.

```powershell
git clone --branch codex/phase-2-ui-foundation https://github.com/sangukaix/Speak.git
Set-Location Speak
git pull --ff-only
git status -sb
```

`git status -sb`의 첫 줄이 `codex/phase-2-ui-foundation`을 가리키는지 확인한다. 자세한 최초 설치는 [SETUP](SETUP.md)을 따른다.

## 문서 읽기 순서와 기준

새 Codex는 `AGENTS.md`에 적힌 순서를 그대로 따른다. 사람이 빠르게 상태를 확인할 때는 다음 순서가 가장 효율적이다.

1. [HANDOFF](HANDOFF.md): 현재 브랜치, 진행 상태, 다음 작업, PC 이전 정보
2. [PRODUCT_BRIEF](PRODUCT_BRIEF.md): 사용자, 문제, 제품 약속, 범위
3. [COMPETITOR_RESEARCH](COMPETITOR_RESEARCH.md): Speak·Fluently 조사와 한계
4. [UX_FOUNDATION](UX_FOUNDATION.md): 화면 구조, 디자인 원칙, 접근성, Mock 표기
5. [ARCHITECTURE](ARCHITECTURE.md): 현재 구조와 미래 경계
6. [DECISIONS](DECISIONS.md): 이미 확정된 기술·제품 결정
7. [PLAN](PLAN.md), [ROADMAP](ROADMAP.md): phase 의존관계와 MVP/Beta/Production 순서
8. [TODO](TODO.md): 검증된 완료 상태와 다음 할 일
9. [SETUP](SETUP.md), [DEVELOPMENT](DEVELOPMENT.md), [TROUBLESHOOTING](TROUBLESHOOTING.md): 실행과 운영

문서끼리 충돌하면 실제 소스와 잠금 파일을 확인하고 문서를 함께 고친다. 비밀정보에 대해서는 항상 가장 보수적인 규칙을 따른다.

## 우리가 만들고 있는 제품

Speak AI는 영어를 이해하지만 실제 상황에서 바로 말하기 어려운 한국인 성인을 위한 모바일 우선 AI 영어회화 코치다. 첫 고가치 진입점은 직장 영어이며, 일상·여행은 그다음 확장 경로다. `Speak AI`는 작업명일 뿐이므로 공개 출시 전 이름과 상표 검토가 필요하다.

핵심 제품 루프는 다음과 같다.

```text
상황과 목표 안내
→ 학습자가 직접 말하기
→ 원문 근거가 있는 피드백
→ 가장 중요한 한 가지 takeaway
→ 짧게 다시 말하기
→ 다음 연습 추천
```

차별점은 AI 채팅창 자체가 아니다. Guided practice, 근거가 보이는 교정, 불확실성 표시, 사용자가 수정·삭제할 수 있는 학습 기억, 다음 연습이 하나의 흐름으로 이어지는 것이 핵심이다.

Frontend design은 사용자가 완성된 시안을 먼저 전달해야만 진행되는 방식이 아니다. 사용자와 Codex가 함께 설계하고 검토하며, 현재 Phase 2 UI는 첫 번째 product hypothesis다. 사용자 반응이나 더 좋은 근거가 나오면 제품 원칙을 보존하는 범위에서 copy, information architecture, visual direction을 수정할 수 있다.

유지해야 할 제품 원칙:

- 큰 카탈로그보다 지금 할 한 가지 행동을 먼저 보여 준다.
- 초반에는 자유 대화보다 목표·상황·쓸 표현을 먼저 안내한다.
- 실시간 대화 흐름을 과도한 교정으로 끊지 않는다.
- 점수보다 발화 원문, 수정안, 이유, 근거와 확신 정도를 먼저 보여 준다.
- 한 리포트에는 최대 세 가지 교정과 한 가지 핵심 takeaway를 우선한다.
- 학습 노력 지표와 영어 능력 지표를 혼동하지 않는다.
- 대기, 녹음, 제출, 처리, 인식 불확실, 실패 상태를 숨기지 않는다.
- 사용자가 기억된 정보의 이유를 보고 수정하거나 삭제할 수 있어야 한다.
- 결제 전에 말하기부터 교정·설명·재시도까지 한 번의 완전한 가치 루프를 경험하게 한다.
- Avatar는 음성·Transcript·Feedback 품질이 신뢰할 수 있게 된 이후에 검토한다.

## 현재 구현된 것

### Frontend

- Expo SDK 57, React Native 0.86.3, React 19.2.3, TypeScript 6, Expo Router 기반 단일 코드베이스
- Web, Android, iOS 코드 경로
- Home, Practice, Review, Profile 네 개 탭
- Lesson preview → 선택형 scripted session → example report → Review/Home 흐름
- Workplace, everyday, travel의 고정 sample lesson 세 개
- Expression, grammar, pronunciation의 고정 sample review 세 개
- 44px 이상 터치 영역, semantic icon, 760px 최대 폭의 반응형 light-only UI
- `calm momentum` 시각 방향: deep green, warm off-white, coral accent
- 실제 `GET /health`를 확인하는 developer screen

### Backend

- FastAPI 애플리케이션 구조
- 환경변수 기반 explicit CORS allowlist
- `GET /health`와 자동화된 backend test 두 개
- 향후 server-owned OpenAI/Supabase 통합을 위한 경계 문서

### 조사와 기획

- Speak, Fluently 및 인접 제품의 공개 자료 조사
- 저장소 소유자가 직접 로그인한 한 번의 Fluently Android 관찰
- Fluently의 onboarding, 최초 assessment, 초기 result hierarchy, tutor controls, personalization/settings 구조, plan handoff에 대한 익명화된 기록
- 제품 brief, UX 규칙, architecture, roadmap, database/AI 계획, decisions 문서

경쟁 서비스의 코드, 브랜드, 화면, 카피를 복사하지 않는다. 관찰은 제품 원칙과 실패 가능성을 찾기 위한 자료다.

## 현재 Mock인 것

다음은 실제 사용자 데이터나 실제 AI 결과가 아니다.

- lesson 목록과 추천
- progress와 주간 방향; streak는 생성되거나 저장되지 않음
- profile 값과 personalization
- tutor 발화와 사용자의 선택지
- session 진행과 완료 상태
- review note와 report
- pronunciation 연습 문구

선택지를 누르면 component memory만 바뀐다. 수업을 끝내도 history, progress, score, learner record, saved report, personalization이 생성되지 않는다. 마이크 영역은 의도적으로 비활성화되어 있고 듣는 척하지 않는다.

## 아직 구현하지 않은 것

- 회원가입, 로그인, 로그아웃, 계정 복구, route guard
- Supabase project, schema, migration, database persistence
- OpenAI text 또는 Realtime 호출
- microphone, recording, ASR, WebRTC, live transcript, pronunciation scoring
- 실제 lesson session/report/history/memory/planner
- subscription, payment, entitlement
- notification, admin, analytics
- specialist agents, tutor avatar

영구 OpenAI key나 Supabase service-role key는 앞으로도 client bundle에 들어가면 안 된다. Realtime 구현 시 FastAPI가 ephemeral credential을 발급하는 구조를 사용한다.

## 현재 검증 기준과 한계

2026-08-29 인수인계 작업에서 다음을 다시 실행했다.

- Backend: `2 passed`
- Frontend: `npm run typecheck` 통과
- Expo: `npx expo export --platform all`로 iOS, Android, Web bundle 생성 통과

주의할 한계:

- 현재 backend test는 기존 ignored `.venv`의 Python 3.12.13에서 통과했다. Repository target인 Python 3.13 검증은 새 PC에서 venv를 다시 만든 뒤 수행해야 한다.
- GitHub Actions나 다른 CI configuration은 아직 없다.
- Frontend unit test와 E2E test suite는 아직 없다.
- Expo export는 bundle 생성 검사이며 실제 Android/iOS device의 시각·상호작용 검증이 아니다.
- 새 PC에서는 dependency 설치 후 같은 검사를 다시 실행하고, 실행하지 않은 검증을 통과했다고 기록하지 않는다.

## 이 인수인계 직전의 제품 조사와 한계

이번 인수인계 문서 작업 직전의 제품 작업은 authenticated Fluently assessment와 초기 결과 흐름을 익명화하여 [COMPETITOR_RESEARCH](COMPETITOR_RESEARCH.md)에 기록한 것이다. 해당 문서의 `Authenticated session work log`에는 emulator 준비, transient blank/keyboard 문제, owner 로그인과 verification, onboarding, microphone 복구, assessment 완료, result 확인, DNS/sign-out 종료, 임시 자료 미보관까지 실제 작업 순서가 들어 있다. 관찰한 핵심은 다음과 같다.

- assessment 전 목적, 예상 시간, 사용자 통제권, 필요한 말하기 분량을 설명했다.
- call UI는 관찰된 범위에서 tap-to-start/tap-to-stop 방식이었다.
- 결과는 overall estimate와 pronunciation, vocabulary, grammar, fluency, coherence로 나뉘었다.
- 한 번의 짧은 sample이라는 불확실성을 결과 화면에서 표시했다.
- category별로 발화·수정·speech metric·insufficient-data 같은 근거 구조를 제공했다.
- 결과를 strengths와 improvement areas로 재구성하고 personal plan과 Home의 next action으로 연결했다.

검증하지 못한 것:

- ordinary AI call 품질과 transcript 편집
- score/CEFR calibration과 진단 정확도
- post-assessment Progress의 정상 완료 화면
- 장기 progress, adaptive planning, correction retry
- payment, subscription, notification, account deletion

관찰 도중 Android emulator의 DNS가 끊겼고 sign-out 경로로 들어가 조사를 중단했다. 이는 경쟁 서비스의 정상 동작이나 이 저장소의 오류를 증명하지 않는다. 개인 결과 수치, 발화, screenshot, 계정 정보는 저장하지 않았다.

이 Fluently 조사는 현재 기획 범위에서 완료된 작업이다. Speak AI 개발을 이어가기 위해 새 PC에서 emulator나 Fluently 로그인을 즉시 다시 만들 필요는 없다. 이후의 구체적인 제품 질문에 최신 직접 근거가 필요할 때만 owner가 다시 로그인해 추가 조사한다.

## 정확한 재개 지점

Phase 2 기준선을 유지하면서 다음 순서로 진행한다.

1. 사용자가 참여할 수 있을 때 작업명, 한국어 카피, `calm momentum` 시각 방향, workplace-English launch wedge를 실제 대상 학습자에게 검토한다. 이는 개발을 멈추게 하는 선행 조건이 아니라 병렬 validation track이다.
2. 새 Codex가 즉시 수행할 다음 작업은 Supabase를 설치하기 전의 Phase 3 인증 명세다.
3. 인증 명세에는 auth method/provider 선택, signed-out, sign-in, sign-up, 선택된 방법의 verification, recovery, loading, cancellation, error, logout, route guard, privacy copy, acceptance test가 포함되어야 한다.
4. 결제 전에 제공할 한 번의 완전한 free learning loop를 결정한다.
5. Phase 3 결정과 acceptance criteria가 확정된 뒤 가장 작은 authentication boundary를 구현한다. Persisted profile은 Phase 3 통과 후 Phase 4에서 다룬다.

새 Codex가 바로 코드를 추가하기보다 먼저 할 권장 작업은 **Phase 3 authentication specification**이다. 실제 Supabase 연결, OpenAI, 음성, 결제는 이 설계가 끝나기 전에 미리 만들지 않는다.

열린 제품 결정:

- 최종 서비스 이름과 상표 검토
- 사용자 인터뷰 후에도 직장 영어를 첫 wedge로 유지할지
- 최종 한국어 카피와 visual direction
- 실제 대화 중 교정 빈도
- 사용자가 이해하기 쉬운 confidence 표현
- paywall 전 minimum free value loop
- 도움이 되는 memory와 불쾌하거나 과도한 memory의 경계
- retention, deletion, transcript correction 정책
- dark mode의 별도 palette와 platform QA 시점

## Git으로 이동하는 것과 이동하지 않는 것

| Git으로 이동함 | 새 PC에서 다시 만들거나 로그인해야 함 |
|---|---|
| Source code와 tests | `.env`, `frontend/.env` |
| 모든 tracked Markdown 문서 | `.venv`, Python cache |
| `.env.example` templates | `frontend/node_modules`, Expo cache/build output |
| `.nvmrc`, `.python-version` | VS Code extensions와 `.vscode` local settings |
| `package.json`, `package-lock.json` | Git user 설정, credentials, browser session |
| Python requirements files | Codex 대화 기록과 local auth/session |
| PowerShell setup/run scripts | Android Studio, SDK, AVD, Google Play app/session |
| Expo/FastAPI source configuration | Fluently app와 로그인/MFA 상태 |
| Repository `AGENTS.md` instructions | Codex plugins, skills, MCP/app connections and their authorization state |

`node_modules`, `.venv`, caches, build output은 복사하지 않는다. 새 PC에서 lock/requirements로 재생성한다. Android keystore나 인증서가 미래에 생기면 Git이 아니라 별도 encrypted secret storage로 이동한다.

## 계정과 비밀정보 인수인계

Handoff와 source 문서에는 로그인용 개인 이메일, 비밀번호, OTP, API key, access/refresh token, cookie, 개인 assessment 값을 새로 기록하지 않는다. 새 Codex prompt에도 넣지 않는다. Git remote와 commit author metadata는 별도이므로 GitHub의 no-reply email/privacy 설정을 사용자가 관리한다.

| 계정/접근 | 현재 필요한가 | 새 PC에서 할 일 |
|---|---|---|
| GitHub | Clone은 저장소 공개 상태에 따라 가능, push에는 인증 필요 | 저장소에 접근 가능한 본인 계정으로 Git Credential Manager 또는 GitHub CLI에 로그인 |
| ChatGPT/Codex | 개발을 Codex로 이어갈 때 필요 | ChatGPT desktop app 또는 Codex IDE extension에서 본인이 browser login 완료 |
| Fluently | 제품 기능 구현에는 불필요, 추가 경쟁 조사를 할 때만 필요 | 기존 owner-controlled 계정으로 본인이 로그인하고 이메일 MFA가 나오면 직접 완료 |
| Google Play | Android emulator에서 Fluently를 다시 설치할 때만 필요 | 본인이 emulator Play Store에 로그인; session은 이전되지 않음 |
| OpenAI API | Phase 2와 다음 인증 명세에는 불필요 | key를 만들거나 입력하지 않음 |
| Supabase | Phase 2와 인증 명세에는 불필요 | project/key를 아직 만들거나 입력하지 않음 |
| Expo/EAS, Apple Developer, Google Play Console | 현재 필요하거나 구성되지 않음 | distribution phase 전에는 계정·project·certificate를 만들지 않음 |
| Payment/hosting providers | 현재 필요하거나 구성되지 않음 | payment/deployment phase 전에는 연결하지 않음 |

비밀번호는 password manager로만 옮기고 로그인 화면에 사용자가 직접 입력한다. Codex의 `auth.json`, 브라우저 cookie, emulator data directory를 다른 PC로 복사하지 않는다.

## 현재 PC의 관련 도구 스냅샷

이 표는 2026-08-29 현재 기존 Windows PC에서 확인한 상태다. 새 PC가 똑같은 절대경로나 도구 버전을 가져야 한다는 뜻이 아니라, 무엇을 재설치해야 하는지 판단하기 위한 기록이다.

| 항목 | 기존 PC 상태 | 새 PC 기준 |
|---|---|---|
| Git | 2.54.0.windows.1 | Git for Windows 설치 후 `git --version` 확인 |
| Node.js | 24.18.0 | `.nvmrc`와 같은 Node 24.18.0 권장 |
| npm | 11.16.0 | npm 11+ 확인 |
| Python Launcher | Python 3.13을 찾지 못함 | Python 3.13과 Launcher를 새로 설치 |
| Local `.venv` | Codex bundled Python 3.12.13으로 생성됨 | 절대 복사하지 말고 Python 3.13으로 재생성 |
| PowerShell | Codex bundled PowerShell 7.6.4; system Windows PowerShell도 존재 | Windows PowerShell 또는 PowerShell 7 사용 가능 |
| VS Code | `code` wrapper는 보이지만 실제 launch는 확인되지 않음 | 집 PC에는 VS Code만 있을 것으로 예상하므로 먼저 실제 실행 확인 |
| GitHub CLI | 설치되지 않음 | 선택 사항; Git Credential Manager만으로도 가능 |
| Android Studio | 설치됨, bundled Java 25 | Android 검증을 할 때만 새 PC에 설치 |
| Android SDK tools | ADB 37.0.1, Emulator 37.1.11 | Android Studio SDK Manager에서 재설치 |
| Android AVD | `Fluently_Pixel_8_API_36`, Pixel 8/API 36 Google Play system image | 선택 사항; Play Store enablement를 가정하지 말고 AVD와 로그인 상태를 새로 생성 |
| Codex/ChatGPT | desktop 작업과 로컬 대화 사용 | 앱 또는 VS Code extension 설치 후 새 로그인 |
| Codex extensions | Browser, Computer Use, GitHub/OpenAI documentation capabilities were used when available | Core project dependency가 아니며 필요할 때만 새 PC에서 다시 설치·연결 |

기존 Android SDK는 기본 사용자별 SDK 경로에 있고 PATH, `ANDROID_HOME`, `ANDROID_SDK_ROOT`, `JAVA_HOME`에 의존하지 않은 상태였다. 새 PC는 Android Studio가 관리하는 SDK 경로를 사용하고 필요한 경우에만 환경변수를 설정한다.

기존 emulator에서는 처음에 host-audio gate와 Windows microphone input 문제로 녹음이 되지 않았지만 설정 후 입력 막대가 움직였고 assessment를 완료했다. 그 뒤 별개의 emulator DNS outage가 발생했다. Fluently 같은 실제 음성 제품을 추가 조사할 때는 실제 Android phone이 더 신뢰할 수 있다. Emulator를 사용한다면 Extended Controls의 Microphone에서 host audio input을 켜고 Windows microphone permission과 입력 막대를 먼저 확인한다. 이 문제는 Speak AI 코드 문제로 취급하지 않는다.

현재 PC에서는 repository ownership warning 때문에 이 저장소의 정확한 경로만 global Git `safe.directory`에 추가한 적이 있다. 새 PC에는 이 설정을 복사하지 않는다. 새 clone에서 같은 ownership error가 실제로 발생할 때만 정확한 clone 경로를 확인한 뒤 제한적으로 추가한다.

## 새 PC 설치 요약

전체 명령과 플랫폼별 차이는 [SETUP](SETUP.md)에 있다. 최소 순서는 다음과 같다.

1. Git, Node 24.18.0, npm 11+, Python 3.13을 설치한다.
2. ChatGPT desktop app 또는 VS Code Codex extension을 설치하고 본인이 로그인한다.
3. 현재 branch를 지정해 clone한다.
4. root `.env.example`을 root `.env`로 복사한다. 계획된 key 값은 비워 둔다.
5. `frontend/.env`는 custom API URL이 필요할 때만 만든다.
6. `./scripts/setup.ps1`로 dependencies와 `.venv`를 재생성한다.
7. backend tests, frontend typecheck, Expo exports를 실행한다.
8. backend와 원하는 frontend platform을 별도 terminal에서 실행한다.

플랫폼별 frontend API URL:

- Web/iOS Simulator: `http://localhost:8000`
- Android emulator: `http://10.0.2.2:8000`
- Physical device: `http://<개발-PC-LAN-IP>:8000`

`EXPO_PUBLIC_API_BASE_URL`을 어떤 `.env*` 파일이나 process environment에도 설정하지 않으면 현재 source가 Web/iOS와 Android emulator의 기본값을 자동 선택한다. 값을 설정했다면 platform default를 덮어쓰므로 platform을 바꿀 때 수정하거나 unset하고 Expo를 다시 시작한다.

## 새 Codex에게 보낼 첫 메시지

저장소를 clone하고 그 폴더를 Codex에서 연 뒤 아래 내용을 그대로 보낸다.

```text
이 저장소는 기존 Speak AI 프로젝트를 다른 Windows PC에서 이어서 작업하는 것이다. 이 PC와 이 Codex 작업에는 이전 대화 기록이 없다.

먼저 어떤 파일도 수정하지 말고 현재 브랜치가 codex/phase-2-ui-foundation인지 확인한 뒤 git status, 최근 log, remote 동기화 상태를 읽기 전용으로 점검해줘. 그다음 AGENTS.md에 적힌 순서대로 필수 문서를 전부 읽고, 특히 docs/HANDOFF.md의 현재 상태와 재개 지점을 기준으로 삼아줘.

현재 Phase 2까지 완료되었고 Expo 기반의 명시적 Mock UI와 FastAPI GET /health만 구현되어 있다. 실제 AI, 음성, 인증, 데이터베이스, 결제, 학습 저장, Agent, Avatar는 아직 연결되지 않았다. Mock을 실제 기능처럼 설명하지 말고 이 범위를 보존해줘.

새 PC에서 Git, Node 24.18.0, npm 11+, Python 3.13 설치 상태를 확인하고 docs/SETUP.md대로 local .env와 dependency를 재생성해줘. 기존 PC의 .venv, node_modules, Codex auth/session은 복사하지 않는다. 비밀번호, OTP, 개인 이메일, Google/Fluently 로그인 정보, API key는 요청하거나 Git에 저장하지 말고, 로그인이 필요하면 내가 직접 입력하도록 안내해줘.

Bootstrap 후 backend pytest, frontend typecheck, Expo web/all export를 실행해 현재 기준선을 검증해줘. 문제가 있으면 원인을 먼저 설명하고 가장 작은 안전한 수정만 해줘.

검증이 끝나면 docs/TODO.md의 Next phase를 따라 이어가되, 우선 Phase 3의 인증 상태, 개인정보 안내 문구, route guard, acceptance test를 문서와 설계 수준에서 확정해줘. Supabase나 OpenAI를 설계 전에 미리 연결하지 마.

작업 전에는 간단한 계획과 가정을 알려주고, 완료 후에는 변경 파일, 실행한 검증, 남은 미검증 사항, 다음 권장 작업을 보고해줘.
```

새 Codex가 이 문서를 읽었다면 첫 응답에서 다음을 확인하게 한다.

- active branch와 remote tracking 상태
- 구현됨/Mock/미구현 경계
- 새 PC runtime 검사 결과
- 다음 한 가지 작업과 그 범위
- 필요한 사용자 입력 또는 MFA가 있는지

## 두 PC를 오갈 때 매번 할 일

작업을 시작할 때:

```powershell
git status -sb
git switch codex/phase-2-ui-foundation
git pull --ff-only
git status -sb
```

작업을 끝낼 때:

1. 관련 test/check를 실행한다.
2. `docs/TODO.md`와 이 문서의 재개 지점이 실제 상태와 같은지 확인한다.
3. `git status`와 diff를 검토한다.
4. Secret이나 `.env`가 staged되지 않았는지 확인한다.
5. 변경을 commit하고 `git push`한다.
6. remote branch에 새 commit이 보이는지 확인한다.

새로운 기능 branch로 옮기거나 현재 branch를 `main`에 merge하면 이 문서의 branch 안내를 같은 commit에서 반드시 갱신한다.

## 인수인계 문서 갱신 규칙

다음 중 하나가 바뀌면 `HANDOFF.md`를 함께 갱신한다.

- active resume branch
- 완료 phase 또는 다음 우선 작업
- 실제 integration과 Mock 경계
- 필요한 runtime/tool version
- setup/run/test command
- 새 환경변수 또는 외부 계정 종류
- 중요한 조사 결과나 미검증 한계
- 다른 PC에서 반복된 문제와 해결법

비밀값 자체는 어떤 경우에도 갱신 대상이 아니다.
