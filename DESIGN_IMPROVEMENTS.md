# 디자인 개선점 — Hallmark 점검 결과

채용 담당자가 첫 화면에서 "누구인지, 무슨 직무인지, 몇 년차인지, 대표작이 무엇인지, 어떻게 연락하는지"를 바로 읽을 수 있도록 디자인을 손보기 위한 점검 기록입니다.

## 개요

| 항목 | 내용 |
|------|------|
| 점검 일자 | 2026-10-12 |
| 방법 | Hallmark audit. 1440 / 768 / 390 / 320px 렌더 스크린샷과 측정값(가로 넘침, 섹션 높이, 포커스 이동, 이미지 용량), 코드 점검(`index.html`, `js/main.js`, `css/style.css`, `data/resume.json`) |
| 판정 | **4 critical · 9 major · 4 minor, reads as AI-generated** |

### 총평

- 코랄 강조색 하나와 미색 배경으로 정리한 팔레트, 데이터와 렌더를 나눈 구조는 좋은 출발점입니다.
- 하지만 첫 화면에 이름·연차·연락처가 없고, 920px(1440 기준) 넘게 여백과 일러스트가 차지해 핵심 정보가 늦게 나옵니다.
- 섹션 제목이 모두 "My **Skills**" 같은 가운데 정렬 + 강조 단어 패턴이고, 카드 11개가 같은 크기로 반복되어 템플릿처럼 보입니다.
- 강조색 텍스트와 회색 보조 텍스트가 대비 기준(4.5:1)에 못 미치고, 프로젝트 카드와 모달은 키보드로 쓸 수 없습니다.
- 이미지 원본(PNG 2~4MB)을 썸네일로 그대로 써서 첫 로드가 무겁습니다.

### 축별 점수 (5점 만점)

| 축 | 점수 | 근거 요약 |
|------|:----:|------|
| 철학 (의도가 보이는가) | 3 | 단일 강조색·일자형 케이스 스터디처럼 의도된 선택이 있으나 Hero에서 흐려짐 |
| 위계 (먼저 읽힐 것이 먼저 읽히는가) | 2 | 이름·연차가 첫 화면에 없음, 대표작 구분 없음 |
| 실행 (대비·접근성·성능) | 2 | 대비 미달, 키보드 접근 불가, 이미지 과대 |
| 고유성 (이 사람만의 페이지인가) | 3 | 회사 로고 타임라인·케이스 스터디는 고유, 섹션 제목·카드 그리드는 템플릿 |
| 절제 (불필요한 장식이 없는가) | 2 | 장식 코드 텍스트, 전 섹션 페이드인, hover 들썩임, % 막대 |
| 다양성 (섹션마다 형식이 맞게 다른가) | 3 | 경력은 타임라인이지만 Skills·Projects·Education·Contact가 같은 카드 반복 |

## 유지할 것

- **단일 코랄 강조색 + 미색 팔레트**: `#e8604c` 하나와 `warm-50/100/200`만 쓰는 절제된 색 구성. 텍스트용 진한 코랄만 추가합니다.
- **회사 로고 + 재직 기간 타임라인**: `renderExperience`, `calcWorkDuration`. 재직 기간 자동 계산은 그대로 둡니다.
- **일자형 케이스 스터디**: `renderCaseStudyLinear` (카드·그리드 없이 제목 + 본문 한 열 흐름).
- **데이터/렌더 분리**: 내용은 `data/resume.json`, 표시는 `js/main.js`. 케이스 스터디 문자열은 `escapeHtml` / `formatCaseText`를 거칩니다.
- **반응형 기본기**: 4개 폭 모두 가로 넘침 0, 모바일 메뉴 링크 높이 44px, 모달·라이트박스 Esc 닫기.

## 개선 항목

심각도: 상(critical/major 중 시급) · 중(major) · 하(minor). 작업량: S(1시간 이내) · M(반나절) · L(하루 이상).
상태: `[x] 완료` · `[~] 부분` · `[ ] 보류`. 결과 수치는 아래 "적용 결과"에 있습니다.
줄번호는 2026-10-12 작업 트리 기준입니다(커밋되지 않은 케이스 스터디 작업 포함).

