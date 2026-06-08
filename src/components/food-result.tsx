"use client";

import { useState } from "react";
import { searchFoodNutrition } from "@/lib/gemini";
import { searchLocalFood } from "@/lib/food-db";

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
    imageData?: string;
    onSave?: (timestamp: number) => void;
    onRetake?: () => void;
    onCorrect?: (correctedResult: FoodAnalysisResult) => void;
}

export default function FoodResult({ result, imageData, onSave, onRetake, onCorrect }: FoodResultProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedFoodName, setEditedFoodName] = useState(result.foodName || "");
    const [editedPortion, setEditedPortion] = useState(result.portionSize || "");
    const [isSearching, setIsSearching] = useState(false);
    const [isSavingToGallery, setIsSavingToGallery] = useState(false);

    // Date selection state
    const [showDatePicker, setShowDatePicker] = useState(false);
    // Initialize with current local time in YYYY-MM-DDTHH:mm format for input type="datetime-local"
    const [selectedDate, setSelectedDate] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });

    const handleCorrect = async () => {
        if (!editedFoodName.trim()) {
            alert("음식 이름을 입력해주세요.");
            return;
        }

        setIsSearching(true);

        // 1. 로컬 데이터베이스에서 음식 검색 시도
        const localMatch = searchLocalFood(editedFoodName);
        if (localMatch) {
            setIsSearching(false);
            setIsEditing(false);
            if (onCorrect) {
                onCorrect({
                    foodName: localMatch.foodName,
                    portionSize: editedPortion || localMatch.portionSize,
                    calories: localMatch.calories,
                    macronutrients: localMatch.macronutrients,
                    confidence: 0.95,
                    description: localMatch.description
                });
            }
            return;
        }

        // 2. 로컬 검색 실패 시, Gemini API 키가 존재하는 경우에만 클라우드 검색 시도 (폴백)
        const apiKey = localStorage.getItem("gemini_api_key");
        const modelName = localStorage.getItem("gemini_model") || "gemini-1.5-flash";

        if (apiKey) {
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
        } else {
            // 3. API 키가 없고 로컬 검색도 실패한 경우, 0칼로리로 임시 설정
            setIsSearching(false);
            setIsEditing(false);
            if (onCorrect) {
                onCorrect({
                    foodName: editedFoodName,
                    portionSize: editedPortion || "1인분",
                    calories: 0,
                    macronutrients: { carbs: 0, protein: 0, fat: 0, sugar: 0 },
                    confidence: 0.5,
                    description: "로컬 DB에서 영양 정보를 찾지 못했습니다. 설정에서 Gemini API 키를 등록하면 자동으로 검색이 가능합니다."
                });
            }
            alert("로컬 DB에서 음식을 찾지 못했습니다. 칼로리와 영양소가 0으로 설정되니 저장 시 참고해주세요.");
        }
    };

    const handleSaveClick = () => {
        setShowDatePicker(true);
    };

    const confirmSave = () => {
        if (onSave) {
            const timestamp = new Date(selectedDate).getTime();
            onSave(timestamp);
            setShowDatePicker(false);
        }
    };

    const formatDateForFilename = (timestamp: number): string => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}_${hours}${minutes}${seconds}`;
    };

    const saveToGallery = async () => {
        if (!imageData) {
            alert("저장할 이미지가 없습니다.");
            return;
        }

        setIsSavingToGallery(true);

        try {
            const timestamp = new Date(selectedDate).getTime();
            const fileName = `kcalcal_${formatDateForFilename(timestamp)}.jpg`;

            // Convert base64 to blob
            const response = await fetch(imageData);
            const blob = await response.blob();

            // Check if Web Share API is available (mobile)
            if (navigator.share && navigator.canShare) {
                const file = new File([blob], fileName, { type: 'image/jpeg' });

                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'KcalCal 음식 기록',
                        text: result.foodName || '음식 사진',
                    });
                } else {
                    // Fallback to download
                    downloadImage(imageData, fileName);
                }
            } else {
                // Desktop: Direct download
                downloadImage(imageData, fileName);
            }
        } catch (error: any) {
            // User cancelled or error occurred
            if (error.name !== 'AbortError') {
                console.error("Gallery save error:", error);
                alert("갤러리 저장에 실패했습니다.");
            }
        } finally {
            setIsSavingToGallery(false);
        }
    };

    const downloadImage = (dataUrl: string, filename: string) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    // Modal for Date Selection
    if (showDatePicker) {
        return (
            <div className="w-full max-w-md mx-auto p-6 space-y-4 animate-slide-up">
                <div className="glass-card p-6 space-y-6">
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">언제 드셨나요?</h3>
                        <p className="text-sm text-gray-500">기록할 날짜와 시간을 선택해주세요.</p>
                    </div>

                    <div>
                        <input
                            type="datetime-local"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full p-4 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 text-lg text-center outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowDatePicker(false)}
                            className="flex-1 py-4 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={confirmSave}
                            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            저장하기
                        </button>
                    </div>

                    {imageData && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={saveToGallery}
                                disabled={isSavingToGallery}
                                className="w-full py-3 rounded-xl bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSavingToGallery ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-green-800 dark:border-green-200 border-t-transparent rounded-full animate-spin"></div>
                                        처리 중...
                                    </>
                                ) : (
                                    <>
                                        📸 갤러리에도 저장
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-gray-400 text-center mt-2">
                                파일명: kcalcal_{formatDateForFilename(new Date(selectedDate).getTime())}.jpg
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )
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
                    종료/다시 찍기
                </button>
                <button
                    onClick={handleSaveClick}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    저장하기
                </button>
            </div>
        </div>
    );
}
