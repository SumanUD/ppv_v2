/**
 * Business contact details (NAP). Keep these identical to the Google Business
 * Profile so search engines can corroborate the listing against the site.
 */
export const contact = {
  email: 'contact@platformplayventure.com',
  phone: '+91 79808 26489',
  phoneHref: 'tel:+917980826489',
  address: {
    street: '5th Floor, Devi Market, 83 Shyama Prasad Mukherjee Road',
    locality: 'Bhowanipore, Kolkata',
    city: 'Kolkata',
    region: 'West Bengal',
    postalCode: '700026',
    country: 'IN',
  },
  hours: 'Mon — Fri · 9:00 — 18:00',
};

export const fullAddress = `${contact.address.street}, ${contact.address.locality}, ${contact.address.region} ${contact.address.postalCode}`;

export const website = 'https://www.platformplayventure.com';

/** Only channels PPV actively runs. */
export const social = {
  instagram: 'https://www.instagram.com/platformplayventure/',
  facebook: 'https://www.facebook.com/profile.php?id=61594339535834',
  youtube: 'https://www.youtube.com/@platformplayventure-m7c',
  linkedin: 'https://www.linkedin.com/company/platform-play-venture/',
};