| # | 심각도 | 영역 | 문제와 근거 (파일:라인) | 수정 방향 | 작업량 | 상태 |
|:--:|:--:|------|------|------|:--:|:--:|
| 1 | 상 | Hero 정보 | 첫 화면에 이름·연차·연락처가 없음. 로고가 "Jung Min Hwa. 92"(`js/main.js:40`, `resume.json` hero.nameEn). `hero.stats`/`hero.badges`를 HTML로 만들지만 출력하지 않음(`js/main.js:46-62`) | 이름·직무·연차를 첫 줄에, 슬로건은 보조로. CTA 2개(프로젝트 보기 / 이메일). 로고에서 "92" 제거 | M | [x] 완료 |
| 2 | 상 | Hero 레이아웃 | `pt-80 pb-[17rem]`(`index.html:74`)로 Hero 높이 1440px 920px, 390px 1142px. 모바일에서 CTA가 첫 화면 아래로 밀림 | 패딩 축소, 모바일 이미지 크기 축소 | S | [x] 완료 |
| 3 | 상 | 색 대비 | 코랄 `#e8604c`는 흰 바탕 3.38:1, 미색 바탕 3.17:1(작은 강조 글자, 버튼 흰 글자 모두 미달). `text-gray-400`(`#9ca3af`)는 흰 바탕 2.54:1(`js/main.js:245`, `index.html:128` 등) | 텍스트용 진한 코랄 토큰 추가, 버튼 배경 어둡게, 보조 텍스트 gray-500 이상 | M | [x] 완료 |
| 4 | 상 | 모달 접근성 | 모달에 `role="dialog"`/`aria-modal`/`aria-labelledby` 없음(`js/main.js:396-419`). 열 때 포커스가 BODY에 남고(측정: active=BODY) 트랩·복귀 없음. 닫기 버튼(`js/main.js:401`)과 라이트박스 버튼(`js/main.js:886-888`)에 aria-label 없음 | dialog 속성, 열 때 닫기 버튼으로 포커스, Tab 순환, 닫을 때 카드로 복귀, 버튼 라벨 | M | [x] 완료 |
| 5 | 상 | 카드 키보드 | 프로젝트 카드가 click 핸들러만 있는 `div`(`js/main.js:258`, `277-281`). Tab으로 들어갈 수 없음(측정: tabIndex -1) | `button`으로 바꾸고 `:focus-visible` 링 | S | [x] 완료 |
| 6 | 상 | Hero 이미지 | LCP 후보인 Hero 이미지(2.39MB PNG, 1536×1024)가 `loading="lazy"`(`js/main.js:69`). 데스크톱/모바일용 마크업이 중복(`js/main.js:82-89`) | `eager` + `fetchpriority="high"`, WebP, width/height 지정, 마크업 하나로 | S | [x] 완료 |
| 7 | 상 | 이미지 용량 | `data/Images` 67MB. 카드 썸네일(`h-44`, 표시 폭 약 400px)에 3~4MB 원본 PNG 사용(`resume.json` projects[].image, `js/main.js:231-234`) | 카드용 640px WebP 썸네일, 갤러리용 1600px WebP. 원본은 보존 | M | [x] 완료 |
| 8 | 중 | 프로젝트 위계 | DOTS 카드 2개가 같은 썸네일·같은 태그(`resume.json` projects[0], [1])로 중복처럼 보임. 카드 11개가 모두 같은 크기라 대표작이 드러나지 않음(`js/main.js:274`) | 상세판/요약판 관계 표시, 썸네일 구분. 대표작 2~3개를 넓게 | M | [x] 완료 |
| 9 | 중 | 한글 타이포 | 음절 단위 줄바꿈("파이프라/인", "프로/젝트")이 카드 설명에서 발생. 폰트가 OS 기본(`ui-sans-serif, system-ui`) | `word-break: keep-all`, Pretendard Variable 하나로 통일 | S | [x] 완료 |
| 10 | 중 | 섹션 제목 | 섹션 제목 7개 모두 가운데 정렬 + 강조 단어 패턴(`index.html:82,90,98,106,114,122`). 영문 제목 + 한글 본문 | 왼쪽 정렬 한글 제목 + 작은 영문 라벨 | S | [x] 완료 |
| 11 | 중 | Contact | 이메일이 링크가 아닌 텍스트(`js/main.js:966`), 연락 수단 1개 | `mailto:` 링크, GitHub 링크, 큰 텍스트 링크 | S | [x] 완료 |
| 12 | 중 | 케이스 스터디 길이 | 케이스 스터디 모달 높이 9086px(1440), 14775px(390). 목차 없음. 섹션 제목 왼쪽 3px stripe(`css/style.css:222-233`) | sticky 섹션 칩 목차, stripe 제거 | M | [x] 완료 |
| 13 | 중 | 케이스 스터디 본문 | 본문 13.6px(`.cs-body p` 0.85rem, `css/style.css:283-287`), 일자형판 0.9rem(`css/style.css:440-444`) | 15px / 행간 1.75 | S | [x] 완료 |
| 14 | 중 | 모바일 모달 | 갤러리 높이 420px 고정 + `object-fit: contain`(`css/style.css:117-122`)이라 모바일에서 위아래 여백 띠. 일반 모달 좌우 `px-10`(`js/main.js:388`) 고정 | `aspect-ratio`로 높이 결정, `px-5 sm:px-10` | S | [x] 완료 |
| 15 | 중 | 모션 | 전 섹션 `fade-in`(`index.html:80-120`, `css/style.css:32-41`, `js/main.js:1031-1042`), `transition-all hover:-translate-y-1`(`js/main.js:157,258`), `prefers-reduced-motion` 대응 없음(측정: reduced 에뮬레이션에서도 transition 유지) | 섹션 페이드인 제거, transition 속성 한정, reduced-motion 처리 | S | [x] 완료 |
| 16 | 중 | Skills | 자기평가 % 막대(근거 없는 수치, `js/main.js:142-173`, `resume.json` skills[].items[].level), 3열 균일 카드 그리드 | 범주별 태그 목록(수치 비표시, 데이터는 보존) | S | [x] 완료 |
| 17 | 중 | 장식 요소 | Hero 장식 코드 텍스트 `<div className="info">`, `function create() {`(`js/main.js:77-78`). 카드의 외부 링크 아이콘(`js/main.js:262-264`)이 실제 동작(모달 열기)과 불일치 | 장식 삭제, 아이콘 대신 "자세히 →" | S | [x] 완료 |
| 18 | 중 | 모달 문구 | 개인 프로젝트에 "회사: 개인 프로젝트"(`js/main.js:315`). 이모지 소제목 🔗📸📌(`js/main.js:340,364,380`) | 라벨 "소속", 이모지 제거 | S | [x] 완료 |
| 19 | 하 | 메타/OG | `<title>이력서</title>`, description/og 빈 값(`index.html:6-12`)을 JS가 나중에 채움(`js/main.js:32-41`) → 크롤러 미반영. og:image 없음, favicon이 이모지(`index.html:14`). `assets/favicon.svg`/`og-image.svg`는 있으나 다른 색(청록)이고 연결 안 됨 | 정적 title/description/OG, 1200×630 PNG OG 이미지, favicon 정리 | S | [x] 완료 |
| 20 | 하 | 구조/기타 | Hero에 `h1` 2개(`js/main.js:95-96`), 모달 제목도 `h1`(`js/main.js:409`). 메뉴 버튼에 `aria-label`/`aria-expanded` 없음(`index.html:53`, `js/main.js:988-995`). 라이트박스 `z-index: 99999`(`js/main.js:879`). Tailwind CDN production 경고(`index.html:15`) | h1 하나, 메뉴 버튼 ARIA, z-index 정리. CDN 경고는 구조상 유지(빌드 불필요 원칙) | S | [~] 부분 |

