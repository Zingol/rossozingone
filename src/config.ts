export const siteConfig = {
  name: 'RossoZingone',
  legalName: 'RossoZingone Srl Unipersonale',
  tagline: 'AI-Integrated Fractional Executive | CMO • CEO',
  description: 'Consulenza direzionale AI-integrated per PMI. Fractional CMO e CEO — direzione marketing e gestione aziendale part-time.',
  url: 'https://rossozingone.it',
  email: 'info@rossozingone.it',
  phone: '+39 333 647 2122',
  phoneDisplay: '+39 333.647.2122',
  linkedin: 'https://www.linkedin.com/in/francescorossozingone/',
  address: {
    street: 'Viale XI Febbraio 29',
    city: 'Pesaro',
    province: 'PU',
    cap: '61121',
    full: 'Viale XI Febbraio 29, 61121 Pesaro (PU)',
  },
  piva: '02866620418',
  founder: 'Francesco Zingone',
  yearFounded: 1998,
  yearsExperience: 27,
} as const;

export const navigation = [
  { label: 'Chi Sono', href: '/chi-sono/' },
  { label: 'Servizi', href: '/servizi/' },
  { label: 'Clienti', href: '/clienti/' },
  { label: 'Contatti', href: '/contatti/' },
] as const;

// CTA generale — usata da CtaFinal, homepage hero, ecc.
export const ctaLabel = 'Contattami';
export const ctaHref = '/contatti/';

// CTA Discovery Day — usata solo nella navbar
export const discoveryLabel = 'Prenota un Discovery Day';
export const discoveryHref = 'https://tidycal.com/rossozingone';
