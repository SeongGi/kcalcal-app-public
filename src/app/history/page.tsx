"use client";

import { useEffect, useState } from "react";
import { getAllFoodRecords, deleteFoodRecord, FoodRecord } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

export default function HistoryPage() {
    const [records, setRecords] = useState<FoodRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        try {
            const data = await getAllFoodRecords();
            setRecords(data.sort((a, b) => b.timestamp - a.timestamp));
        } catch (error) {
            console.error("Failed to load records:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("이 기록을 삭제하시겠습니까?")) return;
        try {
            await deleteFoodRecord(id);
            loadRecords();
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const getTotalCalories = () => {
        return records.reduce((sum, r) => sum + r.calories, 0);
    };

    const getTotalCarbs = () => {
        return records.reduce((sum, r) => sum + r.macronutrients.carbs, 0);
    };

    const getTotalProtein = () => {
        return records.reduce((sum, r) => sum + r.macronutrients.protein, 0);
    };

    const getTotalFat = () => {
        return records.reduce((sum, r) => sum + r.macronutrients.fat, 0);
    };

    const getTotalSugar = () => {
        return records.reduce((sum, r) => sum + r.macronutrients.sugar, 0);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 glass p-4 flex justify-between items-center">
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <h1 className="text-xl font-bold">기록</h1>
                <div className="w-6"></div>
            </div>

            {/* Summary Card */}
            {records.length > 0 && (
                <div className="p-4 space-y-3">
                    <div className="glass-card p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center">
                            {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 총 섭취량
                        </p>

                        {/* Total Calories */}
                        <div className="text-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {getTotalCalories()}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">kcal</p>
                        </div>

                        {/* Macronutrients Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-surface rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-primary">{getTotalCarbs()}g</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">탄수화물</p>
                            </div>
                            <div className="bg-surface rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-secondary">{getTotalProtein()}g</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">단백질</p>
                            </div>
                            <div className="bg-surface rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-accent">{getTotalFat()}g</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">지방</p>
                            </div>
                            <div className="bg-surface rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-pink-500">{getTotalSugar()}g</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">당</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Records List */}
            <div className="p-4 space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-400">불러오는 중...</div>
                ) : records.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                        <div className="text-6xl">📭</div>
                        <p className="text-gray-500 dark:text-gray-400">아직 기록이 없습니다</p>
                        <Link href="/scan" className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                            스캔 시작하기
                        </Link>
                    </div>
                ) : (
                    records.map((record) => (
                        <div key={record.id} className="glass-card p-4 flex gap-4 animate-fade-in">
                            {/* Thumbnail */}
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-800">
                                <Image
                                    src={record.imageData}
                                    alt={record.foodName}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg truncate">{record.foodName}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{record.portionSize}</p>
                                <div className="flex gap-3 mt-2 text-xs">
                                    <span className="font-semibold text-primary">{record.calories} kcal</span>
                                    <span className="text-gray-400">C: {record.macronutrients.carbs}g</span>
                                    <span className="text-gray-400">P: {record.macronutrients.protein}g</span>
                                    <span className="text-gray-400">F: {record.macronutrients.fat}g</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(record.timestamp).toLocaleString()}
                                </p>
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDelete(record.id!)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
