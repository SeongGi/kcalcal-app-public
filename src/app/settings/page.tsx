"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAvailableModels } from "@/lib/gemini";

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("");
    const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
    const [models, setModels] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Load saved settings
        const savedKey = localStorage.getItem("gemini_api_key");
        const savedModel = localStorage.getItem("gemini_model");
        if (savedKey) setApiKey(savedKey);
        if (savedModel) setSelectedModel(savedModel);
    }, []);

    const handleSaveKey = () => {
        localStorage.setItem("gemini_api_key", apiKey);
        setMessage("API 키가 저장되었습니다.");
        setTimeout(() => setMessage(""), 3000);
    };

    const handleSaveModel = () => {
        localStorage.setItem("gemini_model", selectedModel);
        setMessage("모델이 저장되었습니다.");
        setTimeout(() => setMessage(""), 3000);
    };

    const handleCheckModels = async () => {
        if (!apiKey) {
            setMessage("API 키를 먼저 입력해주세요.");
            return;
        }

        setLoading(true);
        setModels([]);
        setMessage("");

        const result = await getAvailableModels(apiKey);

        if (result.error) {
            setMessage(`오류: ${result.error}`);
        } else if (result.models) {
            setModels(result.models);
            setMessage(`모델 ${result.models.length}개를 찾았습니다.`);
        }
        setLoading(false);
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
                    기본 제공 키 대신 사용할 개인 API 키를 입력하세요.
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
                    저장하기
                </button>
            </div>

            {/* Model Selection Section */}
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
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (빠름)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (정확)</option>
                    <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (실험)</option>
                    <option value="gemini-3-flash-preview">Gemini 3 Flash Preview (최신)</option>
                </select>
                <button
                    onClick={handleSaveModel}
                    className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl"
                >
                    모델 저장
                </button>
            </div>

            {/* Model List Section */}
            <div className="glass-card p-6 space-y-4">
                <h2 className="text-lg font-bold">사용 가능한 모델 조회</h2>
                <p className="text-sm text-gray-500">
                    현재 키로 사용 가능한 모든 Gemini 모델 목록을 확인합니다.
                </p>
                <button
                    onClick={handleCheckModels}
                    disabled={loading}
                    className="w-full py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white font-medium rounded-xl disabled:opacity-50"
                >
                    {loading ? "조회 중..." : "전체 모델 목록 확인"}
                </button>

                {message && (
                    <p className="text-sm text-center font-medium text-primary p-2">
                        {message}
                    </p>
                )}

                {models.length > 0 && (
                    <div className="max-h-60 overflow-y-auto space-y-2 mt-4 bg-surface p-2 rounded-xl">
                        {models.map((model) => (
                            <div key={model.name} className="p-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
                                    {model.displayName}
                                </p>
                                <p className="text-xs text-gray-500 font-mono mt-1">
                                    {model.name.replace("models/", "")}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {model.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
