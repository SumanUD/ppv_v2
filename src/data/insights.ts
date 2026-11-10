/**
 * Published Insights articles. The /insights/ index and the homepage Insights
 * section both render from this list, newest first. Each entry needs a matching
 * page at src/pages/insights/<slug>.astro.
 */
export interface Author {
  name: string;
  url: string;
}

export const mitulDas: Author = {
  name: 'Mitul Das',
  url: 'https://www.linkedin.com/in/mituld/',
};

export interface Insight {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  /** ISO date, shown in the article byline and used for the BlogPosting schema. */
  published: string;
  /** Longer summary used as the BlogPosting schema description. */
  schemaDescription: string;
  author: Author;
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
    published: '2026-11-06',
    schemaDescription:
      'This blog explores how digital transformation is changing the role of marketers by connecting customer insights, data, technology, and business strategy. It highlights five key shifts that help businesses improve customer experiences, make data-driven decisions, align marketing with business goals, and achieve sustainable growth through effective digital transformation.',
    author: mitulDas,
    image: '/insights/digital-transformation-in-marketing.webp',
    imageAlt: 'Laptop with strategy, content, audience and growth notes beneath connected digital marketing icons',
    imageWidth: 1520,
    imageHeight: 530,
  },
  {
    slug: 'how-to-define-brand-positioning',
    tag: 'Blog',
    title: '5 Steps to Define Your Brand Positioning',
    excerpt:
      "Learn how to define brand positioning in 5 steps: assess how you're perceived, know your audience, find real differentiation and apply it consistently.",
    readTime: '8 min read',
    published: '2026-11-01',
    schemaDescription:
      'This blog explains five practical steps to build a strong brand positioning strategy: understanding your current brand perception, identifying your target audience, defining your unique differentiation, establishing a clear market position, and maintaining consistency across all business activities. It highlights how effective brand positioning helps businesses build customer trust, stand out from competitors, and create long-term brand value.',
    author: mitulDas,
    image: '/insights/how-to-define-brand-positioning.webp',
    imageAlt:
      'Infographic of the five brand positioning steps: understand where your brand stands, define your audience, identify differentiation, define your position and apply it consistently',
    imageWidth: 1520,
    imageHeight: 530,
  },
];

export const insightPath = (slug: string) => `/insights/${slug}/`;

export const getInsight = (slug: string) => insights.find((p) => p.slug === slug);

/** "2026-11-01" -> "1 November 2026" (parsed as UTC so the day never shifts). */
export const formatPublished = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
