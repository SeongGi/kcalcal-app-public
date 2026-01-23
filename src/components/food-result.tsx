"use client";

interface FoodAnalysisResult {
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

interface FoodResultProps {
    result: FoodAnalysisResult;
    onSave?: () => void;
    onRetake?: () => void;
}

export default function FoodResult({ result, onSave, onRetake }: FoodResultProps) {
    if (result.error) {
        return (
            <div className="w-full max-w-md mx-auto p-6 space-y-4">
                <div className="glass-card p-6 text-center space-y-3">
                    <div className="text-5xl">⚠️</div>
                    <h3 className="text-xl font-bold text-red-500">분석 실패</h3>
                    <p className="text-gray-600 dark:text-gray-400">{result.error}</p>
                </div>
                <button
                    onClick={onRetake}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-4 animate-slide-up">
            {/* Food Name & Portion */}
            <div className="glass-card p-6 space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {result.foodName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{result.portionSize}</p>
                {result.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-200 dark:border-gray-700">
                        {result.description}
                    </p>
                )}
            </div>

            {/* Calories */}
            <div className="glass-card p-6 text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {result.calories}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">kcal</p>
            </div>

            {/* Macronutrients */}
            {result.macronutrients && (
                <div className="glass-card p-6 space-y-3">
                    <h3 className="font-bold text-lg mb-3">영양소</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-surface rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-primary">{result.macronutrients.carbs}g</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">탄수화물</div>
                        </div>
                        <div className="bg-surface rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-secondary">{result.macronutrients.protein}g</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">단백질</div>
                        </div>
                        <div className="bg-surface rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-accent">{result.macronutrients.fat}g</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">지방</div>
                        </div>
                        <div className="bg-surface rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-pink-500">{result.macronutrients.sugar}g</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">당</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confidence */}
            {result.confidence && (
                <div className="text-center text-xs text-gray-400">
                    신뢰도: {Math.round(result.confidence * 100)}%
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-2">
                <button
                    onClick={onRetake}
                    className="flex-1 py-4 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                    다시 찍기
                </button>
                <button
                    onClick={onSave}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    저장하기
                </button>
            </div>
        </div>
    );
}
