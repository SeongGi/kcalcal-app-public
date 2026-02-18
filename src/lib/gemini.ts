import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper function to robustly extract and parse JSON from AI response
function extractJSON(text: string): any {
    try {
        // 1. Remove markdown code blocks
        let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

        // 2. Try to extract JSON object if there's extra text
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleaned = jsonMatch[0];
        }

        return JSON.parse(cleaned);
    } catch (error) {
        console.error("JSON Parsing Failed. Raw text:", text);
        throw new Error("AI 응답을 처리하는 중 오류가 발생했습니다 (JSON 파싱 실패).");
    }
}

export async function analyzeFood(
    imageBase64: string,
    apiKey: string,
    modelName: string = "gemini-1.5-flash"
) {
    if (!apiKey) {
        return { error: "API 키를 설정해주세요. 설정 페이지에서 입력할 수 있습니다." };
    }

    try {
        const client = new GoogleGenerativeAI(apiKey);
        const base64Data = imageBase64.split(",")[1] || imageBase64;
        const model = client.getGenerativeModel({ model: modelName });

        const prompt = `
    이 음식 이미지를 분석하여 영양 정보를 제공해주세요.
    반드시 JSON 형식으로만 답변하세요 (마크다운 형식 사용 금지):
    {
      "foodName": "음식 이름 (한국어로)",
      "portionSize": "예상 분량 (예: 1개, 2조각, 1그릇 등 - 개수 단위 사용)",
      "calories": 칼로리 숫자 (kcal),
      "macronutrients": {
        "carbs": 탄수화물 숫자 (g),
        "protein": 단백질 숫자 (g),
        "fat": 지방 숫자 (g),
        "sugar": 당 숫자 (g)
      },
      "confidence": 신뢰도 (0-1 사이 숫자),
      "description": "음식에 대한 짧은 설명 (한국어로)"
    }
    음식이 아닌 경우 { "error": "음식이 감지되지 않았습니다" }를 반환하세요.
    `;

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        return extractJSON(text);
    } catch (error: unknown) {
        console.error("AI Analysis Error:", error);
        const errorMessage = error instanceof Error ? error.message : "이미지 분석에 실패했습니다. API 키나 모델을 확인해주세요.";
        return {
            error: errorMessage
        };
    }
}

export async function searchFoodNutrition(
    foodName: string,
    portionSize: string,
    apiKey: string,
    modelName: string = "gemini-1.5-flash"
) {
    if (!apiKey) {
        return { error: "API 키를 설정해주세요." };
    }

    try {
        const client = new GoogleGenerativeAI(apiKey);
        const model = client.getGenerativeModel({ model: modelName });

        const prompt = `
    "${foodName}" (분량: ${portionSize})의 영양 정보를 제공해주세요.
    
    반드시 아래 JSON 형식으로만 답변하세요. 마크다운 형식을 사용하지 마세요:
    {
      "foodName": "${foodName}",
      "portionSize": "${portionSize}",
      "calories": 칼로리_숫자,
      "macronutrients": {
        "carbs": 탄수화물_숫자,
        "protein": 단백질_숫자,
        "fat": 지방_숫자,
        "sugar": 당_숫자
      },
      "confidence": 0.85,
      "description": "영양 정보 출처나 설명"
    }
    
    모든 숫자는 정수로 제공하고, 문자열이 아닌 숫자 타입으로 작성하세요.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const parsed = extractJSON(text);

        // Ensure all required fields exist with proper types
        return {
            foodName: parsed.foodName || foodName,
            portionSize: parsed.portionSize || portionSize,
            calories: Number(parsed.calories) || 0,
            macronutrients: {
                carbs: Number(parsed.macronutrients?.carbs) || 0,
                protein: Number(parsed.macronutrients?.protein) || 0,
                fat: Number(parsed.macronutrients?.fat) || 0,
                sugar: Number(parsed.macronutrients?.sugar) || 0,
            },
            confidence: Number(parsed.confidence) || 0.8,
            description: parsed.description || "영양 정보 검색 결과"
        };
    } catch (error: unknown) {
        console.error("Nutrition Search Error:", error);
        const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
        return {
            error: `영양 정보 검색에 실패했습니다: ${errorMessage}`
        };
    }
}

export async function getAvailableModels(apiKey: string) {
    if (!apiKey) {
        return { error: "API 키를 설정해주세요." };
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        if (!response.ok) {
            return { error: `모델 조회 실패: ${response.status} ${response.statusText}` };
        }

        const data = await response.json();
        return { models: data.models };
    } catch (error: unknown) {
        console.error("Model fetch error:", error);
        return { error: "모델 목록을 가져오는데 실패했습니다." };
    }
}
