# Vercel 배포 가이드

## 1단계: Vercel 계정 생성 및 설치

### 1.1 Vercel 계정 만들기
1. [vercel.com](https://vercel.com) 접속
2. **Sign Up** 클릭
3. GitHub 계정으로 로그인 (권장)

### 1.2 Vercel CLI 설치 (선택사항)
```bash
npm install -g vercel
```

---

## 2단계: 프로젝트 배포

### 방법 1: Vercel CLI 사용 (빠름)

#### 2.1 로그인
```bash
vercel login
```

#### 2.2 프로젝트 배포
```bash
cd /Users/seonggi/Desktop/PDS/dev/kcalcal
vercel
```

#### 2.3 질문에 답변
- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → 본인 계정 선택
- **Link to existing project?** → `N` (No)
- **What's your project's name?** → `kcalcal` (엔터)
- **In which directory is your code located?** → `./` (엔터)
- **Want to modify settings?** → `N` (No)

배포가 완료되면 URL이 표시됩니다 (예: `https://kcalcal-xxx.vercel.app`)

---

### 방법 2: Vercel 웹사이트 사용

#### 2.1 GitHub에 코드 푸시
```bash
cd /Users/seonggi/Desktop/PDS/dev/kcalcal
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/kcalcal.git
git push -u origin main
```

#### 2.2 Vercel에서 Import
1. [vercel.com/new](https://vercel.com/new) 접속
2. **Import Git Repository** 클릭
3. GitHub 저장소 선택 (`kcalcal`)
4. **Deploy** 클릭

---

## 3단계: 환경 변수 설정 (중요!)

### 3.1 Vercel 대시보드에서 설정
1. [vercel.com/dashboard](https://vercel.com/dashboard) 접속
2. 배포된 프로젝트 클릭
3. **Settings** → **Environment Variables** 클릭
4. 다음 변수 추가:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `your_api_key_here` (Google AI Studio에서 발급)
   - **Environment**: `Production`, `Preview`, `Development` 모두 체크
5. **Save** 클릭

### 3.2 재배포
환경 변수를 추가한 후 **Deployments** 탭에서 최신 배포를 선택하고 **Redeploy** 클릭

---

## 4단계: 안드로이드에서 PWA 설치

### 4.1 배포된 URL 접속
- Vercel에서 제공한 URL을 안드로이드 폰의 Chrome 브라우저로 접속
- 예: `https://kcalcal-xxx.vercel.app`

### 4.2 홈 화면에 추가
1. Chrome 주소창 우측 메뉴(⋮) 클릭
2. **"홈 화면에 추가"** 또는 **"앱 설치"** 선택
3. 이름 확인 후 **추가** 클릭

### 4.3 앱 실행
- 홈 화면에 생성된 KcalCal 아이콘 클릭
- 네이티브 앱처럼 전체 화면으로 실행됩니다

---

## 5단계: 사용 방법

### 음식 스캔하기
1. **스캔 시작하기** 버튼 클릭
2. 카메라 권한 허용
3. 음식 사진 촬영
4. **분석하기** 버튼 클릭
5. AI가 칼로리 및 영양소 분석
6. **저장하기** 클릭하여 기록 저장

### 기록 확인하기
1. 메인 화면에서 **기록 보기** 클릭
2. 저장된 음식 목록 확인
3. 오늘의 총 칼로리 확인
4. 삭제 버튼으로 기록 삭제 가능

---

## 문제 해결

### 카메라가 작동하지 않는 경우
- **원인**: HTTP 환경에서는 카메라 접근 불가
- **해결**: Vercel 배포 후 HTTPS URL에서만 사용 가능

### AI 분석이 실패하는 경우
- **원인**: API Key 미설정 또는 잘못된 키
- **해결**: Vercel 환경 변수에 올바른 `GEMINI_API_KEY` 설정 확인

### 저장이 안 되는 경우
- **원인**: 브라우저 저장소 권한 문제
- **해결**: Chrome 설정 → 사이트 설정 → 쿠키 및 사이트 데이터 허용

---

## 추가 팁

### 커스텀 도메인 연결
1. Vercel 프로젝트 → **Settings** → **Domains**
2. 본인 도메인 입력 (예: `kcalcal.com`)
3. DNS 설정에 Vercel 제공 레코드 추가

### 자동 배포 설정
- GitHub에 푸시할 때마다 자동으로 Vercel에 배포됩니다
- `main` 브랜치 → Production
- 다른 브랜치 → Preview 배포

### 로컬 테스트
```bash
npm run dev
# http://localhost:3000 에서 테스트
```

---

## 유용한 링크
- Vercel 대시보드: https://vercel.com/dashboard
- Google AI Studio (API Key 발급): https://aistudio.google.com/app/apikey
- Next.js 문서: https://nextjs.org/docs
