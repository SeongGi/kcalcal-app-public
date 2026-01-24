"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllFoodRecords } from "@/lib/db";
import { calculateDailyStats, calculateGoalProgress } from "@/lib/statistics";

export default function Home() {
  const [todayCalories, setTodayCalories] = useState(0);
  const [goalCalories, setGoalCalories] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadTodayStats();
  }, []);

  const loadTodayStats = async () => {
    const records = await getAllFoodRecords();
    const today = new Date();
    const stats = calculateDailyStats(records, today);
    setTodayCalories(stats.totalCalories);

    const goal = parseInt(localStorage.getItem("goal_calories") || "2000");
    setGoalCalories(goal);

    const { percentage } = calculateGoalProgress(stats.totalCalories, goal);
    setProgress(Math.min(percentage, 100));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl opacity-50 animate-fade-in delay-100"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-secondary/30 rounded-full blur-3xl opacity-50 animate-fade-in delay-300"></div>
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50 animate-fade-in delay-500"></div>
      </div>

      <div className="z-10 w-full max-w-md flex flex-col items-center text-center space-y-8 animate-slide-up">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">
            KcalCal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
            주머니 속 AI 음식 분석기
          </p>
        </div>

        {/* Goal Progress */}
        {goalCalories > 0 && (
          <div className="glass-card p-6 w-full space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">오늘의 칼로리</span>
              <span className="text-sm font-medium">
                {todayCalories} / {goalCalories} kcal
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 text-center">{progress}% 달성</p>
          </div>
        )}

        <div className="glass-card p-6 w-full space-y-6">
          <div className="p-4 bg-surface rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-3 flex items-center justify-center text-3xl shadow-md">
              📸
            </div>
            <h3 className="text-xl font-bold mb-1">사진 분석</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              사진 한 장으로 칼로리를 즉시 확인하세요.
            </p>
          </div>

          <Link href="/scan" className="w-full block">
            <button className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]">
              스캔 시작하기
            </button>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/history" className="w-full block">
              <button className="w-full py-3 bg-surface border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                📋 기록
              </button>
            </Link>
            <Link href="/stats" className="w-full block">
              <button className="w-full py-3 bg-surface border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                📊 통계
              </button>
            </Link>
          </div>

          <Link href="/settings" className="w-full block">
            <button className="w-full py-3 text-gray-400 text-sm hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              ⚙️ 설정
            </button>
          </Link>
        </div>

        <p className="text-xs text-gray-400">
          Powered by Gemini Vision AI
        </p>
      </div>
    </main>
  );
}
