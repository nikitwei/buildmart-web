import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiGet, ApiError } from "@/infrastructure/api-client";

describe("ApiError", () => {
  it("creates an error with status and message", () => {
    const error = new ApiError(404, "Not found");
    expect(error.status).toBe(404);
    expect(error.message).toBe("Not found");
    expect(error.name).toBe("ApiError");
  });
});

describe("apiGet", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed JSON on success", async () => {
    const data = { id: 1, name: "test" };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const result = await apiGet<typeof data>("/test.json");
    expect(result).toEqual(data);
    expect(fetch).toHaveBeenCalledWith("/test.json");
  });

  it("throws ApiError on non-ok response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(apiGet("/test.json")).rejects.toThrow(ApiError);
    await expect(apiGet("/test.json")).rejects.toThrow(
      "GET /test.json failed",
    );
  });

  it("throws on network failure", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    await expect(apiGet("/test.json")).rejects.toThrow("Network error");
  });
});
