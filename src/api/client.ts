export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api/v1";

export async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message = typeof data === "object" && data && "message" in data
      ? String(data.message)
      : "Something went wrong.";
    throw new Error(message);
  }

  return data as T;
}