## 확인하지 못한 항목

- **포커스 링 육안 확인**: 내비 링크만 스크린샷으로 확인했고, 카드·모달 내부 버튼의 포커스 표시는 확인하지 못했습니다.
- **다크모드**: 없음. README에 "다크모드 토글"이 적혀 있지만 구현은 없습니다. 결함으로 보지 않고 범위 밖으로 둡니다.
- **Certificates**: `resume.json`의 `certificates`가 빈 배열이라 렌더 결과를 확인할 수 없습니다(현재 렌더러도 없음).
- **실측 부재**: Lighthouse 점수, 스크린리더(NVDA/VoiceOver) 낭독, SNS OG 미리보기는 실측하지 않았습니다.

## 작업 계획

### 이번 라운드 적용

- Hero 재구성(1, 2, 6, 17), 대비 토큰(3), 접근성(4, 5, 20), 한글 타이포(9), 섹션 제목(10)
- Skills 태그화(16), Contact 링크화(11), 모달 가독성·목차(12, 13, 14, 18), 모션 정리(15), 정적 메타(19)
- 프로젝트 목록 위계(8): `resume.json`에 선택 필드 `featured`를 추가하고, 없으면 기존처럼 동작
- 이미지 최적화(7): 변환 스크립트를 `scripts/`에 두고 원본 PNG는 보존한 채 WebP 병행 생성

