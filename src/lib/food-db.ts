export interface FoodNutrition {
    foodName: string;
    portionSize: string;
    calories: number;
    macronutrients: {
        carbs: number;
        protein: number;
        fat: number;
        sugar: number;
    };
    description: string;
}

export const localFoodDB: Record<string, FoodNutrition> = {
    // === 주식 (밥류) ===
    "쌀밥": {
        foodName: "쌀밥",
        portionSize: "1공기 (약 200g)",
        calories: 300,
        macronutrients: { carbs: 65, protein: 6, fat: 1, sugar: 0 },
        description: "흰 쌀밥 한 공기 기준. 에너지를 공급하는 대표적인 탄수화물 급원입니다."
    },
    "현미밥": {
        foodName: "현미밥",
        portionSize: "1공기 (약 200g)",
        calories: 290,
        macronutrients: { carbs: 62, protein: 7, fat: 2, sugar: 0 },
        description: "현미밥 한 공기 기준. 식이섬유와 비타민 B군이 풍부합니다."
    },
    "잡곡밥": {
        foodName: "잡곡밥",
        portionSize: "1공기 (약 200g)",
        calories: 300,
        macronutrients: { carbs: 63, protein: 7, fat: 2, sugar: 0 },
        description: "여러 가지 잡곡을 섞은 밥 한 공기 기준."
    },
    "공기밥": {
        foodName: "공기밥",
        portionSize: "1공기 (약 200g)",
        calories: 300,
        macronutrients: { carbs: 65, protein: 6, fat: 1, sugar: 0 },
        description: "일반적인 음식점 공기밥 기준."
    },
    "김밥": {
        foodName: "김밥",
        portionSize: "1줄 (약 250g)",
        calories: 480,
        macronutrients: { carbs: 80, protein: 12, fat: 12, sugar: 2 },
        description: "일반 야채김밥 한 줄 기준. 단무지, 당근, 계란, 시금치 등이 들어있습니다."
    },
    "야채김밥": {
        foodName: "야채김밥",
        portionSize: "1줄 (약 250g)",
        calories: 420,
        macronutrients: { carbs: 75, protein: 10, fat: 9, sugar: 2 },
        description: "햄 등을 제외한 야채 위주의 김밥 한 줄 기준."
    },
    "참치김밥": {
        foodName: "참치김밥",
        portionSize: "1줄 (약 300g)",
        calories: 560,
        macronutrients: { carbs: 82, protein: 18, fat: 18, sugar: 3 },
        description: "마요네즈와 버무린 참치가 듬뿍 든 김밥 한 줄 기준."
    },
    "돈까스김밥": {
        foodName: "돈까스김밥",
        portionSize: "1줄 (약 300g)",
        calories: 580,
        macronutrients: { carbs: 85, protein: 16, fat: 20, sugar: 4 },
        description: "돈까스가 들어간 김밥 한 줄 기준."
    },
    "삼각김밥": {
        foodName: "삼각김밥",
        portionSize: "1개 (약 100g)",
        calories: 180,
        macronutrients: { carbs: 35, protein: 4, fat: 2.5, sugar: 1 },
        description: "편의점 삼각김밥 1개 기준."
    },
    "비빔밥": {
        foodName: "비빔밥",
        portionSize: "1대접 (약 400g)",
        calories: 550,
        macronutrients: { carbs: 90, protein: 16, fat: 14, sugar: 8 },
        description: "각종 나물과 고추장, 참기름을 섞은 한식 비빔밥 기준."
    },
    "돌솥비빔밥": {
        foodName: "돌솥비빔밥",
        portionSize: "1대접 (약 450g)",
        calories: 600,
        macronutrients: { carbs: 95, protein: 18, fat: 16, sugar: 8 },
        description: "뜨거운 돌솥에 나오는 비빔밥 기준."
    },
    "김치볶음밥": {
        foodName: "김치볶음밥",
        portionSize: "1인분 (약 350g)",
        calories: 500,
        macronutrients: { carbs: 85, protein: 12, fat: 12, sugar: 5 },
        description: "김치와 밥을 기름에 볶은 김치볶음밥 기준 (계란후라이 포함)."
    },
    "볶음밥": {
        foodName: "볶음밥",
        portionSize: "1인분 (약 350g)",
        calories: 550,
        macronutrients: { carbs: 88, protein: 14, fat: 15, sugar: 3 },
        description: "야채와 햄 등을 함께 볶은 일반 볶음밥 기준."
    },
    "제육덮밥": {
        foodName: "제육덮밥",
        portionSize: "1인분 (약 450g)",
        calories: 680,
        macronutrients: { carbs: 98, protein: 28, fat: 19, sugar: 12 },
        description: "매콤한 제육볶음을 올린 덮밥 기준."
    },
    "불고기덮밥": {
        foodName: "불고기덮밥",
        portionSize: "1인분 (약 450g)",
        calories: 630,
        macronutrients: { carbs: 95, protein: 26, fat: 16, sugar: 14 },
        description: "달콤짭조름한 소불고기를 밥 위에 올린 덮밥 기준."
    },
    "오므라이스": {
        foodName: "오므라이스",
        portionSize: "1인분 (약 400g)",
        calories: 620,
        macronutrients: { carbs: 92, protein: 16, fat: 20, sugar: 10 },
        description: "볶음밥을 계란 지단으로 감싸고 소스를 얹은 오므라이스 기준."
    },
    "카레라이스": {
        foodName: "카레라이스",
        portionSize: "1인분 (약 400g)",
        calories: 520,
        macronutrients: { carbs: 88, protein: 14, fat: 12, sugar: 8 },
        description: "카레 소스와 밥을 곁들인 한 그릇 기준."
    },

    // === 찌개 및 국류 ===
    "김치찌개": {
        foodName: "김치찌개",
        portionSize: "1대접 (약 250g)",
        calories: 150,
        macronutrients: { carbs: 10, protein: 11, fat: 8, sugar: 4 },
        description: "돼지고기와 두부, 김치가 들어간 칼칼한 찌개."
    },
    "된장찌개": {
        foodName: "된장찌개",
        portionSize: "1대접 (약 250g)",
        calories: 120,
        macronutrients: { carbs: 12, protein: 7, fat: 5, sugar: 3 },
        description: "두부, 버섯, 호박 등을 넣고 된장으로 구수하게 끓인 찌개."
    },
    "순두부찌개": {
        foodName: "순두부찌개",
        portionSize: "1대접 (약 250g)",
        calories: 140,
        macronutrients: { carbs: 8, protein: 10, fat: 7.5, sugar: 2 },
        description: "부드러운 순두부와 고춧가루 양념으로 끓여낸 찌개."
    },
    "부대찌개": {
        foodName: "부대찌개",
        portionSize: "1인분 (약 350g)",
        calories: 350,
        macronutrients: { carbs: 18, protein: 20, fat: 22, sugar: 5 },
        description: "햄, 소시지, 라면사리 등이 들어간 얼큰한 부대찌개 기준."
    },
    "미역국": {
        foodName: "미역국",
        portionSize: "1대접 (약 250g)",
        calories: 70,
        macronutrients: { carbs: 5, protein: 4, fat: 3.5, sugar: 0 },
        description: "참기름에 볶은 미역으로 끓인 소고기 미역국 기준."
    },
    "콩나물국": {
        foodName: "콩나물국",
        portionSize: "1대접 (약 250g)",
        calories: 30,
        macronutrients: { carbs: 4, protein: 2, fat: 0.5, sugar: 0 },
        description: "맑고 시원하게 끓여낸 콩나물국 기준."
    },
    "설렁탕": {
        foodName: "설렁탕",
        portionSize: "1대접 (약 400g)",
        calories: 220,
        macronutrients: { carbs: 2, protein: 24, fat: 12, sugar: 0 },
        description: "소고기 뼈를 우려낸 뽀얀 국물과 소고기 편육 기준 (밥 제외)."
    },
    "삼계탕": {
        foodName: "삼계탕",
        portionSize: "0.5마리 (약 500g)",
        calories: 450,
        macronutrients: { carbs: 25, protein: 42, fat: 20, sugar: 1 },
        description: "인삼, 찹쌀을 넣고 푹 곤 닭고기 보양식 기준."
    },
    "뼈다귀해장국": {
        foodName: "뼈다귀해장국",
        portionSize: "1인분 (약 500g)",
        calories: 430,
        macronutrients: { carbs: 12, protein: 38, fat: 25, sugar: 3 },
        description: "돼지 등뼈와 우거지를 푹 끓여낸 해장국 기준 (밥 제외)."
    },

    // === 구이 및 볶음 반찬 ===
    "제육볶음": {
        foodName: "제육볶음",
        portionSize: "1접시 (약 200g)",
        calories: 350,
        macronutrients: { carbs: 14, protein: 24, fat: 22, sugar: 8 },
        description: "돼지고기를 고추장 양념에 볶아낸 요리."
    },
    "소불고기": {
        foodName: "소불고기",
        portionSize: "1접시 (약 200g)",
        calories: 310,
        macronutrients: { carbs: 16, protein: 25, fat: 16, sugar: 12 },
        description: "얇게 썬 소고기를 간장 양념에 재워 구운 요리."
    },
    "삼겹살 구이": {
        foodName: "삼겹살 구이",
        portionSize: "1인분 (약 200g)",
        calories: 650,
        macronutrients: { carbs: 1, protein: 34, fat: 57, sugar: 0 },
        description: "노릇하게 구운 돼지 삼겹살 기준."
    },
    "삼겹살": {
        foodName: "삼겹살",
        portionSize: "1인분 (약 200g)",
        calories: 650,
        macronutrients: { carbs: 1, protein: 34, fat: 57, sugar: 0 },
        description: "돼지 삼겹살 구이 기준."
    },
    "목살 구이": {
        foodName: "목살 구이",
        portionSize: "1인분 (약 200g)",
        calories: 400,
        macronutrients: { carbs: 1, protein: 38, fat: 27, sugar: 0 },
        description: "지방이 삼겹살보다 적어 담백한 목살 구이 기준."
    },
    "계란말이": {
        foodName: "계란말이",
        portionSize: "1접시 (약 150g)",
        calories: 220,
        macronutrients: { carbs: 4, protein: 14, fat: 16, sugar: 1 },
        description: "야채를 섞어 둥글게 말아 구운 계란말이."
    },
    "잡채": {
        foodName: "잡채",
        portionSize: "1접시 (약 150g)",
        calories: 280,
        macronutrients: { carbs: 46, protein: 5, fat: 8.5, sugar: 8 },
        description: "당면과 야채, 고기를 함께 볶아낸 한식 면 요리."
    },

    // === 면류 ===
    "라면": {
        foodName: "라면",
        portionSize: "1봉지 (약 500g, 조리 후)",
        calories: 500,
        macronutrients: { carbs: 80, protein: 10, fat: 15, sugar: 4 },
        description: "일반 국물 라면 한 그릇 기준."
    },
    "짜장면": {
        foodName: "짜장면",
        portionSize: "1그릇 (약 650g)",
        calories: 780,
        macronutrients: { carbs: 120, protein: 22, fat: 24, sugar: 16 },
        description: "춘장 소스와 쫄깃한 면발의 중식 짜장면 기준."
    },
    "짬뽕": {
        foodName: "짬뽕",
        portionSize: "1그릇 (약 700g)",
        calories: 680,
        macronutrients: { carbs: 100, protein: 28, fat: 18, sugar: 8 },
        description: "야채와 해산물을 얼큰하게 볶아 끓여낸 중식 짬뽕 기준."
    },
    "우동": {
        foodName: "우동",
        portionSize: "1그릇 (약 500g)",
        calories: 420,
        macronutrients: { carbs: 85, protein: 12, fat: 3, sugar: 2 },
        description: "가쓰오부시 국물의 맑은 우동 기준."
    },
    "칼국수": {
        foodName: "칼국수",
        portionSize: "1그릇 (약 600g)",
        calories: 540,
        macronutrients: { carbs: 98, protein: 18, fat: 8, sugar: 2 },
        description: "소고기나 멸치 육수에 밀가루 손칼국수를 끓여낸 기준."
    },
    "물냉면": {
        foodName: "물냉면",
        portionSize: "1그릇 (약 600g)",
        calories: 460,
        macronutrients: { carbs: 96, protein: 12, fat: 3, sugar: 12 },
        description: "살얼음 동동 띄운 시원한 물냉면 기준."
    },
    "비빔냉면": {
        foodName: "비빔냉면",
        portionSize: "1그릇 (약 500g)",
        calories: 520,
        macronutrients: { carbs: 105, protein: 13, fat: 5, sugar: 18 },
        description: "매콤한 양념장에 비벼 먹는 냉면 기준."
    },
    "까르보나라 파스타": {
        foodName: "까르보나라 파스타",
        portionSize: "1인분 (약 350g)",
        calories: 650,
        macronutrients: { carbs: 75, protein: 22, fat: 28, sugar: 4 },
        description: "베이컨, 치즈, 크림/달걀 노른자로 맛을 낸 파스타."
    },
    "토마토 파스타": {
        foodName: "토마토 파스타",
        portionSize: "1인분 (약 350g)",
        calories: 480,
        macronutrients: { carbs: 82, protein: 14, fat: 10, sugar: 8 },
        description: "신선한 토마토 소스로 맛을 낸 스파게티."
    },
    "알리오올리오": {
        foodName: "알리오올리오",
        portionSize: "1인분 (약 300g)",
        calories: 510,
        macronutrients: { carbs: 72, protein: 10, fat: 20, sugar: 1 },
        description: "올리브 오일과 마늘, 페페론치노로 가볍게 볶은 파스타."
    },

    // === 양식 / 패스트푸드 / 분식 ===
    "피자": {
        foodName: "피자",
        portionSize: "1조각 (약 100g)",
        calories: 266,
        macronutrients: { carbs: 32, protein: 11, fat: 10, sugar: 4 },
        description: "일반적인 콤비네이션 피자 한 조각 기준."
    },
    "핫도그": {
        foodName: "핫도그",
        portionSize: "1개 (약 120g)",
        calories: 290,
        macronutrients: { carbs: 30, protein: 10, fat: 14, sugar: 6 },
        description: "밀가루 반죽을 입혀 튀겨낸 소시지 핫도그 기준."
    },
    "치즈버거": {
        foodName: "치즈버거",
        portionSize: "1개 (약 150g)",
        calories: 350,
        macronutrients: { carbs: 33, protein: 17, fat: 16, sugar: 6 },
        description: "치즈와 소고기 패티가 들어간 햄버거 기준."
    },
    "햄버거": {
        foodName: "햄버거",
        portionSize: "1개 (약 160g)",
        calories: 320,
        macronutrients: { carbs: 35, protein: 15, fat: 13, sugar: 5 },
        description: "기본 소고기 패티 햄버거 기준."
    },
    "후라이드 치킨": {
        foodName: "후라이드 치킨",
        portionSize: "1조각 (약 100g)",
        calories: 290,
        macronutrients: { carbs: 8, protein: 18, fat: 20, sugar: 0 },
        description: "바삭하게 튀겨낸 후라이드 치킨 한 조각 기준."
    },
    "양념치킨": {
        foodName: "양념치킨",
        portionSize: "1조각 (약 110g)",
        calories: 340,
        macronutrients: { carbs: 18, protein: 17, fat: 21, sugar: 8 },
        description: "달콤 매콤한 소스를 바른 치킨 한 조각 기준."
    },
    "샌드위치": {
        foodName: "샌드위치",
        portionSize: "1개 (약 180g)",
        calories: 350,
        macronutrients: { carbs: 38, protein: 14, fat: 15, sugar: 4 },
        description: "햄, 치즈, 채소가 들어간 식빵 샌드위치 기준."
    },
    "떡볶이": {
        foodName: "떡볶이",
        portionSize: "1인분 (약 250g)",
        calories: 370,
        macronutrients: { carbs: 75, protein: 7, fat: 4, sugar: 15 },
        description: "고추장 소스에 떡과 어묵을 넣고 졸인 한국 분식."
    },
    "순대": {
        foodName: "순대",
        portionSize: "1인분 (약 200g)",
        calories: 320,
        macronutrients: { carbs: 48, protein: 9, fat: 10, sugar: 1 },
        description: "당면과 야채를 넣어 찐 한국식 순대 기준."
    },
    "모듬튀김": {
        foodName: "모듬튀김",
        portionSize: "1인분 (약 150g)",
        calories: 400,
        macronutrients: { carbs: 42, protein: 5, fat: 23, sugar: 2 },
        description: "오징어, 김말이, 야채 튀김 등 분식점 튀김 모듬."
    },

    // === 과일류 ===
    "바나나": {
        foodName: "바나나",
        portionSize: "1개 (중, 약 120g)",
        calories: 105,
        macronutrients: { carbs: 27, protein: 1.3, fat: 0.4, sugar: 14 },
        description: "칼륨이 풍부하고 소화가 잘 되는 과일입니다."
    },
    "사과": {
        foodName: "사과",
        portionSize: "1개 (중, 약 150g)",
        calories: 78,
        macronutrients: { carbs: 21, protein: 0.4, fat: 0.2, sugar: 16 },
        description: "비타민 C와 펙틴(식이섬유)이 풍부하여 아침 식사에 좋습니다."
    },
    "오렌지": {
        foodName: "오렌지",
        portionSize: "1개 (중, 약 130g)",
        calories: 62,
        macronutrients: { carbs: 15, protein: 1.2, fat: 0.2, sugar: 12 },
        description: "비타민 C가 가득해 면역력 증진에 좋은 상큼한 과일."
    },
    "딸기": {
        foodName: "딸기",
        portionSize: "10개 (약 150g)",
        calories: 50,
        macronutrients: { carbs: 12, protein: 1, fat: 0.3, sugar: 7 },
        description: "낮은 칼로리와 상큼한 맛을 자랑하는 베리류 과일."
    },
    "방울토마토": {
        foodName: "방울토마토",
        portionSize: "15개 (약 150g)",
        calories: 25,
        macronutrients: { carbs: 5, protein: 1.2, fat: 0.1, sugar: 3.5 },
        description: "라이코펜 성분이 풍부한 대표적인 다이어트 식품."
    },
    "토마토": {
        foodName: "토마토",
        portionSize: "1개 (대, 약 200g)",
        calories: 35,
        macronutrients: { carbs: 8, protein: 1.8, fat: 0.2, sugar: 5 },
        description: "수분 보충과 항산화에 탁월한 건강 채소/과일."
    },
    "포도": {
        foodName: "포도",
        portionSize: "1송이 (소, 약 200g)",
        calories: 140,
        macronutrients: { carbs: 36, protein: 1.5, fat: 0.3, sugar: 30 },
        description: "달콤하며 유기산이 풍부해 피로 회복에 효과적입니다."
    },

    // === 채소류 ===
    "브로콜리": {
        foodName: "브로콜리",
        portionSize: "1접시 (데친 것, 약 100g)",
        calories: 35,
        macronutrients: { carbs: 7, protein: 2.8, fat: 0.4, sugar: 1.5 },
        description: "비타민 C와 설포라판 성분이 든 대표적인 슈퍼푸드."
    },
    "오이": {
        foodName: "오이",
        portionSize: "1개 (약 100g)",
        calories: 15,
        macronutrients: { carbs: 3.5, protein: 0.7, fat: 0.1, sugar: 1.5 },
        description: "수분 함량이 95% 이상으로 디톡스 및 수분 보충에 좋습니다."
    },
    "샐러드": {
        foodName: "샐러드",
        portionSize: "1인분 (양상추/채소 믹스, 약 100g)",
        calories: 20,
        macronutrients: { carbs: 4, protein: 1.5, fat: 0.2, sugar: 1.8 },
        description: "드레싱을 제외한 맑은 야채 샐러드 믹스 기준."
    },
    "닭가슴살 샐러드": {
        foodName: "닭가슴살 샐러드",
        portionSize: "1인분 (약 250g)",
        calories: 180,
        macronutrients: { carbs: 12, protein: 22, fat: 4.5, sugar: 4 },
        description: "닭가슴살(100g)과 샐러드 야채가 포함된 다이어트 식단."
    },

    // === 음료 / 주류 ===
    "아메리카노": {
        foodName: "아메리카노",
        portionSize: "1잔 (약 350ml)",
        calories: 10,
        macronutrients: { carbs: 1, protein: 0.5, fat: 0, sugar: 0 },
        description: "에스프레소 샷에 물을 탄 무가당 커피 음료."
    },
    "카페라떼": {
        foodName: "카페라떼",
        portionSize: "1잔 (약 350ml)",
        calories: 120,
        macronutrients: { carbs: 9, protein: 7, fat: 6, sugar: 8 },
        description: "에스프레소에 부드러운 우유를 섞은 커피 음료."
    },
    "콜라": {
        foodName: "콜라",
        portionSize: "1캔 (250ml)",
        calories: 110,
        macronutrients: { carbs: 27, protein: 0, fat: 0, sugar: 27 },
        description: "당류 함량이 높은 탄산음료 한 캔 기준."
    },
    "제로콜라": {
        foodName: "제로콜라",
        portionSize: "1캔 (250ml)",
        calories: 0,
        macronutrients: { carbs: 0, protein: 0, fat: 0, sugar: 0 },
        description: "대체 감미료를 사용하여 칼로리가 거의 없는 제로 슈거 탄산음료."
    },
    "우유": {
        foodName: "우유",
        portionSize: "1팩 (200ml)",
        calories: 130,
        macronutrients: { carbs: 9, protein: 6, fat: 7, sugar: 9 },
        description: "칼슘과 단백질이 풍부한 일반 전지우유 기준."
    },
    "맥주": {
        foodName: "맥주",
        portionSize: "1캔 (500ml)",
        calories: 240,
        macronutrients: { carbs: 18, protein: 2, fat: 0, sugar: 0 },
        description: "일반 라거 맥주 한 캔 기준."
    },
    "소주": {
        foodName: "소주",
        portionSize: "1병 (360ml)",
        calories: 400,
        macronutrients: { carbs: 0, protein: 0, fat: 0, sugar: 0 },
        description: "한국의 알코올 도수 약 16.5도 희석식 소주 한 병 기준."
    }
};

/**
 * Clean string for matching (remove spaces, tabs, lowercases).
 */
function cleanString(str: string): string {
    return str.replace(/\s+/g, "").trim().toLowerCase();
}

/**
 * Search the local database for a food using exact and partial matching.
 * Returns null if no match found.
 */
export function searchLocalFood(query: string): FoodNutrition | null {
    if (!query) return null;
    const cleanQuery = cleanString(query);
    
    // 1. Exact match (without spaces)
    for (const key of Object.keys(localFoodDB)) {
        const cleanKey = cleanString(key);
        if (cleanKey === cleanQuery) {
            return localFoodDB[key];
        }
    }
    
    // 2. Partial match (query is part of DB key, e.g. "김치" -> "김치찌개")
    for (const key of Object.keys(localFoodDB)) {
        const cleanKey = cleanString(key);
        if (cleanKey.includes(cleanQuery)) {
            return localFoodDB[key];
        }
    }
    
    // 3. Reverse partial match (DB key is part of query, e.g. "신라면" -> "라면")
    for (const key of Object.keys(localFoodDB)) {
        const cleanKey = cleanString(key);
        if (cleanQuery.includes(cleanKey)) {
            return localFoodDB[key];
        }
    }
    
    return null;
}
