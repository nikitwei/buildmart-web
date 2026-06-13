export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(endpoint);
  if (!res.ok)
    throw new ApiError(res.status, `GET ${endpoint} failed`);
  return res.json() as Promise<T>;
}
