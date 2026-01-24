import { getAllFoodRecords, saveFoodRecord, FoodRecord } from "./db";

export interface BackupData {
    version: string;
    exportDate: string;
    records: FoodRecord[];
    settings?: {
        goalCalories?: number;
    };
}

/**
 * 모든 데이터를 JSON 형식으로 백업
 */
export async function exportBackup(): Promise<BackupData> {
    const records = await getAllFoodRecords();
    const goalCalories = localStorage.getItem("goal_calories");

    const backup: BackupData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        records,
        settings: {
            goalCalories: goalCalories ? parseInt(goalCalories) : undefined,
        },
    };

    return backup;
}

/**
 * 백업 파일을 다운로드
 */
export async function downloadBackup(): Promise<void> {
    const backup = await exportBackup();
    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `kcalcal-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * 백업 파일 검증
 */
export function validateBackup(data: unknown): data is BackupData {
    if (typeof data !== "object" || data === null) return false;

    const backup = data as Partial<BackupData>;

    if (!backup.version || !backup.exportDate || !Array.isArray(backup.records)) {
        return false;
    }

    // 각 레코드 검증
    for (const record of backup.records) {
        if (
            typeof record.timestamp !== "number" ||
            typeof record.foodName !== "string" ||
            typeof record.calories !== "number"
        ) {
            return false;
        }
    }

    return true;
}

/**
 * 백업 파일에서 데이터 복원
 */
export async function restoreBackup(file: File): Promise<{
    success: boolean;
    message: string;
    recordsCount?: number;
}> {
    try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!validateBackup(data)) {
            return {
                success: false,
                message: "유효하지 않은 백업 파일입니다.",
            };
        }

        // 설정 복원
        if (data.settings?.goalCalories) {
            localStorage.setItem("goal_calories", data.settings.goalCalories.toString());
        }

        // 레코드 복원
        let successCount = 0;
        for (const record of data.records) {
            try {
                // id 제거하고 저장 (새 ID 생성)
                const { id, ...recordWithoutId } = record;
                await saveFoodRecord(recordWithoutId);
                successCount++;
            } catch (error) {
                console.error("Failed to restore record:", error);
            }
        }

        return {
            success: true,
            message: `${successCount}개의 기록이 복원되었습니다.`,
            recordsCount: successCount,
        };
    } catch (error) {
        console.error("Restore error:", error);
        return {
            success: false,
            message: "백업 파일을 읽는데 실패했습니다.",
        };
    }
}
