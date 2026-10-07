import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL;

const nextConfig: NextConfig = {
  transpilePackages: [
    '@trylinky/ui',
    '@trylinky/common',
    '@trylinky/seo',
    '@trylinky/db',
  ],
  // Full Cache Components / PPR: the public page shell prerenders, cached
  // data ('use cache' in page-actions) serves from cache, and only dynamic
  // Suspense-wrapped subtrees render per request.
  cacheComponents: true,
  // The marketing app is deployed separately. Keep the frontend build valid
  // when its optional URL is not present, rather than emitting `undefined/*`
  // rewrites that make Next.js reject the entire deployment.
  rewrites: async () =>
    marketingUrl
      ? [
          {
            source: '/',
            destination: `${marketingUrl}/i`,
          },
          {
            source: '/sitemap.xml',
            destination: `${marketingUrl}/i/sitemap.xml`,
          },
          {
            source: '/llms.txt',
            destination: `${marketingUrl}/i/llms.txt`,
          },
          {
            source: '/pricing.md',
            destination: `${marketingUrl}/i/pricing.md`,
          },
          {
            source: '/i/:path*',
            destination: `${marketingUrl}/i/:path*`,
          },
        ]
      : [],
  redirects: async () => [
    {
      source: '/pricing',
      destination: '/i/pricing',
      permanent: true,
    },
    {
      source: '/i/learn/what-is-glow',
      destination: '/i/learn/what-is-linky',
      permanent: true,
    },
    {
      source: '/i/learn/is-glow-free',
      destination: '/i/learn/is-linky-free',
      permanent: true,
    },
  ],
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dev.glow.as',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.glow.as',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dev.lin.ky',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.lin.ky',
        port: '',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: 'hyperdusk',
  project: 'glow',
  silent: false,
  sourcemaps: {
    disable: true,
    deleteSourcemapsAfterUpload: true,
  },
});
