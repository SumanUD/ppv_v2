/**
 * Published Insights articles. The /insights/ index and the homepage Insights
 * section both render from this list, newest first. Each entry needs a matching
 * page at src/pages/insights/<slug>.astro.
 */
export interface Insight {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  /** ISO date, used for the BlogPosting schema. */
  published: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}

export const insights: Insight[] = [
  {
    slug: 'digital-transformation-in-marketing',
    tag: 'Blog',
    title: 'Unpacking Digital Transformation Through the Eyes of a Marketer',
    excerpt:
      'Digital transformation is more than tools. How marketers can connect customer insight, data, technology and governance to drive measurable growth.',
    readTime: '10 min read',
    published: '2026-11-03',
    image: '/insights/digital-transformation-in-marketing.webp',
    imageAlt: 'Laptop with strategy, content, audience and growth notes beneath connected digital marketing icons',
    imageWidth: 1520,
    imageHeight: 530,
  },
];

export const insightPath = (slug: string) => `/insights/${slug}/`;

export const getInsight = (slug: string) => insights.find((p) => p.slug === slug);
