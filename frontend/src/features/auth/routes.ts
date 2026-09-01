import { lessons } from '@/mocks/lessons';

const publicTabPaths = new Set(['/', '/practice', '/review', '/profile']);

export function isAllowedProtectedPath(path: string) {
  if (publicTabPaths.has(path)) return true;
  const lessonMatch = /^\/lesson\/([^/?#]+)$/.exec(path);
  return lessonMatch ? lessons.some((lesson) => lesson.id === lessonMatch[1]) : false;
}

export function sanitizeNextPath(path: string | null | undefined) {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return null;
  if (path.includes('://') || !isAllowedProtectedPath(path)) return null;
  return path;
}
