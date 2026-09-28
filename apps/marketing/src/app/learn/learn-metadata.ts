import { buildPageMetadata } from '@/lib/seo-metadata';
import { LearnPostMetadata } from '@/types/mdx';

/**
 * Metadata for a Learn article's page.mdx. The result is both Next.js page
 * metadata (canonical, description, Open Graph) and the article fields the
 * Learn index and template read. The " | Linky" title suffix comes from the
 * template in (learnPosts)/layout.tsx, so `title` stays the bare question.
 */
export function learnPostMetadata(post: LearnPostMetadata) {
  return {
    ...buildPageMetadata({
      title: post.title,
      description: post.description,
      path: `/i/learn/${post.slug}`,
    }),
    ...post,
  };
}
