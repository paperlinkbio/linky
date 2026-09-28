import './blog.css';
import { BlogIndex } from '@/components/blog/blog-index';
import { getBlogPosts } from '@/lib/blog/posts';
import { buildPageMetadata } from '@/lib/seo-metadata';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const baseMetadata = buildPageMetadata({
  title: 'Link in bio tips, guides and news | Linky blog',
  description:
    'Product updates, tutorials, and advice on getting more from your link in bio, from the Linky team.',
  path: '/i/blog',
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    ...baseMetadata.alternates,
    types: { 'application/rss+xml': 'https://lin.ky/i/blog/rss.xml' },
  },
};

export default async function ArticlesLandingPage() {
  const blogPosts = await getBlogPosts();
  if (!blogPosts.length) notFound();

  return <BlogIndex posts={blogPosts} page={1} />;
}
