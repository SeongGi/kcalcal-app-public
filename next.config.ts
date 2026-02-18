import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Android 빌드 시에는 npm run build:android 사용 (output: export 포함)
  // Vercel 배포 시에는 이 설정 사용 (API Route 정상 작동)
};

export default nextConfig;
