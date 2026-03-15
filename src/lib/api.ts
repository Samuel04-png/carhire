export function getApiUrl(path: string) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "") ?? "";
  return baseUrl ? `${baseUrl}${path}` : path;
}
