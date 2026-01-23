"use client";

import { useState } from "react";
import CameraView from "@/components/camera-view";
import FoodResult from "@/components/food-result";
import Image from "next/image";
import Link from "next/link";
import { analyzeFood } from "@/lib/gemini";
import { saveFoodRecord } from "@/lib/db";


interface AnalysisResult {
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


export default function ScanPage() {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    const handleCapture = (imageData: string) => {
        setCapturedImage(imageData);
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setIsAnalyzing(false);
        setAnalysisResult(null);
    };

    const handleAnalyze = async () => {
        if (!capturedImage) return;

        // API Key is required
        const apiKey = localStorage.getItem("gemini_api_key");
        if (!apiKey) {
            setAnalysisResult({
                error: "API 키가 필요합니다. 설정 페이지에서 Gemini API 키를 입력해주세요."
            });
            return;
        }

        setIsAnalyzing(true);
        try {
            const selectedModel = localStorage.getItem("gemini_model") || "gemini-1.5-flash";
            const result = await analyzeFood(capturedImage, apiKey, selectedModel);
            setAnalysisResult(result);
        } catch (error) {
            console.error("Analysis error:", error);
            setAnalysisResult({ error: "Failed to analyze image" });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = async () => {
        if (!analysisResult || analysisResult.error || !capturedImage) return;

        try {
            await saveFoodRecord({
                timestamp: Date.now(),
                imageData: capturedImage,
                foodName: analysisResult.foodName || "Unknown",
                portionSize: analysisResult.portionSize || "N/A",
                calories: analysisResult.calories || 0,
                macronutrients: analysisResult.macronutrients || {
                    carbs: 0,
                    protein: 0,
                    fat: 0,
                    sugar: 0,
                },
                confidence: analysisResult.confidence,
                description: analysisResult.description,
            });
            alert("저장되었습니다!");
            handleRetake();
        } catch (error) {
            console.error("Save error:", error);
            alert("저장에 실패했습니다");
        }
    };


    return (
        <div className="h-screen w-full bg-black flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                <Link href="/" className="text-white/80 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Link>
                <span className="text-white font-medium tracking-wide">음식 스캔</span>
                <div className="w-8"></div> {/* Spacer for centering */}
            </div>

            <div className="flex-1 relative overflow-hidden">
                {!capturedImage ? (
                    <CameraView onCapture={handleCapture} />
                ) : analysisResult ? (
                    <div className="w-full h-full bg-background overflow-y-auto flex items-center">
                        <FoodResult
                            result={analysisResult}
                            onSave={handleSave}
                            onRetake={handleRetake}
                        />
                    </div>
                ) : (
                    <div className="relative w-full h-full bg-gray-900">
                        <Image
                            src={capturedImage}
                            alt="Captured Food"
                            fill
                            className="object-cover"
                        />

                        {/* Review Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-4">
                            {isAnalyzing ? (
                                <div className="w-full py-8 flex flex-col items-center justify-center space-y-4 animate-pulse">
                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-white font-medium">음식 분석 중...</p>
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleRetake}
                                        className="flex-1 py-4 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors"
                                    >
                                        다시 찍기
                                    </button>
                                    <button
                                        onClick={handleAnalyze}
                                        className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                                    >
                                        분석하기
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
