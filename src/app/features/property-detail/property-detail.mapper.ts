import { ProjectResponse } from '../../core/models/api.models';
import { LanguageSuffix } from '../../core/models/language';
import {
  DEVELOPER_LABELS,
  OVERVIEW_LABELS,
  YIELD_DISCLAIMER,
} from './property-detail.data';
import {
  DetailStat,
  DeveloperProfile,
  ExploreCard,
  OverviewFact,
  PaymentStage,
  PropertyDetailContent,
  UnitPlan,
} from './property-detail.models';

/** Resolves a backend image id to a streamable URL. */
export type ImageUrlResolver = (id: string) => string;

/** The middle tile of a card row is highlighted in the accent colour by design. */
const ACCENT_INDEX = 1;

function variant<T>(ge: T, en: T, ru: T, suffix: LanguageSuffix): T {
  if (suffix === 'Ge') {
    return ge;
  }
  return suffix === 'Ru' ? ru : en;
}

function toParagraphs(content: string): readonly string[] {
  return content
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

function formatMonthYear(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

function mapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

function buildDescriptionCards(
  project: ProjectResponse,
  suffix: LanguageSuffix,
): readonly DetailStat[] {
  return project.projectDescriptionCards.map((card, index) => ({
    label: variant(
      card.projectDescriptionCardTitleGe,
      card.projectDescriptionCardTitleEn,
      card.projectDescriptionCardTitleRu,
      suffix,
    ),
    value: variant(
      card.projectDescriptionCardContentGe,
      card.projectDescriptionCardContentEn,
      card.projectDescriptionCardContentRu,
      suffix,
    ),
    sub: variant(
      card.projectDescriptionCardDescriptionGe,
      card.projectDescriptionCardDescriptionEn,
      card.projectDescriptionCardDescriptionRu,
      suffix,
    ),
    accent: index === ACCENT_INDEX,
  }));
}

function buildInvestmentCards(
  project: ProjectResponse,
  suffix: LanguageSuffix,
): readonly DetailStat[] {
  return project.investmentCards.map((card, index) => ({
    label: variant(
      card.investmentCardTitleGe,
      card.investmentCardTitleEn,
      card.investmentCardTitleRu,
      suffix,
    ),
    value: variant(
      card.investmentCardContentGe,
      card.investmentCardContentEn,
      card.investmentCardContentRu,
      suffix,
    ),
    sub: variant(
      card.investmentCardDescriptionGe,
      card.investmentCardDescriptionEn,
      card.investmentCardDescriptionRu,
      suffix,
    ),
    accent: index === ACCENT_INDEX,
  }));
}

function buildOverviewFacts(
  project: ProjectResponse,
  suffix: LanguageSuffix,
): readonly OverviewFact[] {
  const facts: readonly OverviewFact[] = [
    {
      icon: 'building',
      label: OVERVIEW_LABELS.buildingType,
      value: variant(
        project.buildingTypeGe,
        project.buildingTypeEn,
        project.buildingTypeRu,
        suffix,
      ),
    },
    {
      icon: 'floors',
      label: OVERVIEW_LABELS.totalFloors,
      value: project.totalFloors ? String(project.totalFloors) : '',
    },
    {
      icon: 'units',
      label: OVERVIEW_LABELS.unitsInBuilding,
      value: project.unitsInBuilding ? String(project.unitsInBuilding) : '',
    },
    { icon: 'size', label: OVERVIEW_LABELS.unitSizes, value: project.unitSizesAvailable },
    {
      icon: 'finish',
      label: OVERVIEW_LABELS.finishing,
      value: variant(project.finishingGe, project.finishingEn, project.finishingRu, suffix),
    },
    {
      icon: 'furniture',
      label: OVERVIEW_LABELS.furniturePackage,
      value: variant(
        project.furniturePackageGe,
        project.furniturePackageEn,
        project.furniturePackageRu,
        suffix,
      ),
    },
    {
      icon: 'management',
      label: OVERVIEW_LABELS.strManagement,
      value: variant(
        project.strManagementOnSiteGe,
        project.strManagementOnSiteEn,
        project.strManagementOnSiteRu,
        suffix,
      ),
    },
    { icon: 'distance', label: OVERVIEW_LABELS.distanceToSea, value: project.distanceToSea },
    {
      icon: 'location',
      label: OVERVIEW_LABELS.distanceToCityCenter,
      value: project.distanceToCityCenter,
    },
  ];

  return facts.filter((fact) => fact.value.trim().length > 0);
}

function buildUnitPlans(
  project: ProjectResponse,
  imageUrl: ImageUrlResolver,
): readonly UnitPlan[] {
  const planImages = project.floorPlanImages;

  if (project.pricingBySquareMeters.length === 0) {
    return planImages.map((id, index) => ({
      type: `Floor plan ${index + 1}`,
      size: '',
      startingPrice: '',
      imageUrl: imageUrl(id),
    }));
  }

  return project.pricingBySquareMeters.map((pricing, index) => {
    // Pricing tiers are paired with floor plan images by position; the first image is the fallback.
    const planImage = planImages[index] ?? planImages[0];
    return {
      type: pricing.squareMeterRange,
      size: pricing.squareMeterRange,
      startingPrice: formatPrice(pricing.startingPrice),
      imageUrl: planImage ? imageUrl(planImage) : null,
    };
  });
}

function buildPaymentStages(
  project: ProjectResponse,
  suffix: LanguageSuffix,
): readonly PaymentStage[] {
  return project.paymentPlans.map((plan) => ({
    stage: variant(plan.paymentStageGe, plan.paymentStageEn, plan.paymentStageRu, suffix),
    amount: formatPrice(plan.paymentAmount),
    when: variant(plan.whenGe, plan.whenEn, plan.whenRu, suffix),
  }));
}

function buildDeveloper(
  project: ProjectResponse,
  suffix: LanguageSuffix,
): DeveloperProfile | null {
  const company = project.companyInfo;
  if (!company) {
    return null;
  }

  return {
    name: company.companyName,
    since: `Operating since ${company.operatingSince}`,
    location: variant(
      company.companyLocationGe,
      company.companyLocationEn,
      company.companyLocationRu,
      suffix,
    ),
    stats: [
      {
        icon: 'projects',
        label: DEVELOPER_LABELS.projectsCompleted,
        value: String(company.projectsCompleted),
      },
      {
        icon: 'units',
        label: DEVELOPER_LABELS.unitsDelivered,
        value: String(company.unitsDelivered),
      },
      {
        icon: 'key',
        label: DEVELOPER_LABELS.activeProjects,
        value: String(company.activeProjects),
      },
    ],
    quote: variant(
      company.companyDescriptionGe,
      company.companyDescriptionEn,
      company.companyDescriptionRu,
      suffix,
    ),
    footnote: `Developer data verified by our team as of ${formatMonthYear(project.lastVerified)}`,
  };
}

export function buildPropertyDetailContent(
  project: ProjectResponse,
  suffix: LanguageSuffix,
  imageUrl: ImageUrlResolver,
): PropertyDetailContent {
  const description = project.projectDescription;
  const galleryUrls = project.projectImages.map((id) => imageUrl(id));

  return {
    id: project._id,
    name: project.projectName,
    companyName: project.companyInfo?.companyName ?? '',
    location: variant(
      project.projectLocationGe,
      project.projectLocationEn,
      project.projectLocationRu,
      suffix,
    ),
    mapsUrl: mapsUrl(project.projectLatitude, project.projectLongitude),
    galleryUrls,
    summaryStats: buildDescriptionCards(project, suffix),
    tags: variant(
      project.projectAdvantagesGe,
      project.projectAdvantagesEn,
      project.projectAdvantagesRu,
      suffix,
    ),
    paymentNote: variant(
      project.paymentDescriptionGe,
      project.paymentDescriptionEn,
      project.paymentDescriptionRu,
      suffix,
    ),
    description: {
      title: variant(
        description.projectDescriptionTitleGe,
        description.projectDescriptionTitleEn,
        description.projectDescriptionTitleRu,
        suffix,
      ),
      paragraphs: toParagraphs(
        variant(
          description.projectDescriptionContentGe,
          description.projectDescriptionContentEn,
          description.projectDescriptionContentRu,
          suffix,
        ),
      ),
    },
    verification: {
      checks: variant(
        project.verificationChecklistGe,
        project.verificationChecklistEn,
        project.verificationChecklistRu,
        suffix,
      ),
      lastVerified: `Last verified: ${formatMonthYear(project.lastVerified)}`,
    },
    numbers: {
      stats: buildInvestmentCards(project, suffix),
      disclaimer: YIELD_DISCLAIMER,
    },
    overviewFacts: buildOverviewFacts(project, suffix),
    overviewImageUrl: galleryUrls[0] ?? null,
    unitPlans: buildUnitPlans(project, imageUrl),
    paymentPlan: {
      stages: buildPaymentStages(project, suffix),
      notes: variant(
        project.paymentAdvantagesGe,
        project.paymentAdvantagesEn,
        project.paymentAdvantagesRu,
        suffix,
      ),
    },
    developer: buildDeveloper(project, suffix),
  };
}

export function buildExploreCards(
  projects: readonly ProjectResponse[],
  suffix: LanguageSuffix,
  imageUrl: ImageUrlResolver,
): readonly ExploreCard[] {
  return projects.map((project) => ({
    id: project._id,
    name: project.projectName,
    location: variant(
      project.projectLocationGe,
      project.projectLocationEn,
      project.projectLocationRu,
      suffix,
    ),
    imageUrl: project.projectImages[0] ? imageUrl(project.projectImages[0]) : null,
  }));
}
