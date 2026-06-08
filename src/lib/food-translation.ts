export const foodTranslationMap: Record<string, string> = {
    // Food-101 categories
    "apple_pie": "사과",
    "baby_back_ribs": "등갈비 바베큐",
    "baklava": "디저트",
    "beef_carpaccio": "소고기 카르파초",
    "beef_tartare": "육회",
    "beet_salad": "비트 샐러드",
    "beignets": "도넛",
    "bibimbap": "비빔밥",
    "bread_pudding": "브레드 푸딩",
    "bruschetta": "부르스케타",
    "caesar_salad": "샐러드",
    "cannoli": "디저트",
    "caprese_salad": "카프레제 샐러드",
    "carrots": "당근",
    "ceviche": "세비체",
    "cheesecake": "치즈케이크",
    "cheese_plate": "치즈 플레이트",
    "chicken_curry": "카레라이스",
    "chicken_quesadilla": "퀘사디아",
    "chicken_wings": "후라이드 치킨",
    "chocolate_cake": "초콜릿 케이크",
    "chocolate_mousse": "초콜릿 무스",
    "churros": "츄러스",
    "clam_chowder": "수프",
    "club_sandwich": "샌드위치",
    "crab_cakes": "크랩 케이크",
    "creme_brulee": "크림 브륄레",
    "croque_madame": "크로크무슈",
    "cup_cakes": "컵케이크",
    "deviled_eggs": "계란말이",
    "donuts": "도넛",
    "dumplings": "군만두",
    "edamame": "에다마메",
    "eggs_benedict": "에그 베네딕트",
    "escargots": "달팽이 요리",
    "falafel": "팔라펠",
    "filet_mignon": "소불고기",
    "fish_and_chips": "모듬튀김",
    "foie_gras": "푸아그라",
    "french_fries": "모듬튀김",
    "french_onion_soup": "수프",
    "french_toast": "계란말이",
    "fried_calamari": "모듬튀김",
    "fried_rice": "볶음밥",
    "frozen_yogurt": "아이스크림",
    "garlic_bread": "마늘빵",
    "gnocchi": "뇨끼",
    "greek_salad": "샐러드",
    "grilled_cheese_sandwich": "샌드위치",
    "grilled_salmon": "생선구이",
    "guacamole": "과카몰리",
    "gyoza": "군만두",
    "hamburger": "햄버거",
    "hot_and_sour_soup": "수프",
    "hot_dog": "핫도그",
    "hummus": "후무스",
    "ice_cream": "아이스크림",
    "lasagna": "라자냐",
    "lobster_bisque": "수프",
    "lobster_roll_sandwich": "샌드위치",
    "macaroni_and_cheese": "맥앤치즈",
    "macarons": "마카롱",
    "miso_soup": "된장찌개",
    "mussels": "홍합탕",
    "nachos": "나초",
    "omelette": "계란말이",
    "onion_rings": "모듬튀김",
    "oysters": "굴",
    "pad_thai": "팟타이",
    "paella": "빠에야",
    "pancakes": "팬케이크",
    "panna_cotta": "푸딩",
    "peking_duck": "오리구이",
    "pho": "쌀국수",
    "pizza": "피자",
    "pork_chop": "제육볶음",
    "poutine": "감자튀김",
    "prime_rib": "소불고기",
    "pulled_pork_sandwich": "샌드위치",
    "ramen": "라면",
    "ravioli": "라비올리",
    "red_velvet_cake": "레드벨벳 케이크",
    "risotto": "리조또",
    "samosa": "사모사",
    "sashimi": "회",
    "scallops": "관자구이",
    "seaweed_salad": "해초샐러드",
    "spaghetti_bolognese": "토마토 파스타",
    "spaghetti_carbonara": "까르보나라 파스타",
    "spring_rolls": "춘권",
    "steak": "삼겹살 구이",
    "strawberry_food": "딸기",
    "sushi": "초밥",
    "tacos": "타코",
    "takoyaki": "타코야끼",
    "tiramisu": "티라미수",
    "tuna_tartare": "참치 타르타르",
    "waffles": "와플",
    
    // Older ImageNet categories fallback
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
    "hotdog": "핫도그",
    "cheeseburger": "치즈버거",
    "bagel": "베이글",
    "pretzel": "프레첼",
    "espresso": "에스프레소",
    "bell pepper": "파프리카",
    "broccoli": "브로콜리",
    "cabbage": "양배추",
    "cucumber": "오이",
    "mushroom": "버섯",
    "corn": "옥수수",
    "red wine": "레드 와인",
    "consomme": "수프",
    "trifle": "디저트",
    "potpie": "미트파이",
    "meat loaf": "미트로프",
    "bakery": "빵",
    "french loaf": "바게트 빵",
    "zucchini": "애호박",
    "plate": "음식 접시"
};

/**
 * Translates an English food label to Korean if mapped.
 * Otherwise, cleans up the label (e.g. comma separated values) and returns the first term.
 */
export function translateFoodName(englishName: string): string {
    const cleanName = englishName.toLowerCase().replace(/_/g, " ").trim();
    
    // Check direct translation
    if (foodTranslationMap[cleanName]) {
        return foodTranslationMap[cleanName];
    }
    
    // Check with underscore replaced by space
    const withUnderscores = englishName.toLowerCase().trim();
    if (foodTranslationMap[withUnderscores]) {
        return foodTranslationMap[withUnderscores];
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
