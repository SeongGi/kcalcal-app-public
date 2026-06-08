let modelPromise: any = null;

async function getModel() {
    if (typeof window === 'undefined') return null;
    
    try {
        // Dynamic import to prevent next.js SSR build errors
        const tf = await import('@tensorflow/tfjs');
        const mobilenet = await import('@tensorflow-models/mobilenet');
        
        if (!modelPromise) {
            modelPromise = tf.ready().then(() => {
                console.log("TensorFlow.js ready. Loading MobileNet v1...");
                return mobilenet.load({
                    version: 1,
                    alpha: 1.0
                });
            });
        }
        return modelPromise;
    } catch (error) {
        console.error("Failed to initialize TensorFlow/MobileNet:", error);
        throw new Error("로컬 AI 엔진 초기화 실패");
    }
}

/**
 * Classify a base64 encoded image using on-device MobileNet.
 * Returns an array of predicted English class names sorted by probability.
 */
export async function classifyImageLocally(imageBase64: string): Promise<string[]> {
    const model = await getModel();
    if (!model) {
        throw new Error("로컬 AI는 브라우저 환경에서만 동작합니다.");
    }
    
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageBase64;
        
        img.onload = async () => {
            try {
                // Classify the image
                const predictions = await model.classify(img);
                console.log("Local AI Raw Predictions:", predictions);
                
                if (predictions && predictions.length > 0) {
                    resolve(predictions.map((p: any) => p.className));
                } else {
                    resolve([]);
                }
            } catch (err) {
                console.error("Error during local image classification:", err);
                reject(err);
            }
        };
        
        img.onerror = (err) => {
            console.error("Error loading base64 image in local-ai:", err);
            reject(new Error("이미지를 읽는 도중 오류가 발생했습니다."));
        };
    });
}
