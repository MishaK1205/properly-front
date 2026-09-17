import { ProjectResponse } from '../../core/models/api.models';
import { LanguageSuffix } from '../../core/models/language';
import { projectSlug } from '../../core/utils/project-slug';
import {
  DEVELOPER_FOOTNOTE,
  DEVELOPER_LABELS,
  OVERVIEW_LABELS,
  YIELD_DISCLAIMER,
} from './property-detail.data';
import {
  DeveloperProfile,
  ExploreCard,
  OverviewFact,
  PaymentStage,
  PropertyDetailContent,
  UnitPlan,
} from './property-detail.models';

/** Resolves a backend image id to a streamable URL. */
export type ImageUrlResolver = (id: string) => string;

function variant<T>(ge: T, en: T, ru: T, suffix: LanguageSuffix): T {
  if (suffix === 'Ge') {
    return ge;
  }
  return suffix === 'Ru' ? ru : en;
}

function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

function mapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

/** The summary cards are authored as rich text, so each one is a single HTML string. */
function buildDescriptionCards(
  project: ProjectResponse,
  suffix: LanguageSuffix,
): readonly string[] {
  return project.projectDescriptionCards
    .map((card) =>
      variant(
        card.projectDescriptionCardContentGe,
        card.projectDescriptionCardContentEn,
        card.projectDescriptionCardContentRu,
        suffix,
      ),
    )
    .filter((html) => html.trim().length > 0);
}

/** The breakdown tiles are authored as rich text, so each one is a single HTML string. */
function buildInvestmentCards(
  project: ProjectResponse,
  suffix: LanguageSuffix,
): readonly string[] {
  return project.investmentCards
    .map((card) =>
      variant(
        card.investmentCardContentGe,
        card.investmentCardContentEn,
        card.investmentCardContentRu,
        suffix,
      ),
    )
    .filter((html) => html.trim().length > 0);
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

/** One entry per apartment type, each carrying only its own plan images and cards. */
function buildUnitPlans(
  project: ProjectResponse,
  suffix: LanguageSuffix,
  imageUrl: ImageUrlResolver,
): readonly UnitPlan[] {
  return project.apartmentPlans
    .filter((plan) => plan.apartmentType.trim().length > 0)
    .map((plan) => ({
      type: plan.apartmentType,
      imageUrls: plan.apartmentPlanImages.map((id) => imageUrl(id)),
      cards: variant(
        plan.apartmentCardsGe,
        plan.apartmentCardsEn,
        plan.apartmentCardsRu,
        suffix,
      ).filter((html) => html.trim().length > 0),
    }));
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
    footnote: DEVELOPER_FOOTNOTE,
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
    summaryCards: buildDescriptionCards(project, suffix),
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
    description: variant(
      description.projectDescriptionGe,
      description.projectDescriptionEn,
      description.projectDescriptionRu,
      suffix,
    ),
    verification: {
      checks: variant(
        project.verificationChecklistGe,
        project.verificationChecklistEn,
        project.verificationChecklistRu,
        suffix,
      ),
    },
    numbers: {
      stats: buildInvestmentCards(project, suffix),
      disclaimer: YIELD_DISCLAIMER,
    },
    overviewFacts: buildOverviewFacts(project, suffix),
    overviewImageUrl: galleryUrls[0] ?? null,
    unitPlans: buildUnitPlans(project, suffix, imageUrl),
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
    slug: projectSlug(project),
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
