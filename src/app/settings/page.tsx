"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { getAvailableModels } from "@/lib/gemini";
import { downloadBackup, restoreBackup } from "@/lib/backup";

interface GeminiModel {
    name: string;
    displayName: string;
    description: string;
    supportedGenerationMethods?: string[];
}

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("");
    const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
    const [models, setModels] = useState<GeminiModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [goalCalories, setGoalCalories] = useState("");
    const [backupLoading, setBackupLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isInitialMount = useRef(true);

    const loadModels = useCallback(async (key?: string) => {
        const keyToUse = key || apiKey;
        if (!keyToUse) {
            setMessage("API 키를 먼저 입력해주세요.");
            return;
        }

        setLoading(true);
        setMessage("");

        const result = await getAvailableModels(keyToUse);

        if (result.error) {
            setMessage(`오류: ${result.error}`);
            setModels([]);
        } else if (result.models) {
            // Filter only generative models (vision models)
            const generativeModels = result.models.filter((m: GeminiModel) =>
                m.supportedGenerationMethods?.includes("generateContent")
            );
            setModels(generativeModels);
            setMessage(`사용 가능한 모델 ${generativeModels.length}개를 불러왔습니다.`);
        }
        setLoading(false);
    }, [apiKey]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            // Load saved settings
            const savedKey = localStorage.getItem("gemini_api_key");
            const savedModel = localStorage.getItem("gemini_model");
            const savedGoal = localStorage.getItem("goal_calories");
            if (savedKey) {
                setApiKey(savedKey);
                // Auto-load models if key exists
                loadModels(savedKey);
            }
            if (savedModel) setSelectedModel(savedModel);
            if (savedGoal) setGoalCalories(savedGoal);
        }
    }, [loadModels]);

    const handleSaveKey = () => {
        localStorage.setItem("gemini_api_key", apiKey);
        setMessage("API 키가 저장되었습니다. 모델 목록을 불러옵니다...");
        setTimeout(() => loadModels(), 500);
    };

    const handleSaveModel = () => {
        localStorage.setItem("gemini_model", selectedModel);
        setMessage("모델이 저장되었습니다.");
        setTimeout(() => setMessage(""), 3000);
    };

    const handleSaveGoal = () => {
        const calories = parseInt(goalCalories);
        if (isNaN(calories) || calories <= 0) {
            setMessage("올바른 칼로리 값을 입력해주세요.");
            return;
        }
        localStorage.setItem("goal_calories", calories.toString());
        setMessage("목표 칼로리가 저장되었습니다.");
        setTimeout(() => setMessage(""), 3000);
    };

    const handleBackup = async () => {
        setBackupLoading(true);
        try {
            await downloadBackup();
            setMessage("백업 파일이 다운로드되었습니다.");
        } catch (error) {
            setMessage("백업에 실패했습니다.");
        } finally {
            setBackupLoading(false);
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setBackupLoading(true);
        try {
            const result = await restoreBackup(file);
            setMessage(result.message);
            if (result.success) {
                // Reload page after 2 seconds
                setTimeout(() => window.location.reload(), 2000);
            }
        } catch (error) {
            setMessage("복원에 실패했습니다.");
        } finally {
            setBackupLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20 p-6 space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/" className="text-gray-600 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <h1 className="text-2xl font-bold">설정</h1>
            </div>

            {/* API Key Section */}
            <div className="glass-card p-6 space-y-4">
                <h2 className="text-lg font-bold">Gemini API 키 설정</h2>
                <p className="text-sm text-gray-500">
                    개인 API 키를 입력하세요. 저장하면 자동으로 사용 가능한 모델 목록을 불러옵니다.
                </p>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AI Studio API Key 입력"
                    className="w-full p-4 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                    onClick={handleSaveKey}
                    className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl"
                >
                    저장하고 모델 불러오기
                </button>
            </div>

            {/* Model Selection Section */}
            {models.length > 0 && (
                <div className="glass-card p-6 space-y-4">
                    <h2 className="text-lg font-bold">모델 선택</h2>
                    <p className="text-sm text-gray-500">
                        음식 분석에 사용할 AI 모델을 선택하세요.
                    </p>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full p-4 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary"
                    >
                        {models.map((model) => (
                            <option key={model.name} value={model.name.replace("models/", "")}>
                                {model.displayName}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleSaveModel}
                        className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl"
                    >
                        모델 저장
                    </button>
                </div>
            )}

            {/* Message Display */}
            {message && (
                <div className="glass-card p-4">
                    <p className="text-sm text-center font-medium text-primary">
                        {message}
                    </p>
                </div>
            )}

            {/* Goal Calories Section */}
            <div className="glass-card p-6 space-y-4">
                <h2 className="text-lg font-bold">목표 칼로리 설정</h2>
                <p className="text-sm text-gray-500">
                    하루 목표 칼로리를 설정하세요.
                </p>
                <input
                    type="number"
                    value={goalCalories}
                    onChange={(e) => setGoalCalories(e.target.value)}
                    placeholder="예: 2000"
                    className="w-full p-4 rounded-xl bg-surface border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                    onClick={handleSaveGoal}
                    className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl"
                >
                    저장하기
                </button>
            </div>

            {/* Backup/Restore Section */}
            <div className="glass-card p-6 space-y-4">
                <h2 className="text-lg font-bold">데이터 백업 및 복원</h2>
                <p className="text-sm text-gray-500">
                    모든 식단 기록과 설정을 백업하거나 복원할 수 있습니다.
                </p>
                <button
                    onClick={handleBackup}
                    disabled={backupLoading}
                    className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl disabled:opacity-50"
                >
                    {backupLoading ? "백업 중..." : "백업 파일 다운로드"}
                </button>
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleRestore}
                        className="hidden"
                        id="restore-file"
                    />
                    <label
                        htmlFor="restore-file"
                        className="block w-full py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white font-medium rounded-xl text-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                        백업 파일에서 복원
                    </label>
                </div>
                <p className="text-xs text-gray-400 text-center">
                    ⚠️ 복원 시 기존 데이터에 추가됩니다
                </p>
            </div>

            {/* Reload Models Button */}
            {apiKey && (
                <div className="glass-card p-6 space-y-4">
                    <h2 className="text-lg font-bold">모델 목록 새로고침</h2>
                    <button
                        onClick={() => loadModels()}
                        disabled={loading}
                        className="w-full py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white font-medium rounded-xl disabled:opacity-50"
                    >
                        {loading ? "불러오는 중..." : "모델 목록 다시 불러오기"}
                    </button>
                </div>
            )}
        </div>
    );
}
