
import { getSession, destroySession } from "./session";
const getLanguage = () => {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem("language") || "en";
};
class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Builds headers, optionally including Accept-Language
const buildHeaders = (session: any, includeLanguage = true): Record<string, string> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${session?.accessToken}`,
  ...(includeLanguage && { "Accept-Language": getLanguage() }),
});

const handleResponse = async (response: Response): Promise<unknown> => {
  // Handle no-content responses
  if (response.status === 204) return null;

  const contentType = response.headers.get("Content-Type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    switch (response.status) {
      case 401:
        destroySession();
        // throw new ApiError(401, "TOKEN_EXPIRED", "Session expired, please log in again.", data);
      case 403:
        throw new ApiError(403, "FORBIDDEN", "You don't have permission to perform this action.", data);
      case 404:
        throw new ApiError(404, "NOT_FOUND", "The requested resource was not found.", data);
      case 422:
        throw new ApiError(422, "VALIDATION_ERROR", "Validation failed.", data);
      case 500:
        throw new ApiError(500, "SERVER_ERROR", "An unexpected server error occurred.", data);
      default:
        throw new ApiError(response.status, "REQUEST_FAILED", `Request failed with status ${response.status}.`, data);
    }
  }

  return data;
};

const request = async (
  url: string,
  options: RequestInit = {},
  includeLanguage = true
): Promise<unknown> => {
  const session = await getSession();
console.log(options);
  try {
    const response = await fetch(url, {
      ...options,
      headers: buildHeaders(session, includeLanguage),
    });

    return handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;

    // Network-level failure (offline, DNS, timeout, etc.)
    throw new ApiError(0, "NETWORK_ERROR", "A network error occurred. Please check your connection.");
  }
};

export const apiRequest = {
  get: (url: string) =>
    request(url),

  post: (url: string, data: unknown) =>
    request(url, { method: "POST", body: JSON.stringify(data) }),

  put: (url: string, data: unknown) =>
    request(url, { method: "PUT", body: JSON.stringify(data) }),

  delete: (url: string, data?: unknown) =>
    request(url, { method: "DELETE", body: JSON.stringify(data) }),

  getFromServer: (url: string) =>
    request(url, {}, false), // no Accept-Language for server-side calls
};