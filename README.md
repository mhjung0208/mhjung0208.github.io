# 개발자 웹 이력서

GitHub Pages 기반 개인 개발자 웹 이력서입니다.

## 기술 스택

- HTML5, CSS3, JavaScript (Vanilla)
- TailwindCSS (CDN)
- GitHub Pages

## 시작하기

```bash
# 로컬 서버 실행
npx serve .
```

브라우저에서 `http://localhost:3000` 접속

## 개인정보 수정

`data/resume.json` 파일 하나만 수정하면 사이트 전체에 반영됩니다.

```
data/resume.json
├── meta        — 사이트 제목, 설명, OG 이미지
├── hero        — 이름, 직함, 한 줄 소개
├── about       — 자기소개, 프로필 이미지, 하이라이트
├── skills      — 기술 스택 (카테고리별)
├── experience  — 경력 사항
├── projects    — 프로젝트 목록
├── education   — 학력
├── certificates — 자격증
└── contact     — 이메일, GitHub, LinkedIn 등
```

## 주요 기능

- 반응형 디자인 (모바일 / 태블릿 / 데스크톱)
- 다크모드 / 라이트모드 토글
- 스크롤 페이드인 애니메이션
- JSON 기반 데이터 관리

## 배포

`main` 브랜치에 push하면 GitHub Pages에 자동 배포됩니다.
