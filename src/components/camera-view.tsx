"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import imageCompression from "browser-image-compression";

interface CameraViewProps {
    onCapture: (imageData: string) => void;
}

export default function CameraView({ onCapture }: CameraViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
    const [error, setError] = useState<string>("");

    const startCamera = useCallback(async () => {
        try {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }

            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });

            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
            setError("");
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
        }
    }, [facingMode, stream]);

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [startCamera, stream]);

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

    const switchCamera = () => {
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    };

    return (
        <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl ring-4 ring-gray-900/50">
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
                        {/* Gallery/Back Button Placeholder */}
                        <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all">
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
