# 추가 확인이 필요한 실제 정보

웹페이지에 근거 없는 수치를 넣지 않기 위해 아래 항목은 임시 처리하거나 표시하지 않았습니다.

## Rfice

- 필요한 정보: 팀 규모, 사용자 수 또는 도입 규모, WebGL/모바일/PC별 배포 빈도, 화이트보드 동기화 성능 지표
- 현재 임시 처리 방식: 팀 규모는 화면에 표시하지 않고, 담당 기능과 구현 결과만 서술했습니다.
- 사용 위치: `data/resume.json`의 `projects[0]`, `caseStudy.limits`
- 입력 예시: `팀 규모 6명`, `화이트보드 동기화 지연 시간 측정 기준`, `월 n회 정기 배포`

## Slime Rush

- 필요한 정보: 본인이 담당한 보스 수, 룬 종류 수, 출시 상태의 정확한 날짜, 플레이 테스트나 품질 개선 결과
- 현재 임시 처리 방식: Steam 공개 링크와 담당 기능만 표시했습니다.
- 사용 위치: `data/resume.json`의 Slime Rush 프로젝트 카드
- 입력 예시: `보스 패턴 3종 구현`, `룬 24종 데이터 적용`, `2025.03 Steam 출시`

## Ifland Avatar Open Studio

- 필요한 정보: 팀 규모, 에디터 사용자 유형별 실제 사용 흐름, 검수 조건의 구체 항목, JS-Unity 통신 API 범위
- 현재 임시 처리 방식: FBX/텍스처 프리뷰, 검수, AssetBundle 빌드, WebGL Viewer 구현 범위만 표시했습니다.
- 사용 위치: `data/resume.json`의 Ifland 프로젝트 카드
- 입력 예시: `검수 항목: 폴리곤 수, 텍스처 크기, 본 구조`, `JS API 명령 8개`

## JUMP AR 및 교육 콘텐츠

- 필요한 정보: 스토어 링크, 담당 화면 또는 모듈 이름, 운영 기간 중 주요 개선 사례, 앱 배포 이력
- 현재 임시 처리 방식: 기존 파일에 있는 기간, 플랫폼, 담당 기능만 사용했습니다.
- 사용 위치: `data/resume.json`의 JUMP AR, 살아있는 동화, 교원 프로젝트 카드
- 입력 예시: `App Store 링크`, `REST API 연동 화면 4개`, `TestFlight 배포 주기`

## 이력서 / 프로필

- 필요한 정보: 공개 가능한 이력서 PDF 또는 URL, LinkedIn이나 기술 블로그 URL
- 현재 임시 처리 방식: 작동하지 않는 이력서 버튼을 만들지 않았고, 이메일과 GitHub만 표시했습니다.
- 사용 위치: Header CTA, Hero CTA, Contact 섹션
- 입력 예시: `assets/resume.pdf`, `https://www.linkedin.com/in/...`, `https://blog...`
