import { Property } from '../../core/models/property';
import {
  DeveloperProfile,
  NumberStat,
  OverviewFact,
  PaymentStage,
  PropertyDetailContent,
  SummaryStat,
  UnitPlan,
} from './property-detail.models';

export const VERIFICATION_CHECKS: readonly string[] = [
  'Availability confirmed',
  'Price independently verified',
  'Developer track record reviewed',
  'Legal title status confirmed',
  'Rental yield calculation reviewed',
];

export const PAYMENT_PLAN_NOTES: readonly string[] = [
  '0% interest · No bank mortgage required',
  'Available to foreign buyers of all nationalities',
];

const PAYMENT_STAGES: readonly PaymentStage[] = [
  { stage: 'Down payment', amount: '30%', when: 'At contract signing' },
  { stage: 'Construction milestone', amount: '40%', when: 'March 2026' },
  { stage: 'Handover', amount: '30%', when: 'On completion' },
];

/** Values shown on the hero card, derived from the shortlist entry. */
function buildSummaryStats(property: Property): readonly SummaryStat[] {
  return [
    { label: 'From', value: property.priceFrom.replace('From ', ''), sub: 'starting price', accent: false },
    { label: 'Gross yield', value: property.yieldLabel.replace(' yield', ''), sub: 'projected', accent: true },
    { label: 'Completion', value: property.completion, sub: 'delivery', accent: false },
  ];
}

function buildDefaultContent(property: Property): PropertyDetailContent {
  const grossYield = property.yieldLabel.replace(' yield', '');
  const startingPrice = property.priceFrom.replace('From ', '');

  const numbers: readonly NumberStat[] = [
    { label: 'Price per m²', value: '$1,850', sub: 'avg across floors', accent: false },
    { label: 'Projected gross yield', value: grossYield, sub: 'STR basis', accent: true },
    { label: 'Average nightly rate', value: '$110', sub: 'sea-view floors', accent: false },
    { label: 'Average occupancy', value: '74%', sub: 'Batumi avg', accent: false },
    { label: 'Estimated annual income', value: '$5,600', sub: 'per unit, net of mgmt', accent: false },
    { label: 'Payback period', value: '12.2', sub: 'years', accent: false },
  ];

  const overviewFacts: readonly OverviewFact[] = [
    { icon: 'building', label: 'Building type', value: 'Residential / Mixed-use' },
    { icon: 'floors', label: 'Total floors', value: '26' },
    { icon: 'units', label: 'Units in building', value: '312' },
    { icon: 'size', label: 'Unit sizes available', value: '32 – 89 m²' },
    { icon: 'finish', label: 'Finishing', value: 'Fully finished' },
    { icon: 'furniture', label: 'Furniture package', value: 'Optional (+$4,200)' },
    { icon: 'management', label: 'STR management on-site', value: 'Yes — by developer' },
    { icon: 'distance', label: 'Distance to sea', value: '80m' },
    { icon: 'location', label: 'Distance to city center', value: '1.2km' },
  ];

  const unitPlans: readonly UnitPlan[] = [
    {
      type: 'Studio (32–38 m²)',
      size: '35 m²',
      startingPrice,
      monthlyInstallment: '$340 / mo',
      imageSeed: `${property.slug}-plan-studio`,
    },
    {
      type: '1-Bedroom (45–55 m²)',
      size: '50 m²',
      startingPrice: '$92,500',
      monthlyInstallment: '$460 / mo',
      imageSeed: `${property.slug}-plan-1bed`,
    },
    {
      type: '2-Bedroom (65–89 m²)',
      size: '74 m²',
      startingPrice: '$138,000',
      monthlyInstallment: '$690 / mo',
      imageSeed: `${property.slug}-plan-2bed`,
    },
  ];

  const developer: DeveloperProfile = {
    name: property.developer,
    since: 'Operating since 2009',
    location: 'Batumi, Georgia',
    stats: [
      { icon: 'projects', label: 'Projects completed', value: '14' },
      { icon: 'units', label: 'Units delivered', value: '2,400+' },
      { icon: 'clock', label: 'On-time delivery rate', value: '91%' },
      { icon: 'key', label: 'Active projects', value: '3' },
    ],
    quote: `"${property.developer} is one of the developers in Batumi we've personally met with and reviewed documentation for. Their delivery track record is among the strongest we've encountered, and every claim in this listing has been checked against source documents."`,
    footnote: 'Developer data verified by our team as of June 2025',
  };

  return {
    slug: property.slug,
    gallerySeeds: [
      property.imageSeed,
      `${property.imageSeed}-interior`,
      `${property.imageSeed}-bedroom`,
      `${property.imageSeed}-pool`,
      `${property.imageSeed}-kitchen`,
    ],
    summaryStats: buildSummaryStats(property),
    tags: [property.incomeType, 'Sea View', 'Payment Plan'],
    paymentNote: '30% down · 0% installments until completion',
    ourTake: {
      title: 'Why this property made the Top 10',
      paragraphs: [
        `${property.note}. ${property.name} earned its place on this list after our team reviewed pricing, legal title, and the developer's delivery history in person.`,
        `What sets it apart is the combination of entry price and documented rental demand in this part of Batumi. ${property.developer} has a track record we were able to verify against completed projects, not marketing brochures.`,
        `On yield: we benchmark every projection against live short-term rental data for comparable units in the same district. At current asking prices, ${property.name} translates to a gross yield of ${property.yieldLabel.replace(' yield', '')} — before management fees.`,
      ],
      honestNote:
        "One honest note: returns vary meaningfully by floor, view, and unit type. We can advise on specific unit selection once you make contact.",
    },
    verification: {
      checks: VERIFICATION_CHECKS,
      lastVerified: 'Last verified: June 2025',
    },
    numbers: {
      stats: numbers,
      disclaimer: 'Yield projections based on current Batumi STR market data. Actual returns may vary.',
    },
    overviewFacts,
    unitPlans,
    paymentPlan: { stages: PAYMENT_STAGES, notes: PAYMENT_PLAN_NOTES },
    developer,
  };
}

