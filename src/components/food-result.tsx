"use client";

import { useState } from "react";
import { searchFoodNutrition } from "@/lib/gemini";

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
    onCorrect?: (correctedResult: FoodAnalysisResult) => void;
}

export default function FoodResult({ result, onSave, onRetake, onCorrect }: FoodResultProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedFoodName, setEditedFoodName] = useState(result.foodName || "");
    const [editedPortion, setEditedPortion] = useState(result.portionSize || "");
    const [isSearching, setIsSearching] = useState(false);

    const handleCorrect = async () => {
        if (!editedFoodName.trim()) {
            alert("음식 이름을 입력해주세요.");
            return;
        }

        setIsSearching(true);

        const apiKey = localStorage.getItem("gemini_api_key");
        const modelName = localStorage.getItem("gemini_model") || "gemini-1.5-flash";

        if (!apiKey) {
            alert("API 키가 필요합니다. 설정 페이지에서 입력해주세요.");
            setIsSearching(false);
            return;
        }

        const correctedResult = await searchFoodNutrition(
            editedFoodName,
            editedPortion,
            apiKey,
            modelName
        );

        setIsSearching(false);

        if (correctedResult.error) {
            alert(`오류: ${correctedResult.error}`);
        } else {
            setIsEditing(false);
            if (onCorrect) {
                onCorrect(correctedResult);
            }
        }
    };

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

    if (isEditing) {
        return (
            <div className="w-full max-w-md mx-auto p-6 space-y-4 animate-slide-up">
                <div className="glass-card p-6 space-y-4">
                    <h3 className="text-lg font-bold">음식 정보 수정</h3>
                    <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">음식 이름</label>
                        <input
                            type="text"
                            value={editedFoodName}
                            onChange={(e) => setEditedFoodName(e.target.value)}
                            className="w-full mt-1 p-3 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary"
                            placeholder="예: 김치찌개"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">분량</label>
                        <input
                            type="text"
                            value={editedPortion}
                            onChange={(e) => setEditedPortion(e.target.value)}
                            className="w-full mt-1 p-3 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary"
                            placeholder="예: 1그릇"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white font-medium"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleCorrect}
                            disabled={isSearching}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold disabled:opacity-50"
                        >
                            {isSearching ? "검색 중..." : "영양 정보 검색"}
                        </button>
                    </div>
                </div>
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

            {/* Correction Button */}
            <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 rounded-xl bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
            >
                ❓ 해당하는 음식이 아닌가요?
            </button>

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
