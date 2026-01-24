"use client";

import { useEffect, useState } from "react";
import { getAllFoodRecords, deleteFoodRecord, FoodRecord } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

export default function HistoryPage() {
    const [records, setRecords] = useState<FoodRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState<FoodRecord | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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
                            {mounted && new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 총 섭취량
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
                            {/* Clickable area for details */}
                            <div
                                className="flex gap-4 flex-1 cursor-pointer"
                                onClick={() => setSelectedRecord(record)}
                            >
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
                                        {mounted && new Date(record.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(record.id!);
                                }}
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

            {/* Detail Modal */}
            {selectedRecord && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
                    onClick={() => setSelectedRecord(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">영양 정보 상세</h2>
                            <button
                                onClick={() => setSelectedRecord(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Image */}
                            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                                <Image
                                    src={selectedRecord.imageData}
                                    alt={selectedRecord.foodName}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Food Info */}
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">{selectedRecord.foodName}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{selectedRecord.portionSize}</p>
                                <p className="text-sm text-gray-400">
                                    {mounted && new Date(selectedRecord.timestamp).toLocaleString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            {/* Calories */}
                            <div className="glass-card p-6 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">총 칼로리</p>
                                <p className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {selectedRecord.calories}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">kcal</p>
                            </div>

                            {/* Macronutrients */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-lg">영양소 구성</h4>

                                {/* Carbs */}
                                <div className="glass-card p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-primary">탄수화물</span>
                                        <span className="text-2xl font-bold text-primary">{selectedRecord.macronutrients.carbs}g</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((selectedRecord.macronutrients.carbs / 300) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Protein */}
                                <div className="glass-card p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-secondary">단백질</span>
                                        <span className="text-2xl font-bold text-secondary">{selectedRecord.macronutrients.protein}g</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-secondary h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((selectedRecord.macronutrients.protein / 100) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Fat */}
                                <div className="glass-card p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-accent">지방</span>
                                        <span className="text-2xl font-bold text-accent">{selectedRecord.macronutrients.fat}g</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-accent h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((selectedRecord.macronutrients.fat / 70) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Sugar */}
                                <div className="glass-card p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-pink-500">당</span>
                                        <span className="text-2xl font-bold text-pink-500">{selectedRecord.macronutrients.sugar}g</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((selectedRecord.macronutrients.sugar / 50) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {selectedRecord.description && (
                                <div className="glass-card p-4">
                                    <h4 className="font-bold mb-2">설명</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedRecord.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
