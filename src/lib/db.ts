// IndexedDB wrapper for food records
const DB_NAME = "KcalCalDB";
const DB_VERSION = 1;
const STORE_NAME = "foodRecords";

export interface FoodRecord {
    id?: number;
    timestamp: number;
    imageData: string;
    foodName: string;
    portionSize: string;
    calories: number;
    macronutrients: {
        carbs: number;
        protein: number;
        fat: number;
        sugar: number;
    };
    confidence?: number;
    description?: string;
}

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true,
                });
                objectStore.createIndex("timestamp", "timestamp", { unique: false });
            }
        };
    });
}

export async function saveFoodRecord(record: Omit<FoodRecord, "id">): Promise<number> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(record);

        request.onsuccess = () => resolve(request.result as number);
        request.onerror = () => reject(request.error);
    });
}

export async function getAllFoodRecords(): Promise<FoodRecord[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            const records = request.result;
            // Migrate old flat structure to new macronutrients structure
            const migratedRecords = records.map((record: any) => {
                // Check if record uses old flat structure
                if (record.carbs !== undefined && !record.macronutrients) {
                    return {
                        ...record,
                        macronutrients: {
                            carbs: record.carbs || 0,
                            protein: record.protein || 0,
                            fat: record.fat || 0,
                            sugar: record.sugar || 0,
                        }
                    };
                }
                // Ensure macronutrients exists with default values
                if (!record.macronutrients) {
                    return {
                        ...record,
                        macronutrients: {
                            carbs: 0,
                            protein: 0,
                            fat: 0,
                            sugar: 0,
                        }
                    };
                }
                return record;
            });
            resolve(migratedRecords);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function deleteFoodRecord(id: number): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}
