# 개발자 웹 이력서 — 개발 로드맵

GitHub Pages를 활용한 개인 개발자 웹 이력서 프로젝트입니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| 마크업 | HTML5 |
| 스타일링 | CSS3, TailwindCSS (CDN) |
| 인터랙션 | JavaScript (Vanilla) |
| 배포 | GitHub Pages |

## 프로젝트 구조

```
mhjung0208.github.io/
├── index.html          # 메인 페이지 (SPA)
├── css/
│   └── style.css       # 커스텀 스타일
├── js/
│   └── main.js         # 인터랙션 및 애니메이션
├── assets/
│   └── images/         # 프로필 사진, 프로젝트 스크린샷 등
├── ROADMAP.md
└── README.md
```

## 이력서 섹션 구성

### 1. Hero
- 이름, 직함 (예: Frontend Developer)
- 한 줄 소개
- CTA 버튼 (이력서 다운로드, 연락하기)

### 2. About Me
- 간단한 자기소개
- 개발 철학 / 관심 분야
- 프로필 이미지

### 3. Skills
- 기술 스택을 카테고리별 정리 (Frontend, Backend, Tools 등)
- 숙련도 표시 (프로그레스 바 또는 태그)

### 4. Experience
- 회사명, 직책, 재직 기간
- 주요 업무 및 성과 요약

### 5. Projects
- 프로젝트명, 설명, 사용 기술
- GitHub 링크 / 데모 링크
- 스크린샷 또는 썸네일

### 6. Education
- 학교명, 전공, 졸업 연도
- 관련 수료 과정 / 자격증

### 7. Contact
- 이메일, GitHub, LinkedIn 등 링크
- 간단한 문의 안내

---

## 단계별 개발 계획

### Phase 1 — 프로젝트 초기 설정 및 기본 구조

- [ ] Git 저장소 초기화 및 GitHub 연결
- [ ] `index.html` 기본 HTML 구조 작성
- [ ] TailwindCSS CDN 연결
- [ ] 커스텀 CSS 파일 생성 (`css/style.css`)
- [ ] JavaScript 파일 생성 (`js/main.js`)
- [ ] 파비콘 및 메타 태그 설정 (SEO)
- [ ] 네비게이션 바 구현 (섹션 링크)

### Phase 2 — 각 섹션 컨텐츠 개발

- [ ] Hero 섹션 — 이름, 직함, 소개 문구, CTA 버튼
- [ ] About Me 섹션 — 자기소개 텍스트, 프로필 이미지
- [ ] Skills 섹션 — 기술 스택 카드/태그 레이아웃
- [ ] Experience 섹션 — 타임라인 형태의 경력 목록
- [ ] Projects 섹션 — 카드 그리드 레이아웃
- [ ] Education 섹션 — 학력 및 자격증 목록
- [ ] Contact 섹션 — 소셜 링크, 이메일

### Phase 3 — 반응형 디자인 및 인터랙션

- [ ] 모바일 / 태블릿 / 데스크톱 반응형 레이아웃 적용
- [ ] 모바일 햄버거 메뉴 구현
- [ ] 스크롤 시 섹션 페이드인 애니메이션 (Intersection Observer)
- [ ] 네비게이션 부드러운 스크롤 (smooth scroll)
- [ ] 다크 모드 / 라이트 모드 토글
- [ ] 스크롤 상단 이동 버튼

### Phase 4 — 배포 및 최적화

- [ ] 이미지 최적화 (WebP 변환, lazy loading)
- [ ] Lighthouse 성능 점검 및 개선
- [ ] Open Graph 메타 태그 추가
- [ ] GitHub Pages 배포
- [ ] 커스텀 도메인 연결 (선택)
- [ ] README.md 작성

---

## 배포 방법

1. GitHub에 `{username}.github.io` 이름의 저장소 생성
2. 코드를 `main` 브랜치에 push
3. 저장소 Settings → Pages → Source를 `main` 브랜치로 설정
4. `https://{username}.github.io` 에서 확인
