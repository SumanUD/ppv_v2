import { contact, social } from './site';
import { pageFaqs } from './faqs';

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
  sameAs: Object.values(social),
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

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE}#faq`,
  url: SITE,
  isPartOf: { '@id': `${SITE}#website` },
  mainEntity: pageFaqs['/'].map(([name, text]) => ({
    '@type': 'Question',
    name,
    acceptedAnswer: { '@type': 'Answer', text },
  })),
};
