# 🍽️ KcalCal - AI 음식 칼로리 분석기

**주머니 속 AI 영양사**  
사진 한 장으로 음식의 칼로리와 영양소를 즉시 확인하세요!

[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

---

## ✨ 주요 기능

- 📸 **사진 분석**: 음식 사진을 찍으면 AI가 자동으로 칼로리와 영양소 분석
- 🧠 **Gemini AI 기반**: Google의 최신 Gemini Vision AI 모델 사용
- 📊 **영양소 정보**: 칼로리, 탄수화물, 단백질, 지방, 당 정보 제공
- 💾 **로컬 저장**: 모든 데이터는 기기에만 저장 (외부 전송 없음)
- 📱 **PWA 지원**: 홈 화면에 추가하여 앱처럼 사용 가능
- 🌙 **다크모드**: 시스템 설정에 따라 자동 전환
- 📈 **히스토리**: 분석한 음식 기록 관리

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 16.1.4 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist Sans, Geist Mono

### AI & Backend
- **AI Model**: Google Gemini Vision API
- **Server Actions**: Next.js Server Actions
- **Database**: IndexedDB (브라우저 로컬 DB)

### Development Tools
- **Linter**: ESLint 9
- **Package Manager**: npm
- **Build Tool**: Next.js (Turbopack)

---

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone <repository-url>
cd kcalcal
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 4. API 키 설정

1. 앱 실행 후 **설정** 페이지로 이동
2. [Google AI Studio](https://aistudio.google.com/app/apikey)에서 무료 API 키 발급
3. 발급받은 API 키를 설정 페이지에 입력 및 저장
4. 원하는 Gemini 모델 선택 (기본: gemini-1.5-flash)

> ⚠️ **중요**: API 키는 브라우저 로컬에만 저장되며, 외부로 전송되지 않습니다.

---

## 📱 사용 방법

### 기본 사용법

1. **홈 화면**에서 "스캔 시작하기" 클릭
2. **카메라 권한** 허용
3. 음식 사진 촬영
4. **분석하기** 버튼 클릭
5. AI가 분석한 **칼로리 및 영양소 정보** 확인
6. **저장하기**로 기록 보관

### 히스토리 관리

- **기록 보기**: 저장한 음식 기록 확인
- **총 칼로리**: 오늘 섭취한 총 칼로리 자동 계산
- **삭제**: 불필요한 기록 삭제

### 설정

- **API 키 관리**: Gemini API 키 입력/변경
- **모델 선택**: 사용할 Gemini 모델 선택
- **모델 목록 조회**: 사용 가능한 모델 확인

---

## 📱 PWA 설치 (모바일)

### Android (Chrome)

1. 앱 접속 후 우측 상단 메뉴(⋮) 클릭
2. **"홈 화면에 추가"** 선택
3. 이름 확인 후 **추가** 클릭
4. 홈 화면에 아이콘 생성됨

### iOS (Safari)

1. 앱 접속 후 하단 공유 버튼 클릭
2. **"홈 화면에 추가"** 선택
3. 이름 확인 후 **추가** 클릭
4. 홈 화면에 아이콘 생성됨

---

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

---

## 🌐 배포

### Vercel 배포 (권장)

1. [Vercel](https://vercel.com) 계정 생성
2. GitHub 저장소 연결
3. 자동 배포 완료
4. HTTPS 자동 적용

> 📖 상세한 배포 가이드는 [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) 참고

### USB 테스트 (개발용)

로컬 개발 시 실제 스마트폰에서 테스트하려면:

> 📖 [USB_TEST_GUIDE.md](./USB_TEST_GUIDE.md) 참고

---

## 🔒 개인정보 보호

### 데이터 저장 방식

- **API 키**: 브라우저 localStorage에 저장 (기기 로컬)
- **사진**: IndexedDB에 Base64로 저장 (기기 로컬)
- **식단 정보**: IndexedDB에 저장 (기기 로컬)

### 보안 특징

- ✅ 모든 데이터는 **사용자 기기에만 저장**
- ✅ 외부 서버로 **전송되지 않음**
- ✅ 다른 웹사이트에서 **접근 불가**
- ⚠️ 브라우저 데이터 삭제 시 **모든 기록 삭제됨**
- ⚠️ 공용 기기 사용 시 **주의 필요**

---

## 📂 프로젝트 구조

```
kcalcal/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── actions.ts          # Server Actions (AI 분석)
│   │   ├── page.tsx            # 홈 페이지
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── globals.css         # 글로벌 스타일
│   │   ├── manifest.ts         # PWA 매니페스트
│   │   ├── scan/               # 스캔 페이지
│   │   ├── history/            # 히스토리 페이지
│   │   └── settings/           # 설정 페이지
│   ├── components/             # React 컴포넌트
│   │   ├── camera-view.tsx     # 카메라 컴포넌트
│   │   └── food-result.tsx     # 결과 표시 컴포넌트
│   └── lib/                    # 유틸리티
│       ├── db.ts               # IndexedDB 관리
│       └── gemini.ts           # Gemini API 클라이언트
├── public/                     # 정적 파일
│   ├── icon.png                # PWA 아이콘
│   ├── icon-192x192.png
│   └── icon-512x512.png
└── package.json
```

---

## 🤝 기여하기

이슈 제보 및 풀 리퀘스트를 환영합니다!

---

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

---

## 🙏 감사의 말

- **Google Gemini AI**: 강력한 비전 AI 모델 제공
- **Next.js**: 훌륭한 React 프레임워크
- **Vercel**: 간편한 배포 플랫폼

---

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

---

**Made with ❤️ by KcalCal Team**
