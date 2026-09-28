export interface ArticleMetadata {
  slug?: string;
  title: string;
  publishDate: string;
  author: string;
  authorPosition: string;
  description: string;
}

export interface LearnPostMetadata {
  slug: string;
  title: string;
  /** Answer-first summary, used as the meta description. */
  description: string;
  publishDate: string;
  /** Set when the article is materially revised. */
  updatedDate?: string;
  category: 'link-in-bio' | 'linky' | 'growth';
}

declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;

  export const metadata: ArticleMetadata;
}
