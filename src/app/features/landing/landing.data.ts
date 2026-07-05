import { WHATSAPP_URL } from '../../core/data/site.data';
import { Agent, FaqEntry, ProcessStep, YieldStat } from './landing.models';

export const HERO_CHIPS: readonly string[] = [
  '8.6% avg rental yield',
  'From $45,000',
  'Foreigners buy freely — no restrictions',
];

export const HERO_TRUST_ITEMS: readonly string[] = [
  '200+ developments reviewed',
  'Prices independently verified',
  'Developer track records checked',
  'Free for buyers',
];

export const YIELD_STATS: readonly YieldStat[] = [
  { city: 'Batumi', value: '8.6%', barPercent: 100, highlight: true },
  { city: 'Istanbul', value: '5.4%', barPercent: 63, highlight: false },
  { city: 'Dubai', value: '6.7%', barPercent: 78, highlight: false },
];

export const ACCESS_POINTS: readonly string[] = [
  'No property tax',
  'Foreigners buy freely',
  'Purchase completes in 1 day',
  'No residency required',
];

export const MARKET_QUOTE =
  '"After reviewing every major development currently on market in Batumi, here is what our team found worth your attention: a small number of projects that combine serious yields, credible developers, and real exit potential."';

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    icon: 'search',
    title: 'Browse the Shortlist',
    description: 'Review our 10 verified properties, each ranked by yield, location, and developer credibility.',
  },
  {
    icon: 'clipboard',
    title: 'Tell Us What You Need',
    description: 'Share your budget, timeline, and goals. We match you to the right 2–3 properties.',
  },
  {
    icon: 'chat',
    title: 'We Connect You Directly',
    description: 'We introduce you to the developer and support the purchase process at no cost to you.',
  },
];

export const PROCESS_NOTE = 'We work for buyers. Our fee comes from developers. You pay nothing.';

export const VERIFICATION_CHECKS: readonly string[] = [
  'Availability confirmed directly with developer',
  'Price per m² independently verified',
  'Developer delivery history reviewed',
  'Legal title status confirmed',
];

export const VERIFICATION_NOTE = "We reviewed 200+ developments. 190 didn't make the cut.";

export const AGENT: Agent = {
  name: 'Giorgi Makarov',
  role: 'Senior Property Advisor · Tbilisi, Georgia',
  bio: '7 years reviewing Georgian real estate. Personally visited every property on this list.',
  photoUrl: 'https://i.pravatar.cc/160?img=53',
  whatsappUrl: WHATSAPP_URL,
};

export const FAQ_ENTRIES: readonly FaqEntry[] = [
  {
    question: 'Can foreigners buy property in Georgia?',
    answer:
      'Yes — Georgia allows citizens of most countries to purchase freehold property with no restrictions. The process is the same as for Georgian citizens. Over 50 nationalities have bought property in Batumi without any issues.',
  },
  {
    question: 'How long does the purchase take?',
    answer:
      'A standard purchase completes in one working day at the Public Service Hall. You need your passport and the sale agreement — the title transfer is registered the same day and can even be done remotely with a power of attorney.',
  },
  {
    question: 'What taxes do I pay?',
    answer:
      'Georgia has no annual property tax for most foreign owners and no tax on the purchase itself. Rental income is taxed at a flat 5% for individuals registered as landlords, which is among the lowest rates in the region.',
  },
  {
    question: 'Can I get a mortgage as a foreigner?',
    answer:
      'Georgian banks rarely lend to non-residents, but most developers on our list offer interest-free installment plans of 12–36 months with 20–30% down, which is how the majority of foreign buyers structure their purchase.',
  },
  {
    question: 'How do I manage the property remotely?',
    answer:
      'Every property on our shortlist either has an in-house management company or an established local operator. They handle guests, cleaning, and maintenance for 15–25% of rental income and send you monthly reports.',
  },
  {
    question: 'What rental income can I realistically expect?',
    answer:
      'Sea-view apartments in good locations gross 8–10% annually on short-term rental. After management fees and utilities, a realistic net figure is 6–8%. We show verified numbers, not developer marketing projections.',
  },
  {
    question: 'Is my investment legally protected?',
    answer:
      'Property rights in Georgia are registered in a transparent public registry ranked among the safest in the region by the World Bank. Title insurance is available, and every project on this list has confirmed clean title.',
  },
  {
    question: 'What is the resale market like?',
    answer:
      'Batumi has an active secondary market driven by tourism growth and rising construction costs. Completed sea-view units typically resell within 2–4 months. We advise on exit strategy before you buy, not after.',
  },
];

export const FORM_PROPERTY_HINT = "Pre-selected when you click 'I'm Interested' on a card";

export const FORM_TRUST_ITEMS: readonly string[] = [
  '✓ Free for buyers',
  '✓ No spam',
  '✓ A real person responds within 24 hours',
];
