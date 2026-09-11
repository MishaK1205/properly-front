/**
 * Interfaces mirroring the backend (real-estate-investment-back) entities and DTOs.
 * All entities are Mongo documents serialized with `_id` + timestamps.
 */

export interface MongoDocument {
  readonly _id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/* ---------- Auth ---------- */

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  exp?: number;
}

/* ---------- Company ---------- */

export interface CreateCompanyDto {
  companyName: string;
  projectsCompleted: number;
  unitsDelivered: number;
  activeProjects: number;
  operatingSince: number;
  companyLocationGe: string;
  companyLocationEn: string;
  companyLocationRu: string;
  companyDescriptionGe: string;
  companyDescriptionEn: string;
  companyDescriptionRu: string;
}

export type UpdateCompanyDto = Partial<CreateCompanyDto>;

export type Company = MongoDocument & CreateCompanyDto;

/* ---------- Image ---------- */

export interface Image extends MongoDocument {
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
}

/* ---------- Project ---------- */

/** One summary card of the hero, written as rich text HTML in the admin editor. */
export interface ProjectDescriptionCard {
  projectDescriptionCardContentGe: string;
  projectDescriptionCardContentEn: string;
  projectDescriptionCardContentRu: string;
}

/**
 * The "Our Take" write-up. The long form is rich text HTML carrying its own heading;
 * the short one is the plain teaser of the shortlist card on the home page.
 */
export interface ProjectDescription {
  projectDescriptionGe: string;
  projectDescriptionEn: string;
  projectDescriptionRu: string;
  projectShortDescriptionGe: string;
  projectShortDescriptionEn: string;
  projectShortDescriptionRu: string;
}

/** One tile of the investment breakdown, written as rich text HTML in the admin editor. */
export interface InvestmentCard {
  investmentCardContentGe: string;
  investmentCardContentEn: string;
  investmentCardContentRu: string;
}

/**
 * One apartment type of the Floor Plans tab, with the plan images belonging to it and the
 * highlight cards shown beside them. Each card is rich text HTML; the three language arrays
 * hold the same cards in the same order.
 */
export interface ApartmentPlan {
  apartmentType: string;
  apartmentPlanImages: string[];
  apartmentCardsGe: string[];
  apartmentCardsEn: string[];
  apartmentCardsRu: string[];
}

export interface PaymentPlan {
  paymentStageGe: string;
  paymentStageEn: string;
  paymentStageRu: string;
  paymentAmount: number;
  whenGe: string;
  whenEn: string;
  whenRu: string;
}

export interface CreateProjectDto {
  projectName: string;
  projectImages: string[];
  projectLocationGe: string;
  projectLocationEn: string;
  projectLocationRu: string;
  projectLatitude: number;
  projectLongitude: number;
  projectDescriptionCards: ProjectDescriptionCard[];
  projectAdvantagesGe: string[];
  projectAdvantagesEn: string[];
  projectAdvantagesRu: string[];
  paymentDescriptionGe: string;
  paymentDescriptionEn: string;
  paymentDescriptionRu: string;
  projectDescription: ProjectDescription;
  verificationChecklistGe: string[];
  verificationChecklistEn: string[];
  verificationChecklistRu: string[];
  investmentCards: InvestmentCard[];
  buildingTypeGe: string;
  buildingTypeEn: string;
  buildingTypeRu: string;
  totalFloors: number;
  unitsInBuilding: number;
  unitSizesAvailable: string;
  finishingGe: string;
  finishingEn: string;
  finishingRu: string;
  furniturePackageGe: string;
  furniturePackageEn: string;
  furniturePackageRu: string;
  strManagementOnSiteGe: string;
  strManagementOnSiteEn: string;
  strManagementOnSiteRu: string;
  distanceToSea: string;
  distanceToCityCenter: string;
  apartmentPlans: ApartmentPlan[];
  paymentPlans: PaymentPlan[];
  paymentAdvantagesGe: string[];
  paymentAdvantagesEn: string[];
  paymentAdvantagesRu: string[];
  company: string;
}

export type UpdateProjectDto = Partial<CreateProjectDto>;

/** Response shape: `company` is replaced with a populated `companyInfo` object. */
export interface ProjectResponse extends MongoDocument, Omit<CreateProjectDto, 'company'> {
  companyInfo: Company | null;
}

/* ---------- Get in touch (filled applications) ---------- */

export interface CreateGetInTouchDto {
  project: string;
  fullName: string;
  whatsAppNumber: string;
  budgetRange: string;
  investmentPurpose: string;
}

export type GetInTouch = MongoDocument & CreateGetInTouchDto;

export interface PopulatedProjectSummary {
  _id: string;
  projectName: string;
  projectLocationGe: string;
  projectLocationEn: string;
  projectLocationRu: string;
}

export interface GetInTouchWithProject extends MongoDocument, Omit<CreateGetInTouchDto, 'project'> {
  project: PopulatedProjectSummary | null;
}
