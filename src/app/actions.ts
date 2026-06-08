// 클라이언트에서 직접 호출하는 유틸리티 함수 (서버 API로 대체됨)

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getAvailableModels(apiKey?: string) {
    try {
        if (!apiKey) {
            return { error: "API 키를 설정해주세요. 설정 페이지에서 입력할 수 있습니다." };
        }

        // SDK doesn't expose listModels easily on client instance, using REST API for this utility
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            return { error: `모델 조회 실패: ${response.status} ${response.statusText}` };
        }

        const data = await response.json();
        return { models: data.models };
    } catch (error) {
        console.error("Model fetch error:", error);
        return { error: "모델 목록을 가져오는데 실패했습니다." };
    }
}

export async function analyzeFood(imageBase64: string, apiKey?: string, modelName: string = "gemini-1.5-flash") {
    if (!apiKey) {
        return { error: "API 키를 설정해주세요. 설정 페이지에서 Gemini API 키를 입력할 수 있습니다." };
    }

    try {
        const client = new GoogleGenerativeAI(apiKey);

        // Remove header if present (data:image/jpeg;base64,)
        const base64Data = imageBase64.split(",")[1] || imageBase64;

        const model = client.getGenerativeModel({ model: modelName });

        const prompt = `
    이 음식 이미지를 분석하여 영양 정보를 제공해주세요.
    반드시 JSON 형식으로만 답변하세요 (마크다운 형식 사용 금지):
    {
      "foodName": "음식 이름 (한국어로)",
      "portionSize": "예상 분량 (예: 1개, 2조각, 1그릇 등)",
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

        // Clean markdown if present (```json ... ```)
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        return { error: "이미지 분석에 실패했습니다. API 키나 모델을 확인해주세요." };
    }
}

export async function searchFoodNutritionOnline(foodName: string) {
    if (!foodName) return { error: "음식 이름을 입력해주세요." };
    
    try {
        console.log(`Searching online for food nutrition of: ${foodName}`);
        const response = await fetch(
            `https://www.fatsecret.kr/%EC%B9%BC%EB%A1%9C%EB%A6%AC-%EC%98%81%EC%96%91%EC%86%8C/search?q=${encodeURIComponent(foodName)}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        );
        
        if (!response.ok) {
            return { error: `검색 서버 연결 실패: ${response.status}` };
        }
        
        const html = await response.text();
        
        // Parse the HTML using regular expression
        const prominentRegex = /<a class="prominent"[^>]*>([^<]+)<\/a>[\s\S]*?<div class="smallText[^>]*>([\s\S]*?)<\/div>/;
        const match = prominentRegex.exec(html);
        
        if (!match) {
            return { error: "인터넷 검색 결과가 없습니다." };
        }
        
        const name = match[1].trim();
        const nutritionText = match[2].replace(/\s+/g, " ").trim();
        
        // Parse portion, calories, fat, carbs, protein
        // e.g., "1 인분당 - 칼로리: 495kcal | 지방: 10.08g | 탄수화물: 85.86g | 단백질: 10.99g"
        const portionMatch = nutritionText.match(/^([^-]+)-/);
        const caloriesMatch = nutritionText.match(/칼로리:\s*([\d\.]+)kcal/);
        const fatMatch = nutritionText.match(/지방:\s*([\d\.]+)g/);
        const carbsMatch = nutritionText.match(/탄수화물:\s*([\d\.]+)g/);
        const proteinMatch = nutritionText.match(/단백질:\s*([\d\.]+)g/);
        
        if (!caloriesMatch) {
            return { error: "검색 정보 파싱 실패" };
        }
        
        const portion = portionMatch ? portionMatch[1].replace(/당$/, "").trim() : "1인분";
        const calories = Math.round(parseFloat(caloriesMatch[1]));
        const fat = fatMatch ? Math.round(parseFloat(fatMatch[1])) : 0;
        const carbs = carbsMatch ? Math.round(parseFloat(carbsMatch[1])) : 0;
        const protein = proteinMatch ? Math.round(parseFloat(proteinMatch[1])) : 0;
        const sugar = Math.round(carbs * 0.1); // Estimate sugar
        
        return {
            foodName: name,
            portionSize: portion,
            calories,
            macronutrients: { carbs, protein, fat, sugar },
            confidence: 0.9,
            description: `인터넷 검색 결과 (${name})`
        };
    } catch (error: any) {
        console.error("Online search error:", error);
        return { error: `인터넷 검색 중 오류 발생: ${error.message}` };
    }
}
