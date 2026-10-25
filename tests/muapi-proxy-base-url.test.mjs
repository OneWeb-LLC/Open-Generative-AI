import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import {
  configureGenerativeClient,
  getMuapiClientBaseUrl,
} from '../packages/studio/src/muapi.js';

function withBrowserLocation(run) {
  globalThis.window = { location: { protocol: 'https:' } };
  try {
    run();
  } finally {
    delete globalThis.window;
  }
}

describe('muapi client base URL', () => {
  afterEach(() => {
    delete globalThis.window;
    configureGenerativeClient({
      mode: 'proxy',
      proxyPath: '/api',
      muapiProxyPath: undefined,
      directUpstream: 'https://api.muapi.ai',
    });
  });

  it('keeps the OWeb generative proxy for MuAPI traffic when video uses Vercel gateway', () => {
    withBrowserLocation(() => {
    configureGenerativeClient({
      mode: 'vercel-video',
      proxyPath: '/api/vercel-gateway',
      muapiProxyPath: '/api/studio/generative',
    });
    assert.equal(getMuapiClientBaseUrl(), '/api/studio/generative');
    });
  });

  it('keeps the OWeb generative proxy for MuAPI traffic when video uses Comfy on RunPod', () => {
    withBrowserLocation(() => {
    configureGenerativeClient({
      mode: 'comfy-video',
      proxyPath: '/api/comfy-runpod',
      muapiProxyPath: '/api/studio/generative',
    });
    assert.equal(getMuapiClientBaseUrl(), '/api/studio/generative');
    });
  });

  it('defaults to /api for legacy satellite shells without muapiProxyPath', () => {
    withBrowserLocation(() => {
    configureGenerativeClient({
      mode: 'vercel-video',
      proxyPath: '/api/vercel-gateway',
      muapiProxyPath: undefined,
    });
    assert.equal(getMuapiClientBaseUrl(), '/api');
    });
  });
});