### 보류 / 결정 필요 (작업 전 기준)

- **Tailwind CDN 경고**: "빌드 불필요" 원칙 때문에 CDN을 유지합니다. 경고를 없애려면 Tailwind CLI 빌드 도입이 필요합니다.
- **이력서 PDF / LinkedIn**: 데이터가 없어 버튼을 만들지 않습니다(`CONTENT_TODO.md` 참고).
- **DOTS 두 항목**: 데이터는 유지하고 표시만 구분합니다. 하나로 합칠지는 사용자 결정이 필요합니다. → 해결됨(2차: 서로 독립된 두 항목으로 표시).

---

## 적용 결과 (2026-10-12, 1차 라운드)

### 디자인 방향

- **차분한 편집형 이력서**: 장식 대신 정보 위계. 섹션마다 왼쪽에 한글 제목(+작은 영문 라벨), 오른쪽에 본문을 두는 2열 구조(1024px 이상, 제목 열은 sticky). 그 아래 폭에서는 위아래로 쌓인다.
- **한 곳에만 힘을 준다**: 가장 큰 요소는 Hero의 이름 "정민화"(Pretendard 800, 최대 104px). 나머지는 선(rule)과 여백으로만 나눈다. 카드 그림자·블러·그라디언트·hover 들썩임은 걷어냈다.
- **폰트**: Pretendard Variable 하나 (`cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9`, dynamic subset). 실패하면 Apple SD Gothic Neo / Malgun Gothic 등 시스템 폰트로 폴백. 본문 전체 `word-break: keep-all`.
- **색 토큰** (`css/style.css` `:root`, `index.html` Tailwind 설정에 같은 값):

| 토큰 | 값 | 용도 | 대비 |
|------|------|------|------|
| `--paper` / warm-50 | `#faf7f2` | 페이지 바탕 | — |
| `--paper-2` / warm-100 | `#f3ede4` | 태그·이미지 바탕 | — |
| `--rule` / warm-200 | `#e8dfd3` | 구분선 | — |
| `--ink` / gray-900 | `#211e1b` | 제목 | 미색 바탕 15.5:1 |
| `--ink-2` / gray-700 | `#433e38` | 본문 | 미색 바탕 9.9:1 |
| `--muted` / gray-500 | `#6b645c` | 보조 텍스트 | 미색 5.4:1, 흰 5.8:1 |
| `--accent` | `#e8604c` | 장식(밑줄·점·짧은 선)과 큰 글자만 | 3.17~3.38:1 (텍스트 미사용) |
| `--accent-ink` / accent-ink | `#b4412f` | 작은 강조 텍스트·링크·버튼 배경 | 미색 5.26:1, 흰 글자 5.62:1 |

  Tailwind `gray` 팔레트는 미색에 맞춘 따뜻한 회색으로 교체했고, `text-gray-400`은 텍스트에서 모두 뺐다.

### 항목별 결과

