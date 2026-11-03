/**
 * Business contact details (NAP). Keep these identical to the Google Business
 * Profile so search engines can corroborate the listing against the site.
 */
export const contact = {
  email: 'contact@platformplayventure.com',
  phone: '+91 98306 01360',
  phoneHref: 'tel:+919830601360',
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

/** Only channels PPV actively runs. X and Instagram return once those accounts are live. */
export const social = {
  linkedin: 'https://www.linkedin.com/company/platform-play-venture/',
  youtube: 'https://www.youtube.com/@platformplayventure-m7c',
};
