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
    // สมมุติว่าทุก response error จะเป็น object ที่มี field error หรือ message
    type ErrorShape = { error?: string; message?: string };
    const errData = (data as unknown) as ErrorShape | undefined;

    const message =
      errData?.error ?? errData?.message ?? res.statusText;

    throw new Error(message);
  }

  // ถ้า data ยังไม่มา (เช่น body ว่าง) ให้ fallback เป็น {} as T
  if (!data) {
    throw new Error("Empty response body");
  }

  return data;
}
