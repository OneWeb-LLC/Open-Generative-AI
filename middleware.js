import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/studio/:path*',
    '/zh/studio/:path*',
    '/agents/:path*',
    '/workflow/:path*',
    '/assistant/:path*',
    '/login',
    '/sso',
  ],
};
