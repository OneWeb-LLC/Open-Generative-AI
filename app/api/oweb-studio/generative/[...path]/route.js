import { requireOwebStudioSession } from '@/lib/ogi/oweb-studio-auth.server';
import { proxyOwebStudioGenerative } from '@/lib/ogi/oweb-studio-proxy.server';

export const dynamic = 'force-dynamic';

async function handle(request, context) {
  const auth = await requireOwebStudioSession();
  if (!auth.ok) return auth.response;

  const { path } = await context.params;
  const segments = Array.isArray(path) ? path : [];
  const upstreamPath = segments.map(encodeURIComponent).join('/');

  return proxyOwebStudioGenerative(request, upstreamPath, {
    accessToken: auth.accessToken,
    workspaceId: auth.workspaceId,
  });
}

export async function GET(request, context) {
  return handle(request, context);
}
export async function POST(request, context) {
  return handle(request, context);
}
export async function PUT(request, context) {
  return handle(request, context);
}
export async function PATCH(request, context) {
  return handle(request, context);
}
export async function DELETE(request, context) {
  return handle(request, context);
}
export async function HEAD(request, context) {
  return handle(request, context);
}
