import { GoogleGenerativeAI } from "@google/generative-ai";

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

        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonString);
    } catch (error: any) {
        console.error("AI Analysis Error:", error);
        return {
            error: error.message || "이미지 분석에 실패했습니다. API 키나 모델을 확인해주세요."
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
    "${foodName}" (분량: ${portionSize})의 영양 정보를 인터넷에서 검색하여 제공해주세요.
    반드시 JSON 형식으로만 답변하세요:
    {
      "foodName": "${foodName}",
      "portionSize": "${portionSize}",
      "calories": 칼로리 숫자 (kcal),
      "macronutrients": {
        "carbs": 탄수화물 숫자 (g),
        "protein": 단백질 숫자 (g),
        "fat": 지방 숫자 (g),
        "sugar": 당 숫자 (g)
      },
      "confidence": 0.9,
      "description": "영양 정보 출처 설명"
    }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonString);
    } catch (error: any) {
        console.error("Nutrition Search Error:", error);
        return {
            error: error.message || "영양 정보 검색에 실패했습니다."
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
    } catch (error: any) {
        console.error("Model fetch error:", error);
        return { error: "모델 목록을 가져오는데 실패했습니다." };
    }
}
