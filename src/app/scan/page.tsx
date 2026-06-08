"use client";

import { useState } from "react";
import CameraView from "@/components/camera-view";
import FoodResult from "@/components/food-result";
import Image from "next/image";
import Link from "next/link";
import { analyzeFood as analyzeFoodWithGemini } from "@/lib/gemini";
import { saveFoodRecord } from "@/lib/db";
import { classifyImageLocally } from "@/lib/local-ai";
import { translateFoodName } from "@/lib/food-translation";
import { searchLocalFood } from "@/lib/food-db";


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
    const [analysisStatus, setAnalysisStatus] = useState("");
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
        setAnalysisStatus("로컬 AI 엔진 구동 및 음식 식별 중...");
        
        const geminiApiKey = localStorage.getItem("gemini_api_key");
        const geminiModel = localStorage.getItem("gemini_model") || "gemini-1.5-flash";

        try {
            // 1. 온디바이스 로컬 AI (MobileNet)로 분석 시도
            console.log("Starting local AI classification...");
            const predictions = await classifyImageLocally(capturedImage);
            console.log("Local AI predictions:", predictions);

            let matchedFood = null;
            let translatedName = "";

            if (predictions && predictions.length > 0) {
                // 상위 예측값들을 순서대로 검색
                for (const pred of predictions) {
                    translatedName = translateFoodName(pred);
                    console.log(`Checking local DB for: ${translatedName} (translated from ${pred})`);
                    const dbResult = searchLocalFood(translatedName);
                    if (dbResult) {
                        matchedFood = dbResult;
                        break;
                    }
                }
            }

            // 로컬 DB에서 매칭 성공 시
            if (matchedFood) {
                setAnalysisResult({
                    foodName: matchedFood.foodName,
                    portionSize: matchedFood.portionSize,
                    calories: matchedFood.calories,
                    macronutrients: matchedFood.macronutrients,
                    confidence: 0.85,
                    description: matchedFood.description
                });
                return;
            }

            // 2. 로컬 매칭 실패 시, Gemini API 키가 존재하면 Gemini Vision API 호출 (폴백)
            if (geminiApiKey) {
                setAnalysisStatus("로컬 매칭 실패. Gemini Cloud AI 정밀 분석 중...");
                console.log("Local match failed. Falling back to Gemini API...");
                
                const geminiResult = await analyzeFoodWithGemini(capturedImage, geminiApiKey, geminiModel);
                
                if (geminiResult && !geminiResult.error) {
                    setAnalysisResult(geminiResult);
                } else {
                    setAnalysisResult({
                        error: geminiResult.error || "Gemini 분석에 실패했습니다."
                    });
                }
            } else {
                // 3. API 키가 없고 로컬 분석에서도 매칭되지 않은 경우
                // 예측된 가장 높은 순위의 음식을 기본 이름으로 하여 0칼로리 수동 입력 폼 구성
                const defaultFoodName = predictions && predictions.length > 0 
                    ? translateFoodName(predictions[0]) 
                    : "알 수 없는 음식";
                
                setAnalysisResult({
                    foodName: defaultFoodName,
                    portionSize: "1인분",
                    calories: 0,
                    macronutrients: { carbs: 0, protein: 0, fat: 0, sugar: 0 },
                    confidence: 0.3,
                    description: "로컬 AI가 식별하였으나 매칭되는 칼로리 정보를 찾지 못했습니다. 아래 버튼을 눌러 정확한 이름을 입력해 검색해보세요."
                });
            }
        } catch (error: any) {
            console.error("Local AI analysis failed:", error);
            
            // 로컬 AI 실행 도중 에러가 났을 때도 Gemini API 키가 있으면 폴백
            if (geminiApiKey) {
                try {
                    setAnalysisStatus("로컬 오류 발생. Gemini Cloud AI 정밀 분석 중...");
                    const geminiResult = await analyzeFoodWithGemini(capturedImage, geminiApiKey, geminiModel);
                    setAnalysisResult(geminiResult);
                } catch (geminiError: any) {
                    console.error("Gemini fallback also failed:", geminiError);
                    setAnalysisResult({ error: "음식 분석 및 클라우드 폴백에 실패했습니다." });
                }
            } else {
                setAnalysisResult({
                    error: "로컬 이미지 분석 중 오류가 발생했습니다. 직접 검색해 등록해주세요."
                });
            }
        } finally {
            setIsAnalyzing(false);
            setAnalysisStatus("");
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
                                    <p className="text-white font-medium">{analysisStatus || "음식 분석 중..."}</p>
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