| # | 결과 | 내용 |
|:--:|:--:|------|
| 1 | 완료 | Hero 첫 줄 이름, 둘째 줄 "9년차 Unity 클라이언트 개발자"(`hero.careerLabel` + `hero.role`), 슬로건은 보조. CTA "프로젝트 보기"/"이메일 보내기". 그 아래 경력(회사·연도)·대표 프로젝트(모달 열기 버튼)·연락처 요약. 로고는 `hero.name`("정민화")로 바꿔 "92" 제거. **2차: "9년차" → "경력 8년 9개월"(계산값), 대표 프로젝트 줄 삭제** |
| 2 | 완료 | Hero 높이 1440px 920→726px. 390px에서 CTA 하단이 369px(뷰포트 800px)로 첫 화면 안. 모바일 일러스트는 텍스트 뒤로, 최대 16rem |
| 3 | 완료 | 작은 글자 최소 대비: 페이지 5.26:1, 모달 5.01:1(케이스 스터디 커밋 배지). 4.5:1 미달 텍스트 0건(장식용 `•` 기호 제외, aria-hidden) |
| 4 | 완료 | `role="dialog"`, `aria-modal`, `aria-labelledby`(모달 제목 `h2#modal-title`). 열 때 닫기 버튼으로 포커스, Tab 40회 동안 모달 밖으로 나간 횟수 0, Esc로 닫으면 연 카드 버튼으로 복귀, 배경은 `inert`. 라이트박스도 dialog + 버튼 라벨, 포커스 트랩·복귀, Esc는 라이트박스만 닫음 |
| 5 | 완료 | 카드 제목을 `button.project-open`으로 만들고 `::after`로 카드 전체를 덮음. `:focus-visible` 링(카드 테두리 안쪽 3px) |
| 6 | 완료 | 마크업 하나로 통합, `loading="eager"` + `fetchpriority="high"` + `width/height`, `<link rel="preload">`(imagesrcset). 2.39MB PNG → 46KB(640px WebP, 실제 선택됨) / 207KB(1536px WebP) |
| 7 | 완료 | `scripts/optimize-images.js`(sharp, `npm run images`)로 원본 58개 66.4MB 옆에 WebP 병행 생성: 1600px판 합계 3.5MB, 640px판 1.2MB. 원본 PNG/JPG는 그대로. `resume.json` 이미지 경로 교체(카드 `image`는 `-640.webp`, 갤러리·케이스 스터디 그림은 `.webp`, 회사 로고는 PNG 유지). 첫 로드 이미지 1440px 3.1MB → 300KB, 390px 114KB |
| 8 | 완료 | `featured: true` 선택 필드(없으면 기존처럼 일반 목록). 대표작 3개는 이미지+설명 가로형 카드, 나머지는 작은 썸네일 목록(2열). DOTS 두 항목은 `group`/`edition`(상세판·요약판) 필드로 묶고, 요약판 썸네일을 성능 차트(`09. Perf Editor vs Release`)로 교체, 카드마다 "요약판으로 읽기"/"상세판으로 읽기" 버튼. **2차: 대표/그 밖 구분과 DOTS 묶음 표시를 모두 없애고 한 목록으로 통일(`featured`/`group`/`edition` 필드 삭제)** |
| 9 | 완료 | `word-break: keep-all`, Pretendard Variable 통일 |
| 10 | 완료 | 왼쪽 정렬 한글 제목(소개·경력·기술·프로젝트·학력·연락) + 작은 영문 라벨. 내비 메뉴도 한글 |
| 11 | 완료 | `mailto:` 큰 텍스트 링크. 이력서 PDF는 데이터가 없어 만들지 않음. **2차: GitHub 링크와 안내 문장 삭제, 이메일 한 줄만** |
| 12 | 완료 | 모달 상단 sticky 칩 목차(섹션 3개 이상일 때), 현재 섹션 표시, stripe 대신 윗선. 모달 길이(1440px 9,785px)는 본문을 바꾸지 않았고 글자가 커져 조금 늘었다 |
| 13 | 완료 | `.cs-body p`와 일자형판 본문 15px, 행간 1.75~1.8. 목록·표·캡션도 13~15px로 올림 |
| 14 | 완료 | 갤러리 `aspect-ratio: 16/10` + `max-height: 70vh`, 일반 모달 `px-5 sm:px-10` |
| 15 | 완료 | 섹션 스크롤 페이드인 제거. 자동 모션은 Hero 글자 한 번 등장뿐. transition은 색·테두리로 한정. reduced-motion에서 애니메이션 0.01ms·`scroll-behavior: auto` 확인 |
| 16 | 완료 | % 막대 → 범주별 태그 목록(`level` 값은 데이터에 남김) |
| 17 | 완료 | 장식 코드 텍스트 삭제, 외부 링크 아이콘 대신 "케이스 스터디 읽기"/"자세히 보기" |
| 18 | 완료 | "회사" → "소속", 이모지 소제목 제거, 모달 속성에 "역할" 추가 |
| 19 | 완료 | 정적 `<title>`/description/OG/twitter 메타, canonical, `assets/og-image.png`(1200×630, Playwright로 렌더), favicon은 `assets/favicon.svg`를 코랄로 재색 |
| 20 | 부분 | `h1`은 페이지 1개(모달 제목은 `h2`). 메뉴 버튼 `aria-label`/`aria-expanded`/`aria-controls`, Esc로 닫기. 라이트박스 z-index 99999 → 60. 본문 건너뛰기 링크 추가. **Tailwind CDN 경고는 남음**(빌드 불필요 원칙 유지) |

