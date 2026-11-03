import { contact } from './site';

const SITE = 'https://platformplayventure.com/';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE}#organization`,
  name: 'Platform Play Venture',
  alternateName: 'PPV',
  url: SITE,
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE}#logo`,
    url: `${SITE}newlogo.png`,
    caption: 'Platform Play Venture',
  },
  image: `${SITE}newlogo.png`,
  description:
    'Platform Play Venture is a strategic growth company that brings strategy, consulting, technology and marketing governance, through a fractional CMO approach, into one connected structure built on clarity, direction and momentum.',
  slogan: 'Clarity, Direction, Momentum',
  email: contact.email,
  telephone: contact.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: contact.address.street,
    addressLocality: contact.address.city,
    addressRegion: contact.address.region,
    postalCode: contact.address.postalCode,
    addressCountry: contact.address.country,
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: contact.email,
      telephone: contact.phone,
      availableLanguage: 'English',
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    },
  ],
  knowsAbout: [
    'Strategic growth',
    'Brand strategy',
    'Marketing strategy',
    'Consumer mindset mapping',
    'Marketing governance',
    'Fractional CMO',
    'Technology development and digital platforms',
    'Digital and technology maturity',
    'Growth alignment',
    'Training and capability development',
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}#website`,
  url: SITE,
  name: 'Platform Play Venture',
  description:
    'Platform Play Venture turns scattered strategy, technology, and decision-making into one structured growth system.',
  inLanguage: 'en',
  publisher: { '@id': `${SITE}#organization` },
};

/** Must stay word-for-word in sync with the questions in components/sections/Faq.astro. */
const faqs: [string, string][] = [
  [
    'How does an engagement with Platform Play Venture typically begin?',
    'The process usually begins with understanding the current position of the brand, the decisions being made today, and what the business is trying to achieve next. The first step focuses on identifying gaps in clarity and direction before defining the right strategic path forward.',
  ],
  [
    'What happens after the strategy is defined?',
    'Our role does not end at strategy. Platform Play Venture stays involved in guiding direction, supporting leadership and marketing teams in decision-making, and ensuring that the strategy translates into consistent progress over time.',
  ],
  [
    'How does Platform Play Venture work alongside internal teams?',
    'The approach is collaborative. The focus is on strengthening clarity, improving alignment, and helping internal teams operate with a clearer sense of direction rather than replacing what already exists.',
  ],
  [
    'At what stage of a brand does working with PPV make the most sense?',
    'It works best when a business is growing but feels that marketing efforts are not fully aligned with business goals, or when the brand is entering a new phase and needs clearer direction before scaling further.',
  ],
  [
    'What can a brand realistically expect after working with Platform Play Venture?',
    'The biggest change is usually clarity. Businesses start understanding what to prioritise, what to avoid, and how different parts of marketing, technology, and brand perception should work together. That clarity makes future decisions faster and more confident.',
  ],
  [
    'What does working with a fractional CMO actually mean?',
    'A fractional CMO means working with an experienced strategic partner who supports leadership and marketing teams in planning, decision-making, and guiding marketing direction — without the need for a full-time in-house CMO. The role is senior, embedded, and accountable to outcomes, not headcount.',
  ],
];

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE}#faq`,
  url: SITE,
  isPartOf: { '@id': `${SITE}#website` },
  mainEntity: faqs.map(([name, text]) => ({
    '@type': 'Question',
    name,
    acceptedAnswer: { '@type': 'Answer', text },
  })),
};
