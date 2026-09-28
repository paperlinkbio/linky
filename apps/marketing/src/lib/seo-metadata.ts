import type { Metadata } from 'next';

const BASE = 'https://lin.ky';

/** The site-wide description, used by the root layout and the home page. */
export const SITE_DESCRIPTION =
  'Create your own dynamic link in bio page effortlessly with Linky, the personal page builder designed to help you stand out and connect with your audience.';

/**
 * Builds consistent, answer-first metadata for marketing pages. `description`
 * should lead with the direct answer to the page's target query - not a brand
 * tagline (GEO/AI-search best practice, June 2026).
 */
export function buildPageMetadata(input: {
  title: string;
  description: string;
  /** Path including the /i basePath, e.g. "/i/pricing". */
  path: string;
  ogImage?: string;
}): Metadata {
  const url = `${BASE}${input.path}`;
  const image = input.ogImage ?? `${BASE}/assets/og.png`;
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: 'Linky',
      type: 'website',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@trylinky',
      creator: '@trylinky',
      images: image,
    },
  };
}

/**
 * Metadata for a programmatic SEO page. `path` includes the /i basePath
 * (e.g. "/i/integrations/spotify"): the frontend only proxies /i/*, so the
 * bare "/integrations/spotify" would hit the user-page route and 404.
 */
export function buildPseoMetadata(input: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return buildPageMetadata({
    title: input.title,
    description: input.description,
    path: input.path,
  });
}