### 검증

- `npm test` / `npm run typecheck` / `npm run build` 통과, `resume.json` 유효, 참조 이미지 68개 모두 존재.
- 1440 / 768 / 390 / 320px: 가로 넘침 0, 깨진 이미지 0, 콘솔 에러 0(Tailwind CDN 경고 1건만), 실패한 요청 0.
- 모달 5종(DOTS 상세판·요약판, Rfice, Slime Rush, T Real VR) 열기·갤러리·라이트박스·Esc·포커스 복귀 확인. 경력 기간 표시 "(3년 10개월)", "(4년 11개월)" 그대로, 합계 "8년 9개월" 추가.
- 스크린샷: 점검 스크래치 폴더 `design/`(fold·full·섹션별·모달·라이트박스·모바일 메뉴·포커스 링).

### 남은 과제

- ~~**dist 용량**: 원본 PNG를 보존하면서 `build-site.js`가 `data/` 전체를 복사해 dist가 72MB.~~ → 해결됨(2차, 아래 결정 3).
- ~~**`assets/og-image.svg`**: 옛 청록색 시안이 그대로 남아 있다.~~ → 해결됨(2차, 아래 결정 4에서 삭제).
- **OG 이미지 재생성**: 이름·직무·경력 기간이 바뀌면 다시 렌더해야 한다. 지금은 일회성 Playwright 스크립트로 만들었다(저장소에 스크립트 없음). 2차에서 "경력 8년 9개월"로 다시 렌더했다.
- **Tailwind CDN**: production 경고와 런타임 스타일 생성 비용. 없애려면 Tailwind CLI 빌드 도입이 필요하다.
- **케이스 스터디 길이**: 목차로 이동은 쉬워졌지만 상세판은 여전히 길다. 요약판을 기본으로 보여줄지 결정 필요.
- **실측**: Lighthouse, 스크린리더 낭독, SNS 공유 미리보기는 아직 실측하지 않았다.

### 결정이 필요한 점 (모두 해결됨 → 아래 "결정 사항")

- **[해결됨] 대표작 선정(`featured`)**: Vampire Survivors DOTS 상세판(가장 최근, 케이스 스터디 보유), Rfice Jenkins CI/CD(최근 실무, 빌드 인프라 역량), Rfice(알서포트 2022.02~2025.12, 가장 길고 최근인 상용 서비스, 멀티플랫폼). 살아있는 동화(2018~2022)도 기간은 길지만 더 오래됐고 유아 교육 앱이라 Rfice를 골랐다.
- **[해결됨] DOTS 두 항목**: 데이터는 그대로 두고 화면에서 상세판/요약판으로 구분했다. 하나만 남길지, 요약판을 대표로 바꿀지 결정 필요.
- **[해결됨] 추가한 데이터 필드**: `hero.role`("Unity 클라이언트 개발자", 기존 subtitle 문구), `hero.careerLabel`("9년차", 기존 `about.highlights`), `hero.profileImageSize`, `meta.url`, `contact.github`(저장소 원격 주소 `github.com/mhjung0208`), `projects[].featured/group/edition`. `meta.title/description` 문구도 위 값으로 갱신.
- **외부 의존성**: Pretendard Variable CDN(jsDelivr, v1.3.9 고정), devDependency `sharp@0.34.3`(이미지 변환 전용, 배포·CI에는 필요 없음).

