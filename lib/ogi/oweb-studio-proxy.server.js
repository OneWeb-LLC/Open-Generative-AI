import { NextResponse } from 'next/server';
import { getOwebStudioGenerativeUpstream } from '@/lib/ogi/oweb-billing.server';

/**
 * Forward to OWeb hosted generative proxy (workspace wallet + metering).
 * @param {Request} request
 * @param {string} upstreamPath
 * @param {{ accessToken: string; workspaceId: string }} auth
 */
export async function proxyOwebStudioGenerative(request, upstreamPath, auth) {
  const base = getOwebStudioGenerativeUpstream();
  const path = upstreamPath.replace(/^\/+/, '');
  const upstreamUrl = new URL(`${base}/${path}`);
  upstreamUrl.search = request.nextUrl.search;

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${auth.accessToken}`);
  headers.set('x-org-id', auth.workspaceId);

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  const accept = request.headers.get('accept');
  if (accept) headers.set('accept', accept);

  /** @type {RequestInit} */
  const init = {
    method: request.method,
    headers,
    cache: 'no-store',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  let upstreamResponse;
  try {
    upstreamResponse = await fetch(upstreamUrl, init);
  } catch (err) {
    console.error('[oweb-studio proxy] fetch failed', upstreamUrl.toString(), err?.message ?? err);
    return NextResponse.json({ error: 'oweb_studio_unreachable' }, { status: 502 });
  }

  const responseHeaders = new Headers();
  const upstreamType = upstreamResponse.headers.get('content-type');
  if (upstreamType) responseHeaders.set('content-type', upstreamType);

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}
