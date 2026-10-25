import { configureGenerativeClient } from 'studio';

/**
 * @param {{ mode: 'proxy' | 'direct' | 'vercel-video' | 'comfy-video', proxyPath?: string, upstream?: string }} provider
 */
export function applyGenerativeProvider(provider) {
  if (!provider) return;
  if (provider.mode === 'comfy-video') {
    configureGenerativeClient({
      mode: 'comfy-video',
      proxyPath: provider.proxyPath || '/api/comfy-runpod',
      ...(provider.muapiProxyPath ? { muapiProxyPath: provider.muapiProxyPath } : {}),
    });
    return;
  }
  if (provider.mode === 'vercel-video') {
    configureGenerativeClient({
      mode: 'vercel-video',
      proxyPath: provider.proxyPath || '/api/vercel-gateway',
      ...(provider.muapiProxyPath ? { muapiProxyPath: provider.muapiProxyPath } : {}),
    });
    return;
  }
  if (provider.mode === 'direct') {
    configureGenerativeClient({
      mode: 'direct',
      directUpstream: provider.upstream || 'https://api.muapi.ai',
    });
    return;
  }
  if (provider.mode === 'oweb-studio') {
    configureGenerativeClient({
      mode: 'oweb-studio',
      proxyPath: provider.proxyPath || '/api/oweb-studio/generative',
    });
    return;
  }
  configureGenerativeClient({
    mode: 'proxy',
    proxyPath: provider.proxyPath || '/api',
    directUpstream: provider.upstream || 'https://api.muapi.ai',
  });
}