---

## 결정 사항 (2026-10-12, 2차 라운드)

1차 결과에 대한 사용자 결정과 추가 수정 요청을 반영했다.

### 결정과 반영 결과

| # | 결정 / 요청 | 반영 결과 |
|:--:|------|------|
| 결정 1 | 대표작은 Rfice, Rfice Jenkins CI/CD, 살아있는 동화 | 요청 C로 대표/그 밖 구분 자체가 없어져 렌더러가 `featured`를 읽지 않게 됐다. 쓰이지 않는 필드라 `projects[].featured`를 **삭제**하고 선정 결과는 이 문서에만 남긴다. 다시 강조가 필요하면 세 항목에 `featured: true`를 넣고 렌더러를 되살리면 된다 |
| 결정 2 | DOTS 상세판·요약판을 서로 분리 | `group`/`edition` 필드, `edition-badge`, "요약판으로 읽기/상세판으로 읽기" 버튼, 이름에서 "(요약판)"을 숨기던 `displayProjectName`을 삭제. 이름은 데이터 그대로("… DOTS Study", "… DOTS Study (요약판)"), 썸네일도 서로 다름(게임 화면 / 성능 차트). 두 카드가 각각 자기 모달을 연다 |
| 결정 3 | 참조되지 않는 원본 PNG는 dist에서 제외 | `scripts/build-site.js`가 `index.html`·`404.html`·`css/`·`js/`·`data/resume.json`에서 `data/...` 이미지 경로를 모아, `data/` 아래 PNG/JPG 중 참조되지 않는 파일은 복사하지 않는다. 빌드 끝에 참조 이미지가 dist에 모두 있는지 확인하고 없으면 실패한다. 원본은 저장소에 그대로 둔다 |
| 결정 4 | `assets/og-image.svg` 삭제 | 참조는 `validate-site.js` 필수 파일 목록뿐이었다(`index.html`·README·sitemap에는 없음). 목록을 `assets/og-image.png`로 바꾸고 SVG 파일 하나만 삭제 |
| 확인 1 | 경력은 "8년 9개월"로 정확히 | `main.js` `calcTotalCareer()`가 experience 재직 기간 합계(알서포트 3년 10개월 + 모프인터랙티브 4년 11개월 = 105개월)를 계산해 Hero("경력 8년 9개월 Unity 클라이언트 개발자"), 소개 하이라이트(`about.highlights`의 `{career}` 자리), 경력 섹션 합계에 같은 값을 쓴다. `hero.careerLabel`("9년차")은 삭제. 정적 메타(title/description/og)와 `resume.json` meta는 문자열로 "경력 8년 9개월"을 넣고, `validate-site.js`가 이 문자열이 재직 기간 합계와 같은지 검사한다. OG 이미지도 다시 렌더 |
| A | Hero 대표 프로젝트 영역 삭제 | 요약 블록에서 "대표 프로젝트" 줄, 모달 여는 버튼과 핸들러, `.hero-project-link` 스타일 삭제. 경력(회사·연도)·연락처(이메일) 두 줄은 남겨 이름·직무·버튼·이미지와 균형을 맞췄다. Hero 높이 1440px 726→675px |
| B | GitHub 연락처 삭제 | Hero 연락처 줄의 GitHub 링크, Contact 저장소 안내 문장, `contact.github` 필드 삭제. 푸터·메타에는 원래 없었다. `hero.resumeUrl`은 건드리지 않음 |
| C | 프로젝트 한 목록 | 11개를 resume.json 순서(최신순)대로 같은 가로형 카드(`.project-card`)로 표시하고 "그 밖의 프로젝트" 소제목 제거. 높이를 줄이려고 썸네일 열 18rem(1024px 이상)/14rem(640px 이상), 좁은 폭은 5:2 썸네일, 설명 3줄 제한, 기술 태그 4개 + "+N"(전체는 모달). 카드 높이 1440px 197~224px(섹션 2,653px), 390px 367~437px(섹션 4,439px) |
| D | Contact은 이메일만 | 제목(연락/Contact)과 큰 `mailto:` 텍스트 링크 한 줄만 남기고 "채용이나 프로젝트 관련 연락은…" 문장 삭제 |
| E | 죽은 코드 정리 | JS: `displayProjectName`, `siblingEditionHtml`, Hero 대표작 렌더·핸들러, `openProjectModal`의 `projects` 인자. CSS: `.project-feature*`, `.project-row*`, `.project-rows`, `.project-list-title`, `.project-alt`, `.project-actions`, `.edition-badge`, `.hero-project-link`. 데이터: `featured`, `group`, `edition`, `hero.careerLabel`, `contact.github`. CSS 클래스 중 HTML/JS에서 쓰지 않는 것 0개 |