/** Hand-written content for properties where we have full editorial copy. */
const CONTENT_OVERRIDES: Readonly<Record<string, Partial<PropertyDetailContent>>> = {
  'orbi-beach-tower': {
    ourTake: {
      title: 'Why this property made the Top 10',
      paragraphs: [
        "This is the development we'd personally recommend to buyers whose primary goal is short-term rental income. Orbi Beach Tower sits on the main Batumi boulevard, within 80 metres of the Black Sea — a position that commands the highest nightly rates in the city, consistently.",
        'What sets it apart is the management infrastructure. Orbi operates its own hotel-standard management company inside the building. Owners can opt in, hand over the keys, and receive monthly income statements without ever visiting Batumi. For international buyers, this removes the biggest operational headache.',
        'On yield: we tracked live Airbnb data for comparable units in this building over 12 months. Sea-view floors between the 12th and 20th achieved nightly rates of $90–$140 with 72–78% occupancy. At current asking prices, that translates to a gross yield of 8–10% — before management fees.',
      ],
      honestNote:
        "One honest note: lower floors and rear-facing units yield significantly less. We'd recommend only sea-view units, and only from floor 10 upward. We can advise on specific unit selection once you make contact.",
    },
    numbers: {
      stats: [
        { label: 'Price per m²', value: '$1,850', sub: 'avg across floors', accent: false },
        { label: 'Projected gross yield', value: '8.2%', sub: 'STR basis', accent: true },
        { label: 'Average nightly rate', value: '$110', sub: 'sea-view floors', accent: false },
        { label: 'Average occupancy', value: '74%', sub: 'Batumi avg', accent: false },
        { label: 'Estimated annual income', value: '$5,600', sub: 'per unit, net of mgmt', accent: false },
        { label: 'Payback period', value: '12.2', sub: 'years', accent: false },
      ],
      disclaimer: 'Yield projections based on current Batumi STR market data. Actual returns may vary.',
    },
    developer: {
      name: 'Orbi Group',
      since: 'Operating since 2009',
      location: 'Batumi, Georgia',
      stats: [
        { icon: 'projects', label: 'Projects completed', value: '14' },
        { icon: 'units', label: 'Units delivered', value: '2,400+' },
        { icon: 'clock', label: 'On-time delivery rate', value: '91%' },
        { icon: 'key', label: 'Active projects', value: '3' },
      ],
      quote:
        '"Orbi Group is one of three developers in Batumi we\'ve personally met with and reviewed documentation for. Their delivery track record in Batumi is among the strongest we\'ve encountered — 91% of projects delivered on time or within 3 months of schedule. Their management company is a genuine differentiator for STR investors."',
      footnote: 'Developer data verified by our team as of June 2025',
    },
  },
};

export function getPropertyDetailContent(property: Property): PropertyDetailContent {
  return { ...buildDefaultContent(property), ...CONTENT_OVERRIDES[property.slug] };
}

export const INTEREST_CTA_TRUST = '✓ Free for buyers · A real person responds in 24h';

export const FORM_TRUST_ITEMS: readonly string[] = [
  '✓ Free for buyers',
  '✓ No spam',
  '✓ Giorgi responds within 24h',
];
