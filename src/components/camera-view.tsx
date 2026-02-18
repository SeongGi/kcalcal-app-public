"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import imageCompression from "browser-image-compression";

interface CameraViewProps {
    onCapture: (imageData: string) => void;
}

export default function CameraView({ onCapture }: CameraViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
    const [error, setError] = useState<string>("");

    const startCamera = useCallback(async () => {
        try {
            // Note: We don't stop the stream here directly relying on state, 
            // the separate useEffect handles cleanup when stream changes.

            const constraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            };

            try {
                const newStream = await navigator.mediaDevices.getUserMedia(constraints);
                setStream(newStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                }
                setError("");
            } catch (err: any) {
                // Fallback: resizing might have failed, try basic constraints
                if (err.name === 'OverconstrainedError') {
                    console.log("High resolution not supported, trying fallback...");
                    const fallbackStream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: facingMode }
                    });
                    setStream(fallbackStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = fallbackStream;
                    }
                    setError("");
                    return;
                }
                throw err; // Re-throw if not a fallback scenario
            }
        } catch (err: any) {
            console.error("Error accessing camera:", err);
            let errorMessage = "카메라에 접근할 수 없습니다.";

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                errorMessage = "카메라 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.";
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                errorMessage = "카메라를 찾을 수 없습니다.";
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                errorMessage = "카메라를 다른 앱에서 사용 중이거나 하드웨어 오류가 발생했습니다.";
            }

            setError(errorMessage);
        }
    }, [facingMode]);

    // Cleanup stream when it changes or component unmounts
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    // Start camera when facingMode changes
    useEffect(() => {
        startCamera();
    }, [startCamera]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            if (context) {
                // Calculate scaled dimensions (max 1024px)
                let width = video.videoWidth;
                let height = video.videoHeight;
                const maxSize = 1024;

                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    } else {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                context.drawImage(video, 0, 0, width, height);

                // Convert to base64
                const imageData = canvas.toDataURL("image/jpeg", 0.5);
                onCapture(imageData);
            }
        }
    };

    const [isProcessing, setIsProcessing] = useState(false);

    const resizeImageWithBitmap = async (file: File, maxWidth: number = 1024): Promise<string> => {
        try {
            const bitmap = await createImageBitmap(file);
            const canvas = document.createElement('canvas');

            let width = bitmap.width;
            let height = bitmap.height;

            if (width > maxWidth || height > maxWidth) {
                if (width > height) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                } else {
                    width = Math.round((width * maxWidth) / height);
                    height = maxWidth;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Could not get canvas context");

            ctx.drawImage(bitmap, 0, 0, width, height);
            return canvas.toDataURL('image/jpeg', 0.7);
        } catch (error) {
            console.error("Bitmap resize failed, trying FileReader fallback:", error);
            // Fallback for browsers that don't support createImageBitmap cleanly with user files
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let w = img.width;
                        let h = img.height;
                        if (w > maxWidth || h > maxWidth) {
                            if (w > h) {
                                h = Math.round((h * maxWidth) / w);
                                w = maxWidth;
                            } else {
                                w = Math.round((w * maxWidth) / h);
                                h = maxWidth;
                            }
                        }
                        canvas.width = w;
                        canvas.height = h;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0, w, h);
                        resolve(canvas.toDataURL('image/jpeg', 0.7));
                    };
                    img.onerror = reject;
                    img.src = e.target?.result as string;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }
    };

    const handleGalleryClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);

        try {
            let compressedFile: File | Blob = file;
            let usedMethod = "browser-image-compression (worker)";

            try {
                // Method 1: Try browser-image-compression with WebWorker
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                    initialQuality: 0.7,
                };
                compressedFile = await imageCompression(file, options);
            } catch (err1) {
                // Method 2: Try without WebWorker (sometimes fails on specific WebViews)
                console.warn("WebWorker compression failed, retrying on main thread...", err1);
                usedMethod = "browser-image-compression (main thread)";
                try {
                    const options = {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1024,
                        useWebWorker: false,
                        initialQuality: 0.7,
                    };
                    compressedFile = await imageCompression(file, options);
                } catch (err2) {
                    // Method 3: Manual Canvas Resize
                    console.warn("Library compression failed, using manual canvas resize...", err2);
                    usedMethod = "manual canvas";
                    const base64 = await resizeImageWithBitmap(file);
                    onCapture(base64);
                    setIsProcessing(false);
                    return;
                }
            }

            // Convert processed file to base64
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = () => {
                const base64 = reader.result as string;
                onCapture(base64);
                setIsProcessing(false);
            };

        } catch (fatalError) {
            console.error("All image processing methods failed:", fatalError);
            alert("이미지를 처리할 수 없습니다. 다른 사진을 선택해주세요.");
            setIsProcessing(false);
        }

        // Reset input so same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const switchCamera = () => {
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    };

    return (
        <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl ring-4 ring-gray-900/50">
            {/* Hidden File Input */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Processing Overlay */}
            {isProcessing && (
                <div className="absolute inset-0 z-50 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white font-medium text-lg">사진 최적화 중...</p>
                    <p className="text-white/60 text-sm mt-2">잠시만 기다려주세요</p>
                </div>
            )}

            {error ? (
                <div className="flex items-center justify-center h-full text-white p-4 text-center">
                    <p>{error}</p>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Controls Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-6 pb-8 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
                        {/* Gallery Button */}
                        <button
                            onClick={handleGalleryClick}
                            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all"
                            aria-label="Gallery"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </button>

                        {/* Shutter Button */}
                        <button
                            onClick={handleCapture}
                            className="w-20 h-20 rounded-full border-[6px] border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                        >
                            <div className="w-16 h-16 bg-white rounded-full"></div>
                        </button>

                        {/* Switch Camera */}
                        <button
                            onClick={switchCamera}
                            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-pulse-once">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
