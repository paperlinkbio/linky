import { getLearnPosts } from '@/app/learn/utils';
import { alternatives } from '@/content/alternatives';
import { integrations } from '@/content/integrations';
import { niches } from '@/content/niches';
import { templates } from '@/content/templates';
import { getBlogPosts } from '@/lib/blog/posts';
import { MetadataRoute } from 'next';

const baseUrl = `https://lin.ky`;

// Only blog and learn entries carry lastModified: they have real dates.
// Stamping everything with the build time teaches Google to ignore lastmod.

// IMPORTANT: We deliberately DO NOT enumerate public user pages (lin.ky/<slug>)
// in the sitemap. Thousands of thin user pages would dilute root-domain authority
// and feed scaled-content signals. User pages are indexed individually only when
// they pass the quality gate (see @trylinky/seo `shouldIndexPage`). Do not add them.
//
// Spec 2 will append programmatic SEO routes (integration/template/use-case/
// alternative pages) to `pseoSitemap` below.
const pseoSitemap: MetadataRoute.Sitemap = [
  {
    url: 'https://lin.ky/i/integrations',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: 'https://lin.ky/i/templates',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  ...integrations.map((i) => ({
    url: `https://lin.ky/i/integrations/${i.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  })),
  ...templates.map((t) => ({
    url: `https://lin.ky/i/templates/${t.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  })),
  {
    url: 'https://lin.ky/i/for',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: 'https://lin.ky/i/alternatives',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  ...niches.map((n) => ({
    url: `https://lin.ky/i/for/${n.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  })),
  ...alternatives.map((a) => ({
    url: `https://lin.ky/i/alternatives/${a.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  })),
];

const baseSitemap = [
  {
    url: baseUrl,
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    url: `${baseUrl}/i/pricing`,
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${baseUrl}/i/terms`,
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    url: `${baseUrl}/i/privacy`,
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    url: `${baseUrl}/i/tiktok`,
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    url: `${baseUrl}/i/explore`,
    changeFrequency: 'weekly',
    priority: 0.4,
  },
];
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogSitemap = await generateBlogSitemap(baseUrl);
  const learnSitemap = await generateLearnSitemap(baseUrl);

  return [
    ...baseSitemap,
    ...pseoSitemap,
    ...blogSitemap,
    ...learnSitemap,
  ] as MetadataRoute.Sitemap;
}

const generateBlogSitemap = async (baseUrl: string) => {
  const blogPosts = await getBlogPosts();
  if (!blogPosts.length) return [];

  const blogSitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/i/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [
    {
      url: `${baseUrl}/i/blog`,
      // Posts are sorted newest first.
      lastModified: new Date(blogPosts[0].publishedAt),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...blogSitemap,
  ];
};

const generateLearnSitemap = async (baseUrl: string) => {
  const posts = await getLearnPosts();

  const postsSitemap = posts.map((post) => ({
    url: `${baseUrl}/i/learn/${post.slug}`,
    lastModified: new Date(post.updatedDate ?? post.publishDate),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [
    {
      url: `${baseUrl}/i/learn`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...postsSitemap,
  ];
};
