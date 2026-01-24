"use client";

import { useEffect, useState } from "react";
import { getAllFoodRecords, FoodRecord } from "@/lib/db";
import { calculateDailyStats, calculateWeeklyStats, DailyStats, WeeklyStats } from "@/lib/statistics";
import Link from "next/link";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function StatsPage() {
    const [records, setRecords] = useState<FoodRecord[]>([]);
    const [tab, setTab] = useState<"daily" | "weekly">("daily");
    const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
    const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getAllFoodRecords();
            setRecords(data);

            const today = new Date();
            const daily = calculateDailyStats(data, today);
            const weekly = calculateWeeklyStats(data);

            setDailyStats(daily);
            setWeeklyStats(weekly);
        } catch (error) {
            console.error("Failed to load stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const weeklyChartData = weeklyStats
        ? {
            labels: weeklyStats.dailyStats.map((d) => {
                const date = new Date(d.date);
                return `${date.getMonth() + 1}/${date.getDate()}`;
            }),
            datasets: [
                {
                    label: "칼로리 (kcal)",
                    data: weeklyStats.dailyStats.map((d) => d.totalCalories),
                    backgroundColor: "rgba(255, 107, 107, 0.8)",
                },
            ],
        }
        : null;

    const macroChartData = (tab === "daily" ? dailyStats : weeklyStats)
        ? {
            labels: ["탄수화물", "단백질", "지방", "당"],
            datasets: [
                {
                    data: [
                        (tab === "daily" ? dailyStats : weeklyStats)!.macronutrients.carbs,
                        (tab === "daily" ? dailyStats : weeklyStats)!.macronutrients.protein,
                        (tab === "daily" ? dailyStats : weeklyStats)!.macronutrients.fat,
                        (tab === "daily" ? dailyStats : weeklyStats)!.macronutrients.sugar,
                    ],
                    backgroundColor: [
                        "rgba(255, 107, 107, 0.8)",
                        "rgba(78, 205, 196, 0.8)",
                        "rgba(255, 230, 109, 0.8)",
                        "rgba(255, 159, 243, 0.8)",
                    ],
                },
            ],
        }
        : null;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 glass p-4 flex justify-between items-center">
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <h1 className="text-xl font-bold">통계</h1>
                <div className="w-6"></div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-400">로딩 중...</div>
                </div>
            ) : (
                <div className="p-4 space-y-6">
                    {/* Tabs */}
                    <div className="flex gap-2 bg-surface p-1 rounded-xl">
                        <button
                            onClick={() => setTab("daily")}
                            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${tab === "daily"
                                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            오늘
                        </button>
                        <button
                            onClick={() => setTab("weekly")}
                            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${tab === "weekly"
                                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            주간
                        </button>
                    </div>

                    {/* Daily Stats */}
                    {tab === "daily" && dailyStats && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass-card p-4 text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">총 칼로리</p>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        {dailyStats.totalCalories}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">kcal</p>
                                </div>
                                <div className="glass-card p-4 text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">식사 횟수</p>
                                    <p className="text-3xl font-bold text-secondary">{dailyStats.mealCount}</p>
                                    <p className="text-xs text-gray-400 mt-1">회</p>
                                </div>
                            </div>

                            {macroChartData && (
                                <div className="glass-card p-6">
                                    <h3 className="font-bold text-lg mb-4">영양소 분포</h3>
                                    <div className="max-w-xs mx-auto">
                                        <Doughnut data={macroChartData} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">탄수화물</p>
                                            <p className="font-bold text-primary">{dailyStats.macronutrients.carbs}g</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">단백질</p>
                                            <p className="font-bold text-secondary">{dailyStats.macronutrients.protein}g</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">지방</p>
                                            <p className="font-bold text-accent">{dailyStats.macronutrients.fat}g</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">당</p>
                                            <p className="font-bold text-pink-500">{dailyStats.macronutrients.sugar}g</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Weekly Stats */}
                    {tab === "weekly" && weeklyStats && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass-card p-4 text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">주간 총 칼로리</p>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        {weeklyStats.totalCalories}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">kcal</p>
                                </div>
                                <div className="glass-card p-4 text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">일평균 칼로리</p>
                                    <p className="text-3xl font-bold text-secondary">{weeklyStats.avgDailyCalories}</p>
                                    <p className="text-xs text-gray-400 mt-1">kcal</p>
                                </div>
                            </div>

                            {weeklyChartData && (
                                <div className="glass-card p-6">
                                    <h3 className="font-bold text-lg mb-4">주간 칼로리 추이</h3>
                                    <Bar
                                        data={weeklyChartData}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            )}

                            {macroChartData && (
                                <div className="glass-card p-6">
                                    <h3 className="font-bold text-lg mb-4">주간 영양소 합계</h3>
                                    <div className="max-w-xs mx-auto">
                                        <Doughnut data={macroChartData} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">탄수화물</p>
                                            <p className="font-bold text-primary">{weeklyStats.macronutrients.carbs}g</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">단백질</p>
                                            <p className="font-bold text-secondary">{weeklyStats.macronutrients.protein}g</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">지방</p>
                                            <p className="font-bold text-accent">{weeklyStats.macronutrients.fat}g</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">당</p>
                                            <p className="font-bold text-pink-500">{weeklyStats.macronutrients.sugar}g</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
