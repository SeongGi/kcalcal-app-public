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

        setIsAnalyzing(true);
        try {
            // 디바이스 ID 확인 또는 생성
            let deviceId = localStorage.getItem("kcalcal_device_id");
            if (!deviceId) {
                deviceId = crypto.randomUUID();
                localStorage.setItem("kcalcal_device_id", deviceId);
            }

            // 서버 API 호출 (API 키 불필요)
            // Capacitor 앱에서는 절대경로 필요, 웹에서는 상대경로 사용
            const apiBase = typeof window !== 'undefined' && window.location.protocol === 'capacitor:'
                ? 'https://kcalcal.seonggi.kr'
                : '';
            const response = await fetch(`${apiBase}/api/analyze-food`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Device-Id': deviceId, // Rate limiting용 디바이스 ID
                },
                body: JSON.stringify({
                    imageData: capturedImage,
                    model: 'gemini-1.5-flash',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Rate limit 또는 기타 에러 처리
                if (response.status === 429) {
                    setAnalysisResult({
                        error: data.error || "일일 무료 분석 횟수를 초과했습니다.",
                    });
                } else {
                    setAnalysisResult({
                        error: data.error || "분석에 실패했습니다.",
                    });
                }
                return;
            }

            setAnalysisResult(data);
        } catch (error) {
            console.error("Analysis error:", error);
            setAnalysisResult({ error: "서버 연결에 실패했습니다." });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = async (timestamp?: number) => {
        if (!analysisResult || analysisResult.error || !capturedImage) return;

        try {
            await saveFoodRecord({
                timestamp: timestamp || Date.now(),
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
                        {analysisResult && (
                            <FoodResult
                                result={analysisResult}
                                imageData={capturedImage}
                                onSave={handleSave}
                                onRetake={handleRetake}
                                onCorrect={(correctedResult) => setAnalysisResult(correctedResult)}
                            />
                        )}
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
