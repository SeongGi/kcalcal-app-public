export const foodTranslationMap: Record<string, string> = {
    "banana": "바나나",
    "apple": "사과",
    "granny smith": "청사과",
    "pomegranate": "석류",
    "orange": "오렌지",
    "lemon": "레몬",
    "fig": "무화과",
    "pineapple": "파인애플",
    "jackfruit": "잭프루트",
    "custard apple": "커스터드 애플",
    "strawberry": "딸기",
    "pizza": "피자",
    "hotdog": "핫도그",
    "hot dog": "핫도그",
    "cheeseburger": "치즈버거",
    "hamburger": "햄버거",
    "bagel": "베이글",
    "pretzel": "프레첼",
    "carbonara": "까르보나라 파스타",
    "spaghetti": "스파게티",
    "burrito": "부리또",
    "taco": "타코",
    "guacamole": "과카몰리",
    "espresso": "에스프레소",
    "bell pepper": "파프리카",
    "broccoli": "브로콜리",
    "cabbage": "양배추",
    "cucumber": "오이",
    "mushroom": "버섯",
    "corn": "옥수수",
    "ice cream": "아이스크림",
    "icecream": "아이스크림",
    "red wine": "레드 와인",
    "consomme": "수프",
    "trifle": "디저트",
    "potpie": "미트파이",
    "meat loaf": "미트로프",
    "meatloaf": "미트로프",
    "bakery": "빵",
    "french loaf": "바게트 빵",
    "acorn squash": "단호박",
    "butternut squash": "땅콩호박",
    "zucchini": "애호박",
    "spaghetti squash": "국수호박",
    "cardoon": "아티초크",
    "artichoke": "아티초크",
    "plate": "음식 접시",
    "hot pot": "전골/찌개",
    "hotpot": "전골/찌개"
};

/**
 * Translates an English food label to Korean if mapped.
 * Otherwise, cleans up the label (e.g. comma separated values) and returns the first term.
 */
export function translateFoodName(englishName: string): string {
    const cleanName = englishName.toLowerCase().trim();
    
    // Check direct translation
    if (foodTranslationMap[cleanName]) {
        return foodTranslationMap[cleanName];
    }
    
    // Handle comma-separated lists from ImageNet (e.g. "Granny Smith, apple")
    const parts = cleanName.split(",").map(p => p.trim());
    for (const part of parts) {
        if (foodTranslationMap[part]) {
            return foodTranslationMap[part];
        }
    }
    
    // Default fallback to first part capitalized or as-is if it's too generic
    return parts[0] || englishName;
}
