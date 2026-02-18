# 구글 플레이 스토어 배포 가이드 (TWA)

이 가이드는 KcalCal PWA를 TWA(Trusted Web Activity) 방식을 사용하여 안드로이드 앱으로 패키징하고 구글 플레이 스토어에 배포하는 과정을 안내합니다.

## 준비 사항

1.  **Node.js**: 설치되어 있어야 합니다. (이미 설치되어 있을 것입니다.)
2.  **Java & Android SDK**: 앱 빌드에 필요합니다.
    *   안드로이드 스튜디오(Android Studio)가 없다면 설치하는 것이 가장 확실한 방법입니다.
3.  **구글 플레이 콘솔 계정**: 개발자 계정 등록이 필요합니다 ($25 일회성 비용).

## 1단계: 서명 키(Signing Key) 생성 (로컬)

앱 업데이트 권한을 유지하기 위해 보안 키를 직접 관리해야 합니다. 터미널에서 프로젝트 폴더(`/Users/seonggi/Desktop/PDS/dev/kcalcal`)로 이동하여 다음 명령어를 실행하세요:

```bash
mkdir -p android
keytool -genkeypair -v \
  -keystore android/release.keystore \
  -alias android \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "kcalcal_secure_password_2024!" \
  -keypass "kcalcal_secure_password_2024!" \
  -dname "CN=KcalCal, OU=App, O=SeongGi, L=Seoul, ST=Seoul, C=KR"
```

> [!IMPORTANT]
> **`android/release.keystore` 파일을 반드시 백업해 두세요!** 이 파일을 분실하면 플레이 스토어에서 앱을 영구적으로 업데이트할 수 없게 됩니다.

## 2단계: 도메인 소유권 확인 설정

1.  **SHA-256 지문(Fingerprint) 확인**:
    생성한 키의 정보를 확인하기 위해 다음 명령어를 실행합니다:
    ```bash
    keytool -list -v -keystore android/release.keystore
    ```
    비밀번호(`kcalcal_secure_password_2024!`)를 입력하세요.
    출력 내용 중 `SHA256:`으로 시작하는 줄을 찾아 16진수 문자열을 복사합니다 (예: `12:34:AB:CD...`).

2.  **`assetlinks.json` 파일 수정**:
    *   `public/.well-known/assetlinks.json` 파일을 엽니다.
    *   `"REPLACE_WITH_YOUR_SHA256_FINGERPRINT"` 부분을 복사한 실제 SHA-256 값으로 교체합니다.

3.  **웹 배포**:
    수정된 파일이 웹 상에서 접근 가능하도록 배포합니다. (`https://kcalcal.seonggi.kr/.well-known/assetlinks.json` 주소로 접근 가능해야 합니다.)
    ```bash
    vercel --prod
    ```

## 3단계: 안드로이드 앱 빌드 (TWA)

`bubblewrap` 도구를 사용하여 앱을 빌드합니다.

1.  **Bubblewrap CLI 설치**:
    ```bash
    npm install -g @bubblewrap/cli
    ```

2.  **초기화 및 빌드**:
    이미 `twa-manifest.json` 설정 파일을 준비해 두었으므로, 다음 명령어로 빌드를 시도합니다:
    ```bash
    npx @bubblewrap/cli build
    ```
    *   JDK나 Android SDK 경로를 묻는 경우, 설치된 경로를 입력하세요.
    *   설치가 필요하다고 나오면 동의하고 설치를 진행하세요.

3.  **결과물 확인**:
    빌드가 완료되면 `.aab` (Android App Bundle) 파일이 생성됩니다. 이 파일이 플레이 스토어에 업로드할 파일입니다.

## 4단계: 구글 플레이 콘솔 업로드

1.  **앱 만들기**: 플레이 콘솔에 로그인하여 '앱 만들기'를 클릭합니다.
2.  **앱 설정**: 앱 이름(KcalCal), 언어(한국어) 등의 정보를 입력합니다.
3.  **출시**:
    *   **테스트 > 내부 테스트** (먼저 이 트랙을 권장합니다)로 이동합니다.
    *   새 버전 만들기를 선택합니다.
    *   생성된 `.aab` 파일을 업로드합니다.
4.  **스토어 등록정보**: 앱 아이콘, 스크린샷, 설명을 업로드합니다.
5.  **개인정보처리방침**: 카메라를 사용하는 앱이므로 개인정보처리방침 URL을 반드시 입력해야 합니다.

## 문제 해결

-   **"Digital Asset Links verification failed" 오류**: `assetlinks.json` 파일이 실제 웹 사이트에 잘 배포되었는지, 그리고 내용에 있는 SHA-256 값이 키스토어의 값과 일치하는지 확인하세요. (구글 플레이 앱 서명을 사용하는 경우, 구글 콘솔에 표시된 SHA-256 값도 `assetlinks.json`에 추가해야 할 수 있습니다.)
