/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['studio', 'ai-agent', 'workflow-builder', 'design-agent'],
  // AI SDK downloads provider video URLs via optional `undici`; keep it resolvable at runtime.
  serverExternalPackages: ['undici'],
};

export default nextConfig;
