import { FoodRecord } from "./db";

export interface DailyStats {
    date: string;
    totalCalories: number;
    mealCount: number;
    avgCaloriesPerMeal: number;
    macronutrients: {
        carbs: number;
        protein: number;
        fat: number;
        sugar: number;
    };
}

export interface WeeklyStats {
    startDate: string;
    endDate: string;
    totalCalories: number;
    avgDailyCalories: number;
    dailyStats: DailyStats[];
    macronutrients: {
        carbs: number;
        protein: number;
        fat: number;
        sugar: number;
    };
}

/**
 * 특정 날짜의 통계 계산
 */
export function calculateDailyStats(records: FoodRecord[], date: Date): DailyStats {
    const dateStr = date.toISOString().split("T")[0];

    // 해당 날짜의 레코드만 필터링
    const dayRecords = records.filter((record) => {
        const recordDate = new Date(record.timestamp).toISOString().split("T")[0];
        return recordDate === dateStr;
    });

    const totalCalories = dayRecords.reduce((sum, r) => sum + r.calories, 0);
    const mealCount = dayRecords.length;

    const macronutrients = dayRecords.reduce(
        (acc, r) => ({
            carbs: acc.carbs + r.macronutrients.carbs,
            protein: acc.protein + r.macronutrients.protein,
            fat: acc.fat + r.macronutrients.fat,
            sugar: acc.sugar + r.macronutrients.sugar,
        }),
        { carbs: 0, protein: 0, fat: 0, sugar: 0 }
    );

    return {
        date: dateStr,
        totalCalories,
        mealCount,
        avgCaloriesPerMeal: mealCount > 0 ? Math.round(totalCalories / mealCount) : 0,
        macronutrients,
    };
}

/**
 * 최근 7일 통계 계산
 */
export function calculateWeeklyStats(records: FoodRecord[]): WeeklyStats {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const dailyStats: DailyStats[] = [];

    // 7일간의 통계 계산
    for (let i = 0; i < 7; i++) {
        const date = new Date(sevenDaysAgo);
        date.setDate(sevenDaysAgo.getDate() + i);
        dailyStats.push(calculateDailyStats(records, date));
    }

    const totalCalories = dailyStats.reduce((sum, day) => sum + day.totalCalories, 0);
    const avgDailyCalories = Math.round(totalCalories / 7);

    const macronutrients = dailyStats.reduce(
        (acc, day) => ({
            carbs: acc.carbs + day.macronutrients.carbs,
            protein: acc.protein + day.macronutrients.protein,
            fat: acc.fat + day.macronutrients.fat,
            sugar: acc.sugar + day.macronutrients.sugar,
        }),
        { carbs: 0, protein: 0, fat: 0, sugar: 0 }
    );

    return {
        startDate: sevenDaysAgo.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0],
        totalCalories,
        avgDailyCalories,
        dailyStats,
        macronutrients,
    };
}

/**
 * 목표 칼로리 대비 달성률 계산
 */
export function calculateGoalProgress(currentCalories: number, goalCalories: number): {
    percentage: number;
    remaining: number;
    status: "under" | "met" | "over";
} {
    const percentage = Math.round((currentCalories / goalCalories) * 100);
    const remaining = goalCalories - currentCalories;

    let status: "under" | "met" | "over";
    if (percentage < 90) status = "under";
    else if (percentage <= 110) status = "met";
    else status = "over";

    return {
        percentage,
        remaining,
        status,
    };
}
