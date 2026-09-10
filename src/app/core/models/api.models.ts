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
  floorPlanImages: string[];
  pricingBySquareMeters: PricingBySquareMeter[];
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
