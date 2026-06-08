let classifierPromise: any = null;

async function getClassifier() {
    if (typeof window === 'undefined') return null;
    
    try {
        // Dynamic import to prevent next.js SSR build errors
        const { pipeline, env } = await import('@huggingface/transformers');
        
        // Instruct transformers.js to fetch from Hugging Face Hub, not look locally
        env.allowLocalModels = false;
        
        if (!classifierPromise) {
            console.log("Loading Swin Food-101 Model from Hugging Face CDN...");
            classifierPromise = pipeline('image-classification', 'onnx-community/swin-finetuned-food101-ONNX');
        }
        return classifierPromise;
    } catch (error) {
        console.error("Failed to initialize Transformers.js Swin classifier:", error);
        throw new Error("로컬 AI 엔진 초기화 실패");
    }
}

/**
 * Classify a base64 encoded image using on-device Swin Food-101 model.
 * Returns an array of predicted food class labels.
 */
export async function classifyImageLocally(imageBase64: string): Promise<string[]> {
    const classifier = await getClassifier();
    if (!classifier) {
        throw new Error("로컬 AI는 브라우저 환경에서만 동작합니다.");
    }
    
    try {
        console.log("Running on-device Swin classification...");
        // Pass base64 image data directly to the pipeline
        const results = await classifier(imageBase64, {
            topk: 3 // Get top 3 predictions
        });
        console.log("Swin Food-101 Predictions:", results);
        
        if (results && results.length > 0) {
            return results.map((r: any) => r.label);
        }
        return [];
    } catch (err) {
        console.error("Error during local Swin classification:", err);
        throw err;
    }
}
