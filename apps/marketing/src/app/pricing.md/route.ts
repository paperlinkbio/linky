import { PRICING_MARKDOWN } from '@/lib/pricing-text';

export const dynamic = 'force-static';

// Served at lin.ky/i/pricing.md (and lin.ky/pricing.md via the frontend
// rewrite): machine-readable pricing for AI agents comparing tools.
export function GET() {
  return new Response(
    `# Pricing: Linky

Linky is an open-source link-in-bio builder. Prices are in USD, billed monthly.
Human-readable version: https://lin.ky/i/pricing

${PRICING_MARKDOWN}
`,
    { headers: { 'content-type': 'text/markdown; charset=utf-8' } }
  );
}
