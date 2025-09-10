// Helper to safely combine base URL and endpoint
export function buildUrl(base, path) {
  if (!base) return path;
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}
