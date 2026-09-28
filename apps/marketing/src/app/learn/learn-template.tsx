import { getLearnPosts } from './utils';
import { MarketingContainer } from '@/components/marketing-container';
import { LearnPostMetadata } from '@/types/mdx';
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  serializeJsonLd,
} from '@trylinky/seo';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
  meta: LearnPostMetadata;
}

const RELATED_COUNT = 4;

export async function ArticleTemplate({ children, meta }: Props) {
  const url = `https://lin.ky/i/learn/${meta.slug}`;
  const lastUpdated = meta.updatedDate ?? meta.publishDate;

  // The next few posts in the same category, wrapping around, so every post
  // is linked from the same number of others (not just the newest ones).
  const siblings = (await getLearnPosts()).filter(
    (post) => post.category === meta.category
  );
  const index = siblings.findIndex((post) => post.slug === meta.slug);
  const related = Array.from(
    { length: Math.min(RELATED_COUNT, siblings.length - 1) },
    (_, i) => siblings[(index + 1 + i) % siblings.length]
  );

  return (
    <article className="flex flex-col min-h-[calc(100vh-12rem)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            buildArticleSchema({
              headline: meta.title,
              description: meta.description,
              url,
              datePublished: meta.publishDate,
              dateModified: lastUpdated,
              publisher: {
                name: 'Linky',
                logo: 'https://lin.ky/assets/logo.png',
              },
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            buildBreadcrumbSchema([
              { name: 'Home', url: 'https://lin.ky' },
              { name: 'Learn', url: 'https://lin.ky/i/learn' },
              { name: meta.title, url },
            ])
          ),
        }}
      />
      <section className="border-b border-zinc-950/5 bg-linear-to-b from-white to-[#F5F5F3] pb-12 pt-32 md:pt-40">
        <MarketingContainer>
          <header className="flex max-w-3xl flex-col">
            <p className="flex items-center gap-2 text-sm font-medium text-zinc-500">
              <span className="inline-block h-px w-6 bg-zinc-300" />
              <Link href="/i/learn" className="hover:text-zinc-900">
                Learn
              </Link>
            </p>
            <h1 className="mt-4 text-pretty text-4xl font-semibold tracking-tight text-zinc-900 lg:text-5xl">
              {meta.title}
            </h1>
            <time dateTime={lastUpdated} className="mt-5 text-sm text-zinc-500">
              Last updated:{' '}
              {Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }).format(new Date(lastUpdated))}
            </time>
          </header>
        </MarketingContainer>
      </section>
      <section className="flex-1 py-16">
        <MarketingContainer>
          <div className="prose prose-lg prose-zinc max-w-3xl">{children}</div>

          {related.length > 0 && (
            <nav
              aria-labelledby="related-heading"
              className="mt-16 max-w-3xl border-t border-zinc-950/5 pt-10"
            >
              <h2
                id="related-heading"
                className="text-lg font-semibold text-zinc-900"
              >
                Related questions
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {related.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/i/learn/${post.slug}`}
                      className="text-zinc-600 transition-colors hover:text-zinc-900"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </MarketingContainer>
      </section>
    </article>
  );
}
