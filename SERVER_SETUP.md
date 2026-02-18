# 서버 기반 AI 백엔드 설정 가이드

## 환경변수 설정

### 로컬 개발 환경

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# Gemini API 키 (서버 전용)
GEMINI_API_KEY=your_gemini_api_key_here
```

> [!IMPORTANT]
> 이 API 키는 서버에서만 사용되며, 클라이언트에 노출되지 않습니다.

### Vercel 프로덕션 배포

1. Vercel 대시보드 접속
2. 프로젝트 선택 → Settings → Environment Variables
3. 다음 변수 추가:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: 실제 Gemini API 키
   - **Environment**: Production 체크

## 테스트 방법

### 로컬 테스트

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000/scan 접속
# 사진 촬영 후 분석 테스트
```

### Rate Limiting 테스트

같은 브라우저/IP에서:
1. 사진 분석 10회 실행
2. 11번째 시도 시 "일일 무료 분석 횟수를 초과했습니다" 메시지 확인
3. 내일 자동 리셋 확인

## Vercel 배포

```bash
# 프로덕션 배포
vercel --prod

# 배포 후 확인 사항:
# 1. https://kcalcal.seonggi.kr/scan 접속
# 2. 사진 분석 정상 작동 확인
# 3. Rate limit 정상 작동 확인
```

## 주요 변경사항

### 사용자 경험 개선
- ✅ API 키 입력 불필요 (자동으로 서버 키 사용)
- ✅ 앱 다운로드 후 바로 사용 가능
- ✅ 일일 10회 무료 분석 제공 (디바이스 기준)

### 기술적 변경
- 클라이언트 → 서버 API 호출로 변경
- Device ID 기반 Rate Limiting (브라우저별 고유 ID 자동 생성)
- IP 기반 제한보다 더 정확한 사용자 구분 가능

## 다음 단계 (Phase 2)

맥미니 구매 후:
1. Ollama 설치
2. Llama 3.2 Vision 모델 다운로드
3. API 엔드포인트 전환
4. 완전 무료, 무제한 사용으로 업그레이드
