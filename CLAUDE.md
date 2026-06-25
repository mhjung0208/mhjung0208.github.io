# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

GitHub Pages 기반 개발자 웹 이력서 (SPA). 빌드 도구 없이 정적 파일로 구성.

## 기술 스택

- HTML5, CSS3, Vanilla JavaScript
- TailwindCSS (CDN 방식 — 빌드 불필요)
- 배포: GitHub Pages (`main` 브랜치)

## 개발 서버

별도 빌드 과정 없음. 로컬 확인 시 Live Server 등 정적 파일 서버 사용:

```bash
# VS Code Live Server 확장 또는
npx serve .
```

## 아키텍처

- **단일 페이지(SPA)**: `index.html` 하나에 모든 섹션 포함
- **섹션 구성**: Hero → About Me → Skills → Experience → Projects → Education → Contact
- **스타일링**: TailwindCSS 유틸리티 클래스 우선, 커스텀 스타일은 `css/style.css`
- **인터랙션**: `js/main.js` — 스크롤 애니메이션, 다크모드 토글, 모바일 메뉴 등

## 컨벤션

- 응답, 주석, 커밋 메시지 모두 **한국어**
- 변수명/함수명은 영어
