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
  yearsExperience: 28,
} as const;

export const navigation = [
  { label: 'Chi Sono', href: '/chi-sono/' },
  { label: 'Fractional CMO/CEO', href: '/servizi/fractional-cmo-ceo/' },
  { label: 'AI Integration', href: '/servizi/intelligenza-artificiale-per-pmi/' },
  { label: 'Advisory', href: '/servizi/advisory/' },
  { label: 'Clienti', href: '/clienti/' },
  { label: 'Contatti', href: '/contatti/' },
] as const;

export const servicePillars = [
  { label: 'Fractional CMO/CEO', href: '/servizi/fractional-cmo-ceo/' },
  { label: 'AI Integration', href: '/servizi/intelligenza-artificiale-per-pmi/' },
  { label: 'Advisory & Discovery', href: '/servizi/advisory/' },
] as const;

// CTA generale — usata da CtaFinal, homepage hero, ecc.
export const ctaLabel = 'Prenota una Discovery Session';
export const ctaHref = 'https://tidycal.com/rossozingone';

// CTA Discovery Session — usata solo nella navbar
export const discoveryLabel = 'Prenota una Discovery Session';
export const discoveryHref = 'https://tidycal.com/rossozingone';
