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

export interface ProjectDescriptionCard {
  projectDescriptionCardTitleGe: string;
  projectDescriptionCardTitleEn: string;
  projectDescriptionCardTitleRu: string;
  projectDescriptionCardContentGe: string;
  projectDescriptionCardContentEn: string;
  projectDescriptionCardContentRu: string;
  projectDescriptionCardDescriptionGe: string;
  projectDescriptionCardDescriptionEn: string;
  projectDescriptionCardDescriptionRu: string;
}

export interface ProjectDescription {
  projectDescriptionTitleGe: string;
  projectDescriptionTitleEn: string;
  projectDescriptionTitleRu: string;
  projectDescriptionContentGe: string;
  projectDescriptionContentEn: string;
  projectDescriptionContentRu: string;
  projectShortDescriptionGe: string;
  projectShortDescriptionEn: string;
  projectShortDescriptionRu: string;
}

export interface InvestmentCard {
  investmentCardTitleGe: string;
  investmentCardTitleEn: string;
  investmentCardTitleRu: string;
  investmentCardContentGe: string;
  investmentCardContentEn: string;
  investmentCardContentRu: string;
  investmentCardDescriptionGe: string;
  investmentCardDescriptionEn: string;
  investmentCardDescriptionRu: string;
}

export interface PricingBySquareMeter {
  squareMeterRange: string;
  startingPrice: number;
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

/**
 * Only the fields below without `?` are required by the backend. Optional fields may be omitted,
 * or sent as `null` to clear a stored value — but never as an empty string, which the backend
 * rejects. Nested objects are all-or-nothing: every field inside them must be filled.
 */
export interface CreateProjectDto {
  projectName: string;
  projectImages: string[];
  projectLocationEn: string;
  projectLatitude: number;
  projectLongitude: number;
  floorPlanImages: string[];
  company: string;
  projectLocationGe?: string | null;
  projectLocationRu?: string | null;
  projectDescriptionCards?: ProjectDescriptionCard[];
  projectAdvantagesGe?: string[];
  projectAdvantagesEn?: string[];
  projectAdvantagesRu?: string[];
  paymentDescriptionGe?: string | null;
  paymentDescriptionEn?: string | null;
  paymentDescriptionRu?: string | null;
  projectDescription?: ProjectDescription | null;
  verificationChecklistGe?: string[];
  verificationChecklistEn?: string[];
  verificationChecklistRu?: string[];
  lastVerified?: string | null;
  investmentCards?: InvestmentCard[];
  buildingTypeGe?: string | null;
  buildingTypeEn?: string | null;
  buildingTypeRu?: string | null;
  totalFloors?: number | null;
  unitsInBuilding?: number | null;
  unitSizesAvailable?: string | null;
  finishingGe?: string | null;
  finishingEn?: string | null;
  finishingRu?: string | null;
  furniturePackageGe?: string | null;
  furniturePackageEn?: string | null;
  furniturePackageRu?: string | null;
  strManagementOnSiteGe?: string | null;
  strManagementOnSiteEn?: string | null;
  strManagementOnSiteRu?: string | null;
  distanceToSea?: string | null;
  distanceToCityCenter?: string | null;
  pricingBySquareMeters?: PricingBySquareMeter[];
  paymentPlans?: PaymentPlan[];
  paymentAdvantagesGe?: string[];
  paymentAdvantagesEn?: string[];
  paymentAdvantagesRu?: string[];
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
