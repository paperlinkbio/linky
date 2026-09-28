'use server';

import { LearnPostMetadata } from '@/types/mdx';
import { readdir } from 'fs/promises';
import path from 'path';

export type LearnPost = LearnPostMetadata;

export async function getLearnPosts(): Promise<LearnPost[]> {
  const slugs = (
    await readdir(path.join(process.cwd(), './src/app/learn/(learnPosts)'), {
      withFileTypes: true,
    })
  ).filter((dirent) => dirent.isDirectory());

  const posts = await Promise.all(
    slugs.map(async ({ name }) => {
      const { metadata } = await import(`./(learnPosts)/${name}/page.mdx`);
      return { ...metadata, slug: name };
    })
  );

  posts.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));

  return posts;
}

export async function getLearnPostBySlug(
  slugs: string[]
): Promise<LearnPost[]> {
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = await import(`./(learnPosts)/${slug}/page.mdx`);
      return { ...metadata, slug };
    })
  );

  return posts;
}
