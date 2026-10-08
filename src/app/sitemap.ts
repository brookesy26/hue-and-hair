import type { MetadataRoute } from 'next';
import { getHairstyles, getPalettes } from '@/lib/content';
import { siteUrl } from './site-url';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '',
    'hairstyles',
    'colour-analysis',
    'self-assessment',
    'about',
    'privacy',
    'accessibility',
    ...getHairstyles().map((h) => `hairstyles/${h.slug}`),
    ...getPalettes().map((p) => `colour-analysis/${p.slug}`),
  ].map((p) => ({ url: `${siteUrl}/${p}${p ? '/' : ''}` }));
}
