export interface PersonInput {
  name: string;
  url: string;
  description?: string;
  image?: string;
  sameAs?: string[];
}

export function buildProfilePageSchema(input: PersonInput) {
  const person: Record<string, unknown> = {
    '@type': 'Person',
    name: input.name,
  };
  if (input.description) person.description = input.description;
  if (input.image) person.image = input.image;
  if (input.url) person.url = input.url;
  if (input.sameAs?.length) person.sameAs = input.sameAs;
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: person,
  };
}

const LINK_BLOCK_TYPES = new Set(['link-box', 'link-bar']);

interface PageLike {
  blocks: Array<{ type: string; data: Record<string, unknown> }>;
}

/** Derives Person schema input from a page's header + link blocks. Pure. */
export function personInputFromPage(
  page: PageLike,
  pageUrl: string
): PersonInput | null {
  const header = page.blocks.find((b) => b.type === 'header');
  const name =
    typeof header?.data?.title === 'string' ? header.data.title.trim() : '';
  if (!name) return null;

  const rawDesc =
    typeof header?.data?.description === 'string'
      ? header.data.description.trim()
      : '';
  const avatar = header?.data?.avatar as { src?: unknown } | undefined;
  const image =
    typeof avatar?.src === 'string' && avatar.src ? avatar.src : undefined;

  const sameAs = page.blocks
    .filter((b) => LINK_BLOCK_TYPES.has(b.type))
    .map((b) => (typeof b.data?.link === 'string' ? b.data.link : null))
    .filter((u): u is string => Boolean(u));

  return {
    name,
    url: pageUrl,
    description: rawDesc || undefined,
    image,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function buildOrganizationSchema(input: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}) {
  const org: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.name,
    url: input.url,
  };
  if (input.logo) org.logo = input.logo;
  if (input.description) org.description = input.description;
  if (input.sameAs?.length) org.sameAs = input.sameAs;
  return org;
}

export function buildArticleSchema(input: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  publisher: { name: string; logo: string };
}) {
  const article: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: input.url,
    mainEntityOfPage: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    // Learn articles are written by the team, so the publisher is the author.
    author: { '@type': 'Organization', name: input.publisher.name },
    publisher: {
      '@type': 'Organization',
      name: input.publisher.name,
      logo: { '@type': 'ImageObject', url: input.publisher.logo },
    },
  };
  if (input.image) article.image = input.image;
  return article;
}

export function buildWebSiteSchema(input: {
  name: string;
  url: string;
  searchUrlTemplate?: string;
}) {
  const site: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: input.name,
    url: input.url,
  };
  if (input.searchUrlTemplate) {
    site.potentialAction = {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: input.searchUrlTemplate },
      'query-input': 'required name=search_term_string',
    };
  }
  return site;
}

export function buildBreadcrumbSchema(
  crumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function buildFaqSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** JSON-LD string safe to embed in a <script> tag (escapes `<`). */
export function serializeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}
