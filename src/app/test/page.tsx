"use client";

import { useState } from "react";
import { getAvailableModels } from "@/app/actions";

export default function TestPage() {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const testAction = async () => {
        setLoading(true);
        try {
            const res = await getAvailableModels();
            setResult(JSON.stringify(res, null, 2));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
            setResult(`Error: ${errorMessage}`);
        }
        setLoading(false);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Server Action Test</h1>
            <button
                onClick={testAction}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
                {loading ? "Testing..." : "Test getAvailableModels"}
            </button>
            <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-96">
                {result || "Click button to test"}
            </pre>
        </div>
    );
}