### 보존한 것

- 케이스 스터디(일자형 포함)·갤러리·라이트박스, 모달 dialog 시맨틱·포커스 트랩·포커스 복귀·`inert`, 대비 토큰, reduced-motion, 건너뛰기 링크
- 카드는 그대로 `button.project-open` + `::after` 전체 영역, `:focus-visible` 3px 링
- 프로젝트 설명·케이스 스터디 본문·성능 표·경력 사실 관계는 바꾸지 않았다

### dist 용량

| | 파일 수 | 용량 |
|------|:--:|:--:|
| 이전 | 185 | 74.8MB (PNG/JPG 59개 69.8MB) |
| 이후 | 128 | 5.1MB (PNG 3개 0.2MB) |

- 제외된 원본 56개(69.6MB): 프로젝트 썸네일·갤러리·케이스 스터디 그림·Hero·증명사진의 PNG/JPG. 화면은 모두 WebP 쌍(`.webp`/`-640.webp`)을 쓰고, `<picture>` 폴백이나 `srcset`에 PNG를 넣은 곳이 없다.
- 남긴 원본 3개: `assets/og-image.png`(SNS 미리보기는 PNG 유지, `assets/`는 전부 복사), `data/Images/Companies/Rsupport_Logo.png`, `MorphInteractive_Logo.png`(경력 섹션 회사 로고로 `resume.json`에서 직접 참조).

### 검증

- `npm test` / `npm run typecheck` / `npm run build` 통과. `resume.json` 유효, 참조 이미지 69개 모두 존재(소스·dist). 메타 경력 표기를 일부러 틀리게 바꾸면 `validate-site.js`가 실패하는 것도 확인.
- 소스·dist 각각 1440 / 768 / 390px: 가로 넘침 0, 깨진 이미지 0, 4xx·실패 요청 0, 콘솔 에러 0(Tailwind CDN 경고 1건만). 프로젝트 카드 11개 한 목록, Contact 링크는 `mailto:` 1개.
- 키보드(1440·390): Tab으로 첫 카드 진입(포커스 링 3px), Enter로 모달 열림·닫기 버튼에 포커스, Tab 25회 동안 모달 밖으로 나간 횟수 0, Esc로 닫으면 연 카드로 복귀. DOTS 상세판과 요약판 카드가 각각 자기 제목의 모달을 연다.
- 화면 문자열 검사: "GitHub", "github.com", "9년차", "대표 프로젝트", "채용이나 프로젝트 관련", "그 밖의 프로젝트" 0건.

### 남은 확인

- 회사 로고는 WebP 사본(`*_Logo.webp`)이 있지만 1차 결정대로 PNG를 쓴다. WebP로 바꾸면 dist에서 PNG 2개(18KB)도 빠진다.
- `hero`의 `nameEn`·`heading`·`headingAccent`·`stats`·`badges`는 이번 변경 전부터 화면에 쓰이지 않던 필드라 손대지 않았다.
- README의 "다크모드 토글", "스크롤 페이드인" 문구는 실제 구현과 다르다(1차부터 범위 밖).
