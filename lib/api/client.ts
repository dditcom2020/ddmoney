export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(endpoint, options);

    let data: T | undefined;
    try {
        data = (await res.json()) as T;
    } catch {
        // response ไม่ใช่ json ก็ปล่อยว่าง 
    }

    if (!res.ok) {
        const message = 
            (data as any)?.error ??
            (data as any)?.message ??
            res.statusText;
            throw new Error(message);
    }

    return data!;
}