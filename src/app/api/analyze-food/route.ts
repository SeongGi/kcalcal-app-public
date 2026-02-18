import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

export const runtime = 'nodejs';
export const maxDuration = 60; // 최대 60초 실행

interface AnalysisResult {
    foodName?: string;
    portionSize?: string;
    calories?: number;
    macronutrients?: {
        carbs: number;
        protein: number;
        fat: number;
        sugar: number;
    };
    confidence?: number;
    description?: string;
    error?: string;
}

export async function POST(request: NextRequest) {
    try {
        // Rate limiting 체크 (Device ID 우선, 없으면 IP)
        const deviceId = request.headers.get('x-device-id');
        const clientIp = getClientIp(request.headers);

        // 식별자 결정: Device ID가 있으면 그것을, 없으면 IP 사용
        const identifier = deviceId || clientIp;

        const rateLimitResult = checkRateLimit(identifier, 10); // 일일 10회 제한

        if (!rateLimitResult.success) {
            const resetDate = new Date(rateLimitResult.resetAt);
            return NextResponse.json(
                {
                    error: '일일 무료 분석 횟수를 초과했습니다.',
                    message: `다음 리셋 시간: ${resetDate.toLocaleString('ko-KR')}`,
                    resetAt: rateLimitResult.resetAt,
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
                    }
                }
            );
        }

        // API 키 확인
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: '서버 설정 오류: API 키가 설정되지 않았습니다.' },
                { status: 500 }
            );
        }

        // 요청 본문 파싱
        const body = await request.json();
        const { imageData, model = 'gemini-1.5-flash' } = body;

        if (!imageData) {
            return NextResponse.json(
                { error: '이미지 데이터가 필요합니다.' },
                { status: 400 }
            );
        }

        // Gemini API 호출
        const genAI = new GoogleGenerativeAI(apiKey);
        const geminiModel = genAI.getGenerativeModel({ model });

        const prompt = `다음 음식 사진을 분석하여 정확한 영양 정보를 JSON 형식으로 제공해주세요.

응답 형식:
{
  "foodName": "음식 이름 (한국어)",
  "portionSize": "1인분, 150g 등",
  "calories": 500,
  "macronutrients": {
    "carbs": 60,
    "protein": 25,
    "fat": 15,
    "sugar": 10
  },
  "confidence": 0.85,
  "description": "간단한 설명"
}

주의사항:
- 음식이 여러 개면 총합으로 계산
- 정확한 g 단위 영양소 값 제공
- confidence는 0-1 사이 값
- 순수 JSON만 반환 (마크다운 없이)`;

        const imagePart = {
            inlineData: {
                data: imageData.split(',')[1], // Remove data:image/xxx;base64, prefix
                mimeType: 'image/jpeg',
            },
        };

        const result = await geminiModel.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // JSON 파싱
        let analysisResult: AnalysisResult;
        try {
            // Remove markdown code blocks if present
            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysisResult = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            console.error('Raw response:', text);
            return NextResponse.json(
                { error: 'AI 응답 파싱 실패', rawResponse: text },
                { status: 500 }
            );
        }

        // 성공 응답
        return NextResponse.json(analysisResult, {
            headers: {
                'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
            },
        });

    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            {
                error: '분석 중 오류가 발생했습니다.',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
