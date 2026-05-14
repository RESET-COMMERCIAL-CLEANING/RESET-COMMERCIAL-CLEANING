const BASE_PATH = '/RESET-COMMERCIAL-CLEANING';

export function getImagePath(path: string): string {
  if (path.startsWith('http')) return path;
  if (!path.startsWith('/')) return path;
  return `${BASE_PATH}${path}`;
}

export function getPagePath(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${BASE_PATH}${path}`;
}
