import { getLearnPosts } from '@/app/learn/utils';
import { alternatives } from '@/content/alternatives';
import { integrations } from '@/content/integrations';
import { niches } from '@/content/niches';
import { PRICING_MARKDOWN } from '@/lib/pricing-text';

export const dynamic = 'force-static';

const BASE = 'https://lin.ky/i';

export async function GET() {
  const learnPosts = await getLearnPosts();

  const body = `# Linky

> Linky is an open-source link-in-bio builder. You get one link, like
> lin.ky/yourname, that opens a page built from blocks: links plus live
> content from Spotify, Instagram, TikTok, Threads and GitHub. Free to start;
> Premium ($4/month) adds custom domains, analytics and unlimited blocks.

Source code: https://github.com/trylinky/linky

## Core
- [Home](https://lin.ky): What Linky is and how to start
- [Pricing](${BASE}/pricing): Free, Premium and Team plans ([markdown](${BASE}/pricing.md))
- [Explore](${BASE}/explore): Example public pages
- [Templates](${BASE}/templates): Themes to start a page from

## Pricing
${PRICING_MARKDOWN.replace(/^## /gm, '### ')}

## Integrations
${integrations.map((i) => `- [${i.name}](${BASE}/integrations/${i.slug})`).join('\n')}

## Compare
${alternatives.map((a) => `- [Linky vs ${a.competitor}](${BASE}/alternatives/${a.slug})`).join('\n')}

## Link in bio for
${niches.map((n) => `- [${n.name}](${BASE}/for/${n.slug})`).join('\n')}

## Learn
${learnPosts.map((p) => `- [${p.title}](${BASE}/learn/${p.slug}): ${p.description}`).join('\n')}

## Optional
- [Blog](${BASE}/blog): Product updates and guides
`;

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
