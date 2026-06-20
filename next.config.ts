import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * Security headers following OWASP best practices
 * @see https://owasp.org/www-project-secure-headers/
 */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(self), geolocation=(), interest-cohort=()',
  },
];

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['venky-core'],
  experimental: {
    serverActions: {
      allowedOrigins,
      bodySizeLimit: '50mb',
    },
    proxyClientMaxBodySize: '50mb',
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
      'date-fns',
      'date-fns-tz',
      'lodash-es',
      '@radix-ui/react-dialog',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      '@dnd-kit/utilities',
      'd3',
      'react-syntax-highlighter',
      'zod',
    ],
  },
  productionBrowserSourceMaps: false,
  output: 'standalone',
  outputFileTracingRoot: repoRoot,
  turbopack: {
    root: repoRoot,
  },
  serverExternalPackages: ['oracledb', 'sharp', 'pdfjs-dist'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
