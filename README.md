
최상위 폴더는 npm workspaces를 사용하여 두 프로젝트를 함께 관리합니다.

---

# 🟦 Backend (`/backend`)

### `/backend/src`

- `config/` — DB 연결 및 환경 설정 (MySQL, Sequelize, Mongo, Redis 등)
- `controller/` — 라우트별 요청 처리(입력 검증 → service 호출 → 응답)
- `middleware/` — 인증(JWT), CORS, 로깅, 에러 핸들러
- `models/` — Sequelize/Mongoose 모델 정의
- `repositories/` — DB 접근 레이어 (쿼리 담당)
- `routes/` — Express 라우트 구성
- `services/` — 비즈니스 로직
- `uploads/` — 파일 업로드 폴더
- `utils/` — 서버 공용 유틸 함수
- `app.js` — Express 앱 설정
- `index.js` — 서버 엔트리 포인트

---

# 🟩 Frontend (`/frontend`)

### `/frontend/src`

- `app/`  
  - Next.js 16 App Router 폴더  
  - `/page.tsx`, `/login/page.tsx` 등 라우트 엔트리  
  - SSR 인증 체크(getCurrentUser) 및 redirect 처리

- `lib/`  
  - 프론트엔드 공용 유틸 및 설정  
  - 도메인 의존성 없음  
  - 예: axios 인스턴스(serverApi), cookie 헤더 생성 유틸 등

- `types/`  
  - 전역 공용 TypeScript 타입

- `features/`  
  도메인 기반 React 기능 모듈  
  - **features/auth/**  
    - `server/getCurrentUser.ts` (SSR 전용 인증 요청)  
    - `components/`  
    - `hooks/`  
    - `api/`  
    - `types.ts`  
  - **features/feed/**  
    - 피드 관련 컴포넌트/훅/api  
  - **features/chat/**  
    - Zustand store, 소켓 훅 등  
  - 기능별로 컴포넌트·hooks·api·store를 묶어서 관리하는 구조

> 모든 "실질적인 React UI/로직"은 features 안으로 이동  
> app/ 은 라우트 + SSR 로직만 담당 (Next 권장 방식)

---

# 🚀 루트에서 프로젝트 실행

루트의 `package.json`은 다음과 같습니다:

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "backend",
    "frontend"
  ],
  "scripts": {
    "dev:backend": "npm start --workspace backend",
    "dev:frontend": "npm run dev --workspace frontend",
    "dev": "npm run dev:backend & npm run dev:frontend",
    "start": "npm run dev"
  }
}

📦 루트에서 라이브러리 설치 가이드

- 백엔드 전용 패키지 설치
npm install express-validator -w backend

프론트엔드 전용 패키지 설치
npm install zustand -w frontend

백, 프론트 양쪽 모두 설치
npm install axios -w backend -w frontend

프로젝트 개발환경 실행
npm start
