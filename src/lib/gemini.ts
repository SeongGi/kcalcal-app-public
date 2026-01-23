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
    Analyze this food image and provide nutritional information.
    Return ONLY a JSON object (no markdown formatting) with the following structure:
    {
      "foodName": "Name of the food",
      "portionSize": "Estimated portion (e.g., 1 bowl, 200g)",
      "calories": number (kcal),
      "macronutrients": {
        "carbs": number (g),
        "protein": number (g),
        "fat": number (g),
        "sugar": number (g)
      },
      "confidence": number (0-1),
      "description": "Short description of the meal"
    }
    If it's not food, return { "error": "Not food detected" }.
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
